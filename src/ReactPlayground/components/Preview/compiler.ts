import { transform } from "@babel/standalone";
import { Files } from "@/ReactPlayground/context/PlaygroundContext";
import { ENTRY_FILE_NAME } from "@/ReactPlayground/initFiles";
import { PluginObj } from "@babel/core";
import { EditorFile } from "@/types";

/*
    babel: Parse ---> Transform ---> Generate
    ./App.css
*/

const getModuleFile = (files: Files, modulePath: string) => {
  let moduleName = modulePath.split("./").pop() || "";
  // 省略了后缀的情况
  if (!moduleName.includes(".")) {
    const realModuleName = Object.keys(files)
      .filter((fileName) => {
        return (
          fileName.endsWith(".ts") ||
          fileName.endsWith(".js") ||
          fileName.endsWith(".jsx") ||
          fileName.endsWith(".tsx")
        );
      })
      .find((fileName) => {
        return fileName.split(".").includes(moduleName);
      });
    moduleName = realModuleName || moduleName;
  }
  return files[moduleName];
};

// JSON文件导出之后再处理成 blob url
const json2JS = (file: EditorFile) => {
  const js = `export default ${file.code}`;
  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

// CSS文件需要添加到head里的style标签中(IIFE)
const css2JS = (file: EditorFile) => {
  const randomId = new Date().getTime();
  const js = `
(()=>{
  const stylesheet = document.createElement('style');
  stylesheet.setAttribute('id', 'style_${randomId}_${file.name}');
  document.head.appendChild(stylesheet);

  const styles = document.createTextNode(\`${file.code}\`);
  stylesheet.innerHTML = '';
  stylesheet.appendChild(styles);
})()
  `;

  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

const customResolver = (files: Files): PluginObj => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;
        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath);
          if (!file) return;

          if (file.name.endsWith(".css")) {
            path.node.source.value = css2JS(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2JS(file);
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.code, files)], {
                type: "application/javascript",
              })
            );
          }
        }
      },
    },
  };
};

export const babelTransformCode = (filename:string, code:string) => {
  let _code = code;
  const regexReact = /import React from "react";/g;

  if((filename.endsWith('.tsx') || filename.endsWith('.jsx')) && !regexReact.test(code)) {
    _code = `import React from 'react';\n${code}`;
  }

  return _code;
}


export const babelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  const _code = babelTransformCode(filename, code);
  let result = "";
  try {
    result = transform(_code, {
      presets: ["react", "typescript"], // 对 jsx 和 ts 语法做处理
      filename,
      plugins: [customResolver(files)],
      retainLines: true, // 编译后保持原有行列号不变。
    }).code!;
  } catch (error) {
    console.log("编译出错了~", error);
  }
  return result;
};

export const compile = (files: Files) => {
  const target = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, target.code, files);
};

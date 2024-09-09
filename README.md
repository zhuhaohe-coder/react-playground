# 集成TailwindCSS

- 使用以下命令安装 `Tailwind CSS` 及其依赖项：

```bash
pnpm install -D tailwindcss postcss autoprefixer
```

- 初始化 Tailwind CSS

接下来，运行以下命令生成 `tailwind.config.js` 和 `postcss.config.js` 配置文件：

```bash
npx tailwindcss init -p
```

- 配置 `tailwind.config.js`

在 `tailwind.config.js` 文件中配置 `content` 选项，指定要扫描的模板文件。修改文件如下：

```ts
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- 配置 `src/index.css`

在 `src/index.css` 文件中添加以下 `Tailwind` 指令：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# 配置Playground支持ts代码提示

使用@typescript/ata，在编辑器初始化和修改代码时，将代码传给`ata`，其会自动分析，通过jsdeliver提供的API进行声明文件的下载

`ata.ts`

```ts
import { setupTypeAcquisition } from "@typescript/ata";
import typescript from "typescript";

export function createATA(
  onDownloadFile: (code: string, path: string) => void
) {
  const ata = setupTypeAcquisition({
    projectName: "my-ata",
    typescript,
    logger: console,
    delegate: {
      receivedFile: (code, path) => {
        onDownloadFile(code, path);
      },
    },
  });

  return ata;
}
```

`Editor`

```ts
  const handleEditorMount: OnMount = (editor, monaco) => {
    const ata = createATA((code, path) => {
      console.log(path);
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });

    editor.onDidChangeModelContent(() => {
      console.log(editor.getValue());
      ata(editor.getValue());
    });

    ata(editor.getValue());
    console.log(editor.getValue());
  };
```

# 编译

> 通过babel插件来处理import语句，转换成blob url的形式
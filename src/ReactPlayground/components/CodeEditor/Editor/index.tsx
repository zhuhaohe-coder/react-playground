import MonacoEditor, { EditorProps, OnMount } from "@monaco-editor/react";
import { createATA } from "./ata";
import { editor } from "monaco-editor";
import { EditorFile } from "@/types";

interface Props {
  file: EditorFile;
  onChange?: EditorProps["onChange"];
  options?: editor.IStandaloneEditorConstructionOptions;
}

function Editor(props: Props) {
  const { file, onChange, options } = props;

  const handleEditorMount: OnMount = (editor, monaco) => {
    // 格式化快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });

    // 设置tsx的默认配置
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });

    // 在初始化和更新时添加额外的声明文件，以保证类型提示生效
    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());
  };

  return (
    <MonacoEditor
      height="100%"
      language={file.language}
      value={file.code}
      onMount={handleEditorMount}
      path={file.name}
      onChange={onChange}
      options={{
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        ...options,
      }}
    />
  );
}

export default Editor;

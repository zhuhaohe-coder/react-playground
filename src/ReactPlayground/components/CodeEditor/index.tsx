import { useContext } from "react";
import Editor from "./Editor";
import FileNameList from "./FileNameList";
import { PlaygroundContext } from "@/ReactPlayground/context/PlaygroundContext";
import { debounce } from "lodash-es";

function CodeEditor() {
  const { files, selectedFileName, setFiles, theme } = useContext(PlaygroundContext);

  const file = files[selectedFileName];

  function onEditorChange(code?: string) {
    if (code === undefined) return;
    files[selectedFileName].code = code;
    setFiles({ ...files });
  }

  return (
    <div className="h-full">
      <FileNameList />
      <div className="calc-height">
        <Editor
          file={file}
          onChange={debounce(onEditorChange, 500)}
          options={{ theme: `vs-${theme}` }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;

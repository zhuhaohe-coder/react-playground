import { EditorFile } from "@/types";
import { createContext, PropsWithChildren, useState } from "react";
import { message } from "antd";
import { fileName2Language } from "../utils";
import { initFiles } from "../initFiles";

export interface Files {
  [key: string]: EditorFile;
}

export interface PlaygroundContext {
  files: Files;
  selectedFileName: string;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: Files) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldName: string, newName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContext>(
  {} as PlaygroundContext
);

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [files, setFiles] = useState<Files>(initFiles);

  const [selectedFileName, setSelectedFileName] = useState<string>("App.tsx");

  const [messageApi] = message.useMessage();

  const addFile = (fileName: string) => {
    if (files[fileName]) {
      messageApi.error(`File ${fileName} already exists`);
      return;
    }

    setFiles((files) => {
      return {
        ...files,
        [fileName]: {
          name: fileName,
          code: "",
          language: fileName2Language(fileName),
        },
      };
    });
  };

  const removeFile = (fileName: string) => {
    setFiles((files) => {
      const newFiles = { ...files };
      delete newFiles[fileName];
      return newFiles;
    });
    messageApi.success(`File ${fileName} removed`);
  };

  const updateFileName = (oldName: string, newName: string) => {
    if (!files[oldName] || newName === "" || oldName === newName) return;
    // 解构出需要更新的文件，更新其名字和语言
    const { [oldName]: file, ...rest } = files;
    const newFile = {
      [newName]: {
        ...file,
        name: newName,
        language: fileName2Language(newName),
      },
    };
    setFiles({ ...rest, ...newFile });
  };
  return (
    <PlaygroundContext.Provider
      value={{
        files,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
      }}>
      {children}
    </PlaygroundContext.Provider>
  );
};

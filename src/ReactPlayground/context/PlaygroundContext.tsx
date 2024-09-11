import { EditorFile } from "@/types";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { compress, fileName2Language, uncompress } from "../utils";
import { initFiles } from "../initFiles";

export interface Files {
  [key: string]: EditorFile;
}

export interface PlaygroundContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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

export type Theme = "light" | "dark";

const getFilesFromUrl = () => {
  let files: Files | undefined;
  try {
    // 去掉#号并解码
    const hash = uncompress(window.location.hash.slice(1));
    files = JSON.parse(hash);
  } catch (error) {
    console.log(error);
  }
  return files;
};

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles);

  const [selectedFileName, setSelectedFileName] = useState<string>("App.tsx");

  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const hash = compress(JSON.stringify(files));
    window.location.hash = hash;
  }, [files]);

  const addFile = (fileName: string) => {
    if (files[fileName]) {
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
    if (!files[fileName]) return;
    setFiles((files) => {
      const newFiles = { ...files };
      delete newFiles[fileName];
      return newFiles;
    });
  };

  const updateFileName = (oldName: string, newName: string) => {
    if (
      !files[oldName] ||
      newName === "" ||
      oldName === newName ||
      files[newName]
    )
      return;
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
        theme,
        setTheme,
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

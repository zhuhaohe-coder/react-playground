import { PlaygroundContext } from "@/ReactPlayground/context/PlaygroundContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FileNameItem } from "./FileNameItem";
import {
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
  INIT_FILES_COUNT,
} from "@/ReactPlayground/initFiles";
import { APP_COMPONENT_FILE_NAME } from "../../../initFiles";

function FileNameList() {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext);
  const [tabs, setTabs] = useState([""]);
  const tabRef = useRef<HTMLDivElement>(null);

  const [creating, setCreating] = useState(false);

  const readonlyFileNames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_FILE_NAME,
  ];

  useEffect(() => {
    if (tabRef.current) {
      tabRef.current.addEventListener("wheel", (e: WheelEvent) => {
        e.preventDefault();
        (tabRef.current as HTMLDivElement).scrollLeft += e.deltaY;
      });
    }
  }, []);

  const addTab = () => {
    const newFileName = `Comp${
      tabs.length - INIT_FILES_COUNT === 0 ? "" : tabs.length - INIT_FILES_COUNT
    }.tsx`;
    addFile(newFileName);
    setSelectedFileName(newFileName);
    setCreating(true);
  };

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  const handleEditComplete = (name: string, oldName: string) => {
    updateFileName(oldName, name);
    setSelectedFileName(name);

    setCreating(false);
  };

  const handleRemove = (name: string) => {
    removeFile(name);
    if (name === selectedFileName) setSelectedFileName(ENTRY_FILE_NAME);
  };

  return (
    <div
      ref={tabRef}
      className="overflow-x-scroll border-b-2 border-gray-300 flex custom-scrollbar dark:bg-black dark:border-gray-700">
      {tabs.map((tab, index, arr) => (
        <FileNameItem
          readonly={readonlyFileNames.includes(tab)}
          creating={creating && index === arr.length - 1}
          key={tab}
          value={tab}
          activated={tab === selectedFileName}
          onClick={() => setSelectedFileName(tab)}
          onRemove={() => {
            handleRemove(tab);
          }}
          onEditComplete={(name) => handleEditComplete(name, tab)}
        />
      ))}
      <div className="w-[44px] h-[44px] text-center shrink-0">
        <span
          className="text-[20px] leading-[44px] font-bold cursor-pointer hover:text-blue-500 dark:text-white"
          onClick={addTab}>
          +
        </span>
      </div>
    </div>
  );
}

export default FileNameList;

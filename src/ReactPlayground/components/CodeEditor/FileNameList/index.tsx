import { PlaygroundContext } from "@/ReactPlayground/context/PlaygroundContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FileNameItem } from "./FileNameItem";

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

  useEffect(() => {
    if (tabRef.current) {
      tabRef.current.addEventListener("wheel", (e: WheelEvent) => {
        e.preventDefault();
        (tabRef.current as HTMLDivElement).scrollLeft += e.deltaY;
      });
    }
  }, []);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  return (
    <div
      ref={tabRef}
      className="overflow-x-scroll border-b-2 border-gray-300 flex custom-scrollbar">
      {tabs.map((tab) => (
        <FileNameItem
          key={tab}
          value={tab}
          activated={tab === selectedFileName}
          onClick={() => setSelectedFileName(tab)}
        />
      ))}
    </div>
  );
}

export default FileNameList;

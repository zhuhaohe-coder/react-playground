import { useState } from "react";

export interface FileNameItemProps {
  value: string;
  activated: boolean;
  onClick: () => void;
}

export const FileNameItem: React.FC<FileNameItemProps> = (
  props: FileNameItemProps
) => {
  const { value, activated, onClick } = props;

  const [fileName, setFileName] = useState(value);

  return (
    <div
      className={
        activated ? "item-tab activated cursor-text" : "item-tab cursor-pointer"
      }
      onClick={onClick}>
      {fileName}
    </div>
  );
};

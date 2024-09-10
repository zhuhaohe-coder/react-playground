import { useContext, useEffect, useRef, useState } from "react";
import { Popconfirm, message } from "antd";
import { PlaygroundContext } from "@/ReactPlayground/context/PlaygroundContext";

export interface FileNameItemProps {
  value: string;
  activated: boolean;
  creating: boolean;
  readonly: boolean;
  onClick: () => void;
  onEditComplete: (name: string) => void;
  onRemove: () => void;
}

export const FileNameItem: React.FC<FileNameItemProps> = (
  props: FileNameItemProps
) => {
  const {
    value,
    activated,
    creating,
    onClick,
    onEditComplete,
    onRemove,
    readonly,
  } = props;

  const [fileName, setFileName] = useState(value);
  const [editing, setEditing] = useState(creating);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const { files } = useContext(PlaygroundContext);

  useEffect(() => {
    if (inputRef.current) {
      // ch: 1ch 等于当前字体中数字 "0" 的宽度
      inputRef.current.style.width = fileName.length + "ch";
    }
  }, [inputRef, fileName, editing]);

  useEffect(() => {
    if (editing && itemRef.current) {
      itemRef.current.style.backgroundColor = "#f3f7f8";
    } else {
      itemRef.current?.style.removeProperty("background-color");
    }
  }, [editing]);

  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  const handleDoubleClick = () => {
    setEditing(true);
    // 组件完成重新渲染之后再执行 focus() 方法
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputBlur = () => {
    if (fileName === "") {
      messageApi.error("文件名不能为空");
      return;
    }
    if (fileName === value) {
      setEditing(false);
      return;
    }
    if (files[fileName]) {
      messageApi.error("文件名已存在");
      return;
    }

    setEditing(false);
    onEditComplete(fileName);
  };

  return (
    <>
      {contextHolder}
      <div
        className={
          activated
            ? "item-tab activated cursor-text"
            : "item-tab cursor-pointer"
        }
        ref={itemRef}
        onClick={onClick}>
        {editing ? (
          <input
            className="outline-none text-sm bg-[#f3f7f8]"
            type="text"
            ref={inputRef}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onBlur={handleInputBlur}
          />
        ) : (
          <>
            <span onDoubleClick={readonly ? () => {} : handleDoubleClick}>
              {fileName}
            </span>
            {readonly ? null : (
              <Popconfirm
                title="确认删除该文件?"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onRemove();
                }}
                okText="确认"
                cancelText="取消">
                <span className="text-red-500">
                  <span className="ml-2 flex cursor-pointer">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24">
                      <line
                        stroke="#999"
                        x1="18"
                        y1="6"
                        x2="6"
                        y2="18"></line>
                      <line
                        stroke="#999"
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"></line>
                    </svg>
                  </span>
                </span>
              </Popconfirm>
            )}
          </>
        )}
      </div>
    </>
  );
};

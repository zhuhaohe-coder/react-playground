import { useContext } from "react";
import logo from "../../assets/react_logo.svg";
import { PlaygroundContext } from "../context/PlaygroundContext";
import {
  MoonOutlined,
  SunOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { message } from "antd";
import { downloadFiles } from "../utils";

function Header() {
  const { theme, setTheme, files } = useContext(PlaygroundContext);

  return (
    <div className="h-14 px-5  flex items-center shadow-md justify-between dark:bg-black dark:border-b-gray-700 dark:border-b-2">
      <div className="flex items-center">
        <img
          className="h-8 mr-3 animate-spin"
          src={logo}
          alt="log"
        />
        <span className="text-2xl font-mono font-bold dark:text-white">
          React Playground
        </span>
      </div>
      <div className="cursor-pointer">
        <ShareAltOutlined
          className="text-2xl mr-5 dark:text-white"
          onClick={() => {
            copy(window.location.href);
            message.success("分享链接已复制到剪切板");
          }}
        />
        <DownloadOutlined
          className="text-2xl mr-5 dark:text-white"
          onClick={async () => {
            await downloadFiles(files);
            message.success("下载成功");
          }}
        />
        {theme === "light" && (
          <MoonOutlined
            className="text-2xl dark:text-white"
            onClick={() => setTheme("dark")}
          />
        )}
        {theme === "dark" && (
          <SunOutlined
            className="text-2xl dark:text-white"
            onClick={() => setTheme("light")}
          />
        )}
      </div>
    </div>
  );
}

export default Header;

import { Files } from "./context/PlaygroundContext";
// import 模块的时候加一个 ?raw，就是以文本的方式引入模块内容。
import importMap from "./template/import-map.json?raw";
import AppCss from "./template/App.css?raw";
import App from "./template/App.tsx?raw";
import main from "./template/main.tsx?raw";
import { fileName2Language } from "./utils";

// app 文件名
export const APP_COMPONENT_FILE_NAME = "App.tsx";
// esm 模块映射文件名
export const IMPORT_MAP_FILE_NAME = "import-map.json";
// app 入口文件名
export const ENTRY_FILE_NAME = "main.tsx";
// app 样式文件名
export const APP_CSS_FILE_NAME = "App.css";

export const initFiles: Files = {
  [ENTRY_FILE_NAME]: {
    name: ENTRY_FILE_NAME,
    code: main,
    language: fileName2Language(ENTRY_FILE_NAME),
  },
  [APP_COMPONENT_FILE_NAME]: {
    name: APP_COMPONENT_FILE_NAME,
    code: App,
    language: fileName2Language(APP_COMPONENT_FILE_NAME),
  },
  [APP_CSS_FILE_NAME]: {
    name: APP_CSS_FILE_NAME,
    code: AppCss,
    language: fileName2Language(APP_CSS_FILE_NAME),
  },
  [IMPORT_MAP_FILE_NAME]: {
    name: IMPORT_MAP_FILE_NAME,
    code: importMap,
    language: fileName2Language(IMPORT_MAP_FILE_NAME),
  },
};

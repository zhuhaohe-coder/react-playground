import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import { Files } from "../context/PlaygroundContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const fileName2Language = (fileName: string) => {
  const languageMap: { [key: string]: string } = {
    js: "javascript",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
    json: "json",
    css: "css",
  };
  const suffix = fileName.split(".").pop() || "";

  return languageMap[suffix] ?? "javascript";
};

export const compress = (data: string): string => {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(zipped, true);

  return btoa(binary);
};

export function uncompress(base64: string): string {
  const binary = atob(base64);

  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
}

export const downloadFiles = async (files: Files) => {
  const zip = new JSZip();

  Object.keys(files).forEach((name) => {
    zip.file(name, files[name].code);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "code.zip");
};

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

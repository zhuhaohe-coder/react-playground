import { PlaygroundContext } from "@/ReactPlayground/context/PlaygroundContext";
import { useContext, useEffect, useRef, useState } from "react";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "@/ReactPlayground/initFiles";
import { Message } from "./Message";
import CompilerWorker from "./compiler.worker?worker";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

function Preview() {
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState("");

  const getIframeUrl = () => {
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].code}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

  const compilerWorkerRef = useRef<Worker>();

  useEffect(() => {
    if (!compilerWorkerRef.current) {
      compilerWorkerRef.current = new CompilerWorker();
      // 主线程接收到 worker 编译后的代码
      compilerWorkerRef.current.addEventListener("message", ({ data }) => {
        if (data.type === "COMPILER_CODE") {
          setCompiledCode(data.data);
        }
      });
    }
  }, []);

  useEffect(() => {
    // 主线程发送给 worker 需要编译的代码
    compilerWorkerRef.current?.postMessage(files);
  }, [files]);

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].code, compiledCode]);

  const [error, setError] = useState("");
  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === "ERROR") {
      setError(message);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="h-full">
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
        }}
      />
      <Message
        type="error"
        content={error}
      />
    </div>
  );
}

export default Preview;

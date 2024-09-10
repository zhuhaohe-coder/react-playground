import React, { useEffect, useState } from "react";

interface MessageProps {
  type: "error" | "warn";
  content: string;
}

export const Message: React.FC<MessageProps> = ({ type, content }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!content);
  }, [content]);

  return visible ? (
    <div className={`msg ${type}`}>
      <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
      <button
        className="dismiss"
        onClick={() => setVisible(false)}>
        ✕
      </button>
    </div>
  ) : null;
};

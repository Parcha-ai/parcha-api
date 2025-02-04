import React from "react";
import { FlashMessage } from "./FlashMessage";
import { useFlash } from "../context/FlashContext";
import "./FlashContainer.css";

export const FlashContainer: React.FC = () => {
  const { messages, removeMessage } = useFlash();

  return (
    <div className="flash-container">
      {messages.map((message) => (
        <FlashMessage
          key={message.id}
          message={message}
          onClose={removeMessage}
        />
      ))}
    </div>
  );
};

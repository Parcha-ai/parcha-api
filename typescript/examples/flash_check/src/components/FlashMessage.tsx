import React from "react";
import { FlashMessage as FlashMessageType } from "../types/flash";
import { log } from "../utils/logger";
import "./FlashMessage.css";

interface Props {
  message: FlashMessageType;
  onClose: (id: string) => void;
}

export const FlashMessage: React.FC<Props> = ({ message, onClose }) => {
  const handleClose = () => {
    log.info("flash_message_close_clicked", { messageId: message.id });
    if (message.id) {
      onClose(message.id);
    }
  };

  return (
    <div className={`flash-message flash-message--${message.type}`}>
      <div className="flash-message__content">{message.message}</div>
      <button
        className="flash-message__close"
        onClick={handleClose}
        aria-label="Close message"
      >
        ×
      </button>
    </div>
  );
};

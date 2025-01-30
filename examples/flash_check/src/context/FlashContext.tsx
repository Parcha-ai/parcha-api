import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { FlashMessage, FlashState, FlashContextType } from "../types/flash";
import { log } from "../utils/logger";

const FlashContext = createContext<FlashContextType | undefined>(undefined);

type FlashAction =
  | { type: "ADD_MESSAGE"; payload: FlashMessage }
  | { type: "REMOVE_MESSAGE"; payload: string }
  | { type: "CLEAR_MESSAGES" };

const flashReducer = (state: FlashState, action: FlashAction): FlashState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      log.info("flash_message_added", { message: action.payload });
      return {
        messages: [...state.messages, action.payload],
      };
    case "REMOVE_MESSAGE":
      log.info("flash_message_removed", { messageId: action.payload });
      return {
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };
    case "CLEAR_MESSAGES":
      log.info("flash_messages_cleared");
      return { messages: [] };
    default:
      return state;
  }
};

export const FlashProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(flashReducer, { messages: [] });

  const addMessage = useCallback((message: FlashMessage) => {
    const id = message.id || uuidv4();
    const duration = message.duration || 5000;

    dispatch({ type: "ADD_MESSAGE", payload: { ...message, id } });

    setTimeout(() => {
      dispatch({ type: "REMOVE_MESSAGE", payload: id });
    }, duration);
  }, []);

  const removeMessage = useCallback((id: string) => {
    dispatch({ type: "REMOVE_MESSAGE", payload: id });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  return (
    <FlashContext.Provider
      value={{
        messages: state.messages,
        addMessage,
        removeMessage,
        clearMessages,
      }}
    >
      {children}
    </FlashContext.Provider>
  );
};

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (context === undefined) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return context;
};

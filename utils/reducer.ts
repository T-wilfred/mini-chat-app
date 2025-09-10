
import { ChatMessage } from "../types";

export type Action =
  | { type: "append"; message: ChatMessage }
  | { type: "reset"; messages?: ChatMessage[] };

export function messagesReducer(state: ChatMessage[], action: Action): ChatMessage[] {
  switch (action.type) {
    case "append":
      return [...state, action.message];
    case "reset":
      return action.messages ?? [];
    default:
      return state;
  }
}

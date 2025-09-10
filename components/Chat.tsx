import React from "react";
import { ChatMessage } from "../types";
import Markdown from "./Markdown";

interface ChatProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages, isLoading }) => {
  return (
    <div className="chat-container">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <div className="welcome-content">
            <h2>Welcome to MiniChat AI</h2>
            <p>Start a conversation by typing a message below</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {/* TODO: add your SVG avatar here */}
              </div>
              <div className="message-content">
                <Markdown className="prose prose-sm max-w-none">
                  {message.content}
                </Markdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">{/* assistant avatar */}</div>
              <div className="message-content">
                <div className="message-text typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chat;

import React, { useReducer, useState, useRef, useEffect } from 'react';
import Chat from '../components/Chat';
import { messagesReducer } from '../utils/reducer';
import { ChatMessage } from '../types';

const Home: React.FC = () => {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Function to send message to backend
  const sendToBackend = async (message: string) => {
    // TODO: Replace with your actual backend endpoint
    const response = await fetch('https://mini-chat-app-production.up.railway.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here (e.g., Authorization)
      },
        body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful assistant." }, // optional system prompt
        { role: "user", content: message },
      ],
    }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Adjust this according to your backend response format
    // For example, if your backend returns { response: "text" }, use data.response
    // If it returns just the text, use data directly
    return data.response || data.reply || data.text || data.message || JSON.stringify(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
    };
    dispatch({ type: 'append', message: userMessage });

    // Clear input and set loading state
    setInputValue('');
    setIsLoading(true);

    try {
      // Get response from backend
      const response = await sendToBackend(inputValue);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response,
      };
      dispatch({ type: 'append', message: aiMessage });
    } catch (error) {
      console.error('Error sending message to backend:', error);
      // Handle error
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the backend. Please try again.',
      };
      dispatch({ type: 'append', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    dispatch({ type: 'reset' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="minichat-app">
      <header className="app-header">
        <div className="header-content">
          <h1>MiniChat AI</h1>
          <button className="reset-button" onClick={handleReset}>
            Clear Chat
          </button>
        </div>
      </header>
      <main className="app-main">
        <div className="chat-wrapper">
          <Chat messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>
        <form className="input-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className={isLoading ? "input-loading" : ""}
            />
            <button 
              type="submit" 
              disabled={isLoading || inputValue.trim() === ''}
              className={isLoading ? "send-button loading" : "send-button"}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/>
                </svg>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Home;
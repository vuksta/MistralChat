import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MistralChat.css';
import botIcon from './mistral-logo.png'; // Ensure you have the logo image in the src directory

const API_KEY = 'XI8QlceMrFheRs3jouPLOW1gJOJhPwWj';
const API_URL = 'https://api.mistral.ai/v1/chat/completions';

const MistralChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await axios.post(API_URL, 
        {
          model: "mistral-tiny",
          messages: [...messages, newMessage]
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const botResponse = response.data.choices[0].message;
        setMessages(prevMessages => [...prevMessages, botResponse]);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.role === 'assistant' && <img src={botIcon} alt="Bot" className="bot-icon" />}
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <img src={botIcon} alt="Bot" className="bot-icon" />
            <div className="typing-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default MistralChat;

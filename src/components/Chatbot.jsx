import React, { useState } from 'react';

const chatbotData = [
  { question: "hello", answer: "Hey there! How can I assist you today?" },
  { question: "hi", answer: "Hey there! How can I assist you today?" },
  { question: "how are you?", answer: "I'm just a chatbot, but thanks for asking! How can I help you today?" },
  { question: "what is this website about", answer: "This is an AI-based trip planner that helps you create personalized travel plans." },
  { question: "how do i plan a trip", answer: "Click on the 'Plan Your Trip' button and fill in your destination, dates, and preferences." },
  { question: "is it free", answer: "Yes, the basic features of the trip planner are free to use." },
  { question: "can i save my trip plans", answer: "Yes, you can save your trip plans by creating an account and logging in." },
  { question: "how do i contact support", answer: "You can contact our support team through the 'Contact Us' page." }
];

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: 'user', text: userInput };
    const lowerInput = userInput.toLowerCase();

    const matched = chatbotData.find(item =>
      lowerInput.includes(item.question)
    );

    const botMessage = {
      sender: 'bot',
      text: matched ? matched.answer : "Sorry, I didn't understand that. Please try a different question."
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setUserInput('');
  };

  if (isMinimized) {
    return (
      <div style={styles.minimized} onClick={() => setIsMinimized(false)}>
        🤖 Chatbot
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Travel Craft Chatbot 🤖</h2>
        <span style={styles.close} onClick={() => setIsMinimized(true)}>×</span>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', marginBottom: '8px' }}>
            <span style={{
              ...styles.message,
              backgroundColor: msg.sender === 'user' ? '#d0e7ff' : '#d2f8d2'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '320px',
    padding: '10px',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heading: {
    fontSize: '18px',
    margin: 0
  },
  close: {
    fontSize: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  chatBox: {
    height: '250px',
    overflowY: 'auto',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    margin: '10px 0'
  },
  message: {
    display: 'inline-block',
    padding: '10px',
    borderRadius: '15px',
    maxWidth: '80%',
    fontSize: '14px'
  },
  inputContainer: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer'
  },
  minimized: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 0 8px rgba(0,0,0,0.2)',
    zIndex: 1000
  }
};

export default Chatbot;

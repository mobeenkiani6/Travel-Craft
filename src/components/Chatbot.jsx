import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openrouter');
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet:beta');

  // Available models for OpenRouter
  const modelOptions = [
    { value: 'anthropic/claude-3.5-sonnet:beta', label: 'Claude 3.5 Sonnet' },
    { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'google/gemini-pro', label: 'Gemini Pro' },
    { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
    { value: 'anthropic/claude-3-haiku:beta', label: 'Claude 3 Haiku' },
    { value: 'openai/gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ];

  // Call your serverless function
  const callServerlessAPI = async (message, provider, model) => {
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/chat'  // Local development
      : '/api/chat';  // Production (Vercel)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        provider: provider,
        model: model
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      // Call your serverless function
      const botResponse = await callServerlessAPI(currentInput, selectedProvider, selectedModel);

      const botMessage = {
        sender: 'bot',
        text: botResponse
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        sender: 'bot',
        text: `Error: ${error.message}. Please try again or switch to a different AI provider.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div style={styles.minimized} onClick={() => setIsMinimized(false)}>
        🤖 AI Travel Assistant
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Travel Craft AI Assistant 🤖</h2>
        <div style={styles.headerControls}>
          <select 
            value={selectedProvider} 
            onChange={(e) => setSelectedProvider(e.target.value)}
            style={styles.providerSelect}
          >
            <option value="openrouter">OpenRouter</option>
            <option value="gemini">Gemini</option>
          </select>
          <span style={styles.close} onClick={() => setIsMinimized(true)}>×</span>
        </div>
      </div>

      {selectedProvider === 'openrouter' && (
        <div style={styles.modelSelector}>
          <label style={styles.modelLabel}>Model:</label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            style={styles.modelSelect}
          >
            {modelOptions.map(model => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <div style={styles.welcomeMessage}>
            👋 Welcome! I'm your AI travel assistant powered by {selectedProvider === 'openrouter' ? 'OpenRouter' : 'serverless functions'}. 
            {selectedProvider === 'openrouter' && ` Currently using ${modelOptions.find(m => m.value === selectedModel)?.label}.`}
            <br />Ask me anything about trip planning, destinations, or how to use Travel Craft!
          </div>
        )}
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
        {isLoading && (
          <div style={{ textAlign: 'left', marginBottom: '8px' }}>
            <span style={{...styles.message, backgroundColor: '#f0f0f0'}}>
              <span style={styles.typing}>
                {selectedProvider === 'openrouter' 
                  ? `${modelOptions.find(m => m.value === selectedModel)?.label} is thinking...`
                  : 'AI is thinking via serverless function...'
                }
              </span>
            </span>
          </div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Ask me about travel planning..."
          style={styles.input}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          style={{
            ...styles.button,
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
      
      <div style={styles.apiStatus}>
        Connected to {selectedProvider === 'openrouter' 
          ? `${modelOptions.find(m => m.value === selectedModel)?.label} via OpenRouter`
          : `${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} AI via Serverless`
        }
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '380px',
    padding: '10px',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  heading: {
    fontSize: '16px',
    margin: 0,
    color: '#333'
  },
  providerSelect: {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '12px'
  },
  modelSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
    padding: '8px',
    backgroundColor: '#e8f4fd',
    borderRadius: '6px',
    border: '1px solid #bee5eb'
  },
  modelLabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#0c5460'
  },
  modelSelect: {
    flex: 1,
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #bee5eb',
    fontSize: '11px',
    backgroundColor: 'white'
  },
  close: {
    fontSize: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#666'
  },
  chatBox: {
    height: '300px',
    overflowY: 'auto',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    margin: '10px 0'
  },
  welcomeMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: '13px',
    padding: '20px',
    fontStyle: 'italic',
    lineHeight: '1.4'
  },
  message: {
    display: 'inline-block',
    padding: '10px 12px',
    borderRadius: '15px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word'
  },
  typing: {
    color: '#666',
    fontStyle: 'italic'
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '5px'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  apiStatus: {
    fontSize: '10px',
    color: '#666',
    textAlign: 'center',
    marginTop: '5px'
  },
  minimized: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 18px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    zIndex: 1000,
    fontSize: '14px'
  }
};

export default Chatbot;
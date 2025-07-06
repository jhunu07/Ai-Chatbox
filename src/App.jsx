import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [chat, setChat] = useState([]);
  const [model, setModel] = useState('dolphin-phi');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const controllerRef = useRef(null);
  const textareaRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('chat');
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, []);

  // Save chat history to localStorage on change
  useEffect(() => {
    localStorage.setItem('chat', JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    const updatedChat = [...chat, userMessage];
    const assistantMessage = { role: 'assistant', content: '' };

    setChat([...updatedChat, assistantMessage]);
    setPrompt('');
    setLoading(true);
    controllerRef.current = new AbortController();

    try {
      const res = await fetch('http://localhost:11434/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...updatedChat,
          ],
          stream: true,
        }),
        signal: controllerRef.current.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let messageBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const json = line.replace('data: ', '');
            if (json === '[DONE]') break;

            try {
              const parsed = JSON.parse(json);
              const token = parsed.choices?.[0]?.delta?.content;

              if (token) {
                messageBuffer += token;
                setChat((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: messageBuffer,
                  };
                  return updated;
                });
              }
            } catch (e) {
              console.error('Error parsing stream chunk:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Ollama API error:', err);
      setChat((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: ' Could not connect to Ollama.',
        },
      ]);
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendPrompt();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  const cancelRequest = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setLoading(false);
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-box">
        {warning && (
          <div style={{ color: 'red', marginTop: '0.5rem' }}>{warning}</div>
        )}

        <div className="chat-messages">
          {chat.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="avatar">{msg.role === 'user' ? '🧑' : '🤖'}</div>
              <div className="bubble">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <div className="buttons">
            
            {loading && (
              <button type="button" onClick={cancelRequest}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

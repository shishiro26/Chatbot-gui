/* eslint-disable react/prop-types */
import { useState } from 'react';
import './App.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const CustomMessage = (props) => {
  return (
    <div className={`message ${props.sender}`}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{props.message}</ReactMarkdown>
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState([
    {
      message:
        'Hello, I your bot, I can help you and provide info regarding the LFX mentorship and about the Hyperledger community',
      sender: 'Gemini',
    },
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing',
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    try {
      const response = await axios.post(
        'https://chatbot-gui-server.onrender.com/generate',
        {
          message,
        },
      );

      setMessages([
        ...newMessages,
        {
          message: response.data.response,
          sender: 'Gemini',
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
        {
          message: 'Error: Could not send message. Please try again later.',
          sender: 'Gemini',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="App">
      <div style={{ position: 'relative', height: '600px', width: '700px' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? <TypingIndicator content="Typing" /> : null
              }
            >
              {messages.map((msg, i) => (
                <CustomMessage
                  key={i}
                  message={msg.message}
                  sender={msg.sender}
                />
              ))}
            </MessageList>
            <MessageInput placeholder="Type Message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;

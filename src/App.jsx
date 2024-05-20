/* eslint-disable react/prop-types */
import { useState } from 'react';
import './App.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  TypingIndicator,
  Avatar,
  Message,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import axios from 'axios';

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
    <MainContainer className="min-h-full min-w-full">
      <ChatContainer className='h-screen'>
        <MessageList
          scrollBehavior="smooth"
          typingIndicator={typing ? <TypingIndicator content="Typing" /> : null}
          className="py-1"
        >
          {messages.map((msg, i) => {
            return (
              <Message
                key={i}
                model={{
                  direction: msg.sender === 'Gemini' ? 'incoming' : 'outgoing',
                  message: msg.message,
                  position: 'single',
                  sender: 'bot',
                }}
              >
                <Avatar
                  name="bot"
                  src="https://api.dicebear.com/8.x/bottts/svg?seed=Felix"
                />
              </Message>
            );
          })}
        </MessageList>
        <MessageInput
          placeholder="Type Message here"
          onSend={handleSend}
          autoFocus
          fancyScroll
          attachButton={false}
        />
      </ChatContainer>
    </MainContainer>
  );
}

export default App;

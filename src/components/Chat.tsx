'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';
import TypingIndicator from './TypingIndicator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // LocalStorage handling
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll handling
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleClearChat = () => {
    if (window.confirm('チャット履歴をクリアしますか？')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage],
      });

      setMessages(prev => [...prev, response.data.message]);
    } catch (error) {
      console.error('Error:', error);
      setError('メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800">Eliza AI Chat</h1>
            <button
              onClick={handleClearChat}
              className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Clear chat history"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[60vh] overflow-y-auto px-6 py-4 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 animate-fade-in shadow-sm
                    ${message.role === 'user' 
                      ? 'bg-blue-500 text-white animate-slide-in' 
                      : 'bg-gray-100 text-gray-800'}`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    className="prose prose-sm max-w-none dark:prose-invert"
                    components={{
                      code({node, inline, className, children, ...props}) {
                        return (
                          <code
                            className={`${className} ${
                              inline 
                                ? 'bg-opacity-20 bg-gray-200 rounded px-1' 
                                : ''}`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      pre({node, children, ...props}) {
                        return (
                          <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-2" {...props}>
                            {children}
                          </pre>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none min-h-[52px] max-h-32"
                placeholder="メッセージを入力..."
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
      {error && <Toast message={error} type="error" />}
    </div>
  );
}

// app/chat/page.tsx - Full-page chat interface
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartCard } from '@/components/ChartCard';
import { formatRelativeTime, cn } from '@/lib/utils';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    chatSessions, 
    sendChatMessage, 
    createChatSession 
  } = useStore();

  // Get or create active session
  const activeSession = chatSessions[0] || (() => {
    const sessionId = createChatSession();
    return { sessionId, messages: [], createdAt: new Date().toISOString(), lastActive: new Date().toISOString() };
  })();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const messageText = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await sendChatMessage(activeSession.sessionId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    'What is the current system status?',
    'Which trains are currently delayed?',
    'Show me today\'s KPI performance',
    'What recommendations are pending?',
    'Simulate a 20-minute delay for IC-2847',
    'Explain the latest recommendation'
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Railway Assistant
            </h1>
            <p className="text-muted-foreground mt-1">
              Get insights, run simulations, and understand system recommendations
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              New Session
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <ChartCard title="Quick Actions" subtitle="Common questions and commands">
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                  onClick={() => setMessage(question)}
                  disabled={isTyping}
                >
                  <Sparkles className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{question}</span>
                </Button>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <ChartCard title="Conversation" subtitle={`Session: ${activeSession.sessionId.slice(-8)}`} className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 min-h-0">
              {activeSession.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Welcome to Railway Assistant!</h3>
                    <p className="text-sm mb-4">
                      I can help you with train status, KPI analysis, simulations, and more.
                    </p>
                    <p className="text-xs">
                      Try asking about current delays or click a quick action to get started.
                    </p>
                  </div>
                </div>
              ) : (
                activeSession.messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] p-4 rounded-lg',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.text}
                      </div>
                      
                      {/* References */}
                      {msg.references && msg.references.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/20">
                          <div className="text-xs opacity-75 mb-2">References:</div>
                          <div className="space-y-1">
                            {msg.references.map((ref, refIndex) => (
                              <div key={refIndex} className="text-xs opacity-90">
                                📎 {ref.title || ref.source}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs opacity-70 mt-2">
                        {formatRelativeTime(msg.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-4 rounded-lg max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-xs">Assistant is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about trains, delays, KPIs, or request simulations..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              <div className="text-xs text-muted-foreground mt-2">
                💡 Try: "Why is train IC-2847 delayed?", "Simulate 15min delay", or "Show current KPIs"
              </div>
            </div>
          </ChartCard>
        </div>
      </motion.div>
    </div>
  );
}
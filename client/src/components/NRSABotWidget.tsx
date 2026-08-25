import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function NRSABotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am the NRSA AI Assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const mutation = useMutation({
        mutationFn: async (message: string) => {
            const res = await apiRequest('POST', '/api/nrsa-bot', {
                message,
                // Send full conversation history so the AI remembers context
                history: messages.slice(0, -1), // exclude the user message we just added
            });
            return res.json();
        },
        onSuccess: (data) => {
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        },
        onError: () => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        mutation.mutate(inputValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleChipClick = (msg: string) => {
        // Directly set input and send
        const userMessage: Message = { role: 'user', content: msg };
        setMessages(prev => [...prev, userMessage]);
        mutation.mutate(msg);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="w-80 h-[500px] shadow-2xl border-0 overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 flex justify-between items-center text-white shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shrink-0">
                                        <img
                                            src="/nrsf-logo.png"
                                            alt="NRSA"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">NRSA AI Assistant</h3>
                                        <p className="text-xs text-green-100 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:bg-white/20 h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Chat Area */}
                            <ScrollArea className="flex-1 p-4 bg-gray-50/50">
                                <div className="flex flex-col gap-4">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex items-start gap-2 ${msg.role === 'user' ? "flex-row-reverse" : "flex-row"}`}
                                        >
                                            {/* AVATAR LOGIC */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border shrink-0 ${msg.role === 'user' ? "bg-gray-200" : "bg-white border-green-600"}`}>
                                                {msg.role === 'user' ? (
                                                    <User className="w-5 h-5 text-gray-600" />
                                                ) : (
                                                    <img
                                                        src="/nrsf-logo.png"
                                                        alt="NRSA"
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                )}
                                            </div>

                                            {/* MESSAGE BUBBLE */}
                                            <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === 'user'
                                                ? "bg-green-600 text-white rounded-br-none"
                                                : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                                }`}>
                                                {msg.role === 'assistant'
                                                  ? msg.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                                      /^https?:\/\//.test(part) ? (
                                                        <a
                                                          key={i}
                                                          href={part.replace(/[.,!?]$/, '')}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="text-emerald-600 underline break-all hover:text-emerald-700"
                                                        >
                                                          {part.replace(/[.,!?]$/, '')}
                                                        </a>
                                                      ) : (
                                                        <span key={i}>{part}</span>
                                                      )
                                                    )
                                                  : msg.content
                                                }
                                            </div>
                                        </div>
                                    ))}

                                    {mutation.isPending && (
                                        <div className="flex items-start gap-2 flex-row">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border bg-white border-green-600 shrink-0">
                                                <img
                                                    src="/nrsf-logo.png"
                                                    alt="NRSA"
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            </div>
                                            <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Starter Chips (Only show if few messages) */}
                            {messages.length < 3 && !mutation.isPending && (
                                <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                                    {['How do I sponsor?', 'What is a Y-Court?', 'Association vs Federation?'].map((chip) => (
                                        <button
                                            key={chip}
                                            onClick={() => handleChipClick(chip)}
                                            className="whitespace-nowrap text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 hover:bg-green-100 transition-colors"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                                <div className="flex gap-2">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask NRSA AI..."
                                        className="rounded-full bg-gray-50 border-gray-200 focus-visible:ring-green-500"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={mutation.isPending || !inputValue.trim()}
                                        className="rounded-full bg-green-600 hover:bg-green-700 shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-[10px] text-center text-gray-400 mt-2">
                                    AI can make mistakes. Check important info.
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button (Only visible when chat is closed) */}
            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative group"
                >
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                        </span>
                        <MessageCircle className="h-7 w-7" />
                    </button>

                    {/* Tooltip on hover */}
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat with NRSA AI
                    </div>
                </motion.div>
            )}
        </div>
    );
}

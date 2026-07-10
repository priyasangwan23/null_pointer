import { useState, useRef, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import ChatBubble from '../components/ChatBubble';
import { Send, MoreHorizontal } from 'lucide-react';
import { generateId } from '../utils/generateId';
import { motion, AnimatePresence } from 'framer-motion';
import { personalityData } from '../data/personality';

export default function AIChat() {
    const [messages, setMessages] = useState([
        { id: '1', text: "Hey! I'm your digital clone. Talk to me and let's see how accurate I am.", isAI: true, timestamp: "Now" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedPrompts = [
        "Tell me a joke",
        "What are you doing today?",
        "How's life going?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text = input) => {
        if (!text.trim()) return;

        const newMsg = { id: generateId(), text, isAI: false, timestamp: 'Just now' };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking and replying from favorite phrases
        setTimeout(() => {
            const phrases = personalityData.favoritePhrases;
            const randomReply = phrases[Math.floor(Math.random() * phrases.length)];
            setMessages(prev => [...prev, { id: generateId(), text: randomReply, isAI: true, timestamp: 'Just now' }]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">

            {/* Profile Sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
                <ProfileCard name="User" status="Online" score={personalityData.score} />

                <div className="mt-6 bg-card border border-border rounded-2xl p-5 shadow-soft">
                    <h4 className="font-heading font-medium text-heading mb-3 text-sm">Suggested Prompts</h4>
                    <div className="flex flex-col gap-2">
                        {suggestedPrompts.map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => handleSend(prompt)}
                                className="text-left text-sm text-body hover:text-primary bg-background hover:bg-primary/5 p-3 rounded-xl border border-border/50 transition-colors"
                                disabled={isTyping}
                            >
                                "{prompt}"
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-card rounded-2xl border border-border shadow-soft flex flex-col overflow-hidden relative">
                <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/80 backdrop-blur-sm shrink-0 z-10">
                    <div>
                        <h2 className="font-heading font-semibold text-lg text-heading">Chat with Clone</h2>
                        <p className="text-xs text-primary flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span> Connected locally
                        </p>
                    </div>
                    <button className="text-body hover:text-heading p-2 rounded-lg hover:bg-background transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background space-y-2">
                    {messages.map(msg => (
                        <ChatBubble key={msg.id} message={msg.text} isAI={msg.isAI} timestamp={msg.timestamp} />
                    ))}

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex w-full justify-start mb-4"
                            >
                                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 w-20 flex justify-center shadow-sm">
                                    <div className="flex gap-1.5 items-center h-4">
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 rounded-full bg-body/40" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-body/60" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }} className="w-2 h-2 rounded-full bg-body/80" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-card border-t border-border shrink-0">
                    <form
                        onSubmit={e => { e.preventDefault(); handleSend(); }}
                        className="flex items-end gap-2 bg-background p-2 pr-2 border border-border rounded-2xl focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-transparent transition-shadow"
                    >
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-body px-4"
                            rows={1}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="bg-primary text-card p-3 rounded-xl hover:bg-secondary disabled:opacity-50 disabled:hover:bg-primary transition-all shrink-0 mb-1"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}

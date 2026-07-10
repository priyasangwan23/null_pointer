import { useState, useRef, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import ChatBubble from '../components/ChatBubble';
import { Send, MoreHorizontal, WifiOff } from 'lucide-react';
import { generateId } from '../utils/generateId';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../services/api';

const ROLES = [
    { value: 'friend', label: '🤝 Friend' },
    { value: 'best_friend', label: '💛 Best Friend' },
    { value: 'mother', label: '🤱 Mummy' },
    { value: 'elder', label: '🎓 Elder' },
    { value: 'stranger', label: '🙂 Stranger' },
];

const SUGGESTED_PROMPTS = [
    "kya kar rahi hai?",
    "bore ho raha hai yaar",
    "tell me something interesting",
];

const saveSession = (messages) => {
    if (messages.length <= 1) return;
    const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const session = {
        id: `conv_${Date.now()}`,
        title: `Chat — ${new Date().toLocaleDateString('en-IN')}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        snippet: messages[messages.length - 1]?.text?.slice(0, 50) || '',
        messages: messages.map(m => ({
            id: m.id,
            sender: m.isAI ? 'ai' : 'user',
            text: m.text,
            date: m.timestamp,
        })),
    };
    sessions.unshift(session);
    localStorage.setItem('chatSessions', JSON.stringify(sessions.slice(0, 30)));
};

export default function AIChat() {
    const [messages, setMessages] = useState([
        { id: '1', text: "Hey! Main Priya hoon. Bol kya chal raha hai? 😄", isAI: true, timestamp: 'Now' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [role, setRole] = useState('friend');
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const handleUnload = () => saveSession(messages);
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim() || isTyping) return;

        const userMsg = { id: generateId(), text, isAI: false, timestamp: 'Just now' };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);
        setError(null);

        const updatedHistory = [
            ...history,
            { role: 'user', content: text },
        ].slice(-12);

        const aiMessageId = generateId();

        try {
            let hasStartedText = false;
            let currentReply = '';

            const reply = await sendMessage(text, updatedHistory, role, (chunk) => {
                if (!hasStartedText) {
                    setIsTyping(false);
                    hasStartedText = true;
                }
                currentReply += chunk;
                setMessages(prev => {
                    const exists = prev.some(m => m.id === aiMessageId);
                    if (exists) {
                        return prev.map(m => m.id === aiMessageId ? { ...m, text: currentReply } : m);
                    } else {
                        return [...prev, { id: aiMessageId, text: currentReply, isAI: true, timestamp: 'Just now' }];
                    }
                });
            });

            setHistory([...updatedHistory, { role: 'assistant', content: reply.trim() }]);
        } catch (err) {
            setError('Backend nahi mila 😅 — make sure backend is running on port 5000');
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden">

            {/* Fixed Profile Sidebar */}
            <div className="hidden lg:flex flex-col w-72 shrink-0 gap-5 overflow-y-auto pr-2 pb-6">
                <ProfileCard name="Priya" status="Online" score={92} />

                {/* Role Selector */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h4 className="font-heading font-semibold text-heading mb-3 text-sm">Who are you?</h4>
                    <div className="flex flex-col gap-2">
                        {ROLES.map(r => (
                            <button
                                key={r.value}
                                onClick={() => setRole(r.value)}
                                className={`text-left text-sm p-3 rounded-xl border transition-all duration-200 shadow-sm ${
                                    role === r.value
                                        ? 'bg-primary text-card border-primary font-medium scale-[1.02]'
                                        : 'text-body bg-background hover:bg-primary/5 hover:border-primary/20 border-border/50'
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Suggested Prompts */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h4 className="font-heading font-semibold text-heading mb-3 text-sm">Try saying...</h4>
                    <div className="flex flex-col gap-2">
                        {SUGGESTED_PROMPTS.map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => handleSend(prompt)}
                                disabled={isTyping}
                                className="text-left text-sm text-body hover:text-primary hover:bg-primary/5 bg-background p-3 rounded-xl border border-border/50 transition-all duration-200 shadow-sm"
                            >
                                "{prompt}"
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Area - Fixed wrapper, internal scroll */}
            <div className="flex-1 bg-card rounded-2xl border border-border shadow-md flex flex-col overflow-hidden relative">
                
                {/* Fixed Header */}
                <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/90 backdrop-blur-md shrink-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                    <div>
                        <h2 className="font-heading font-semibold text-lg text-heading tracking-tight">Chat with Priya</h2>
                        <p className="text-xs text-primary flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-success inline-block shadow-[0_0_8px_rgba(122,143,105,0.6)]" />
                            Connected · Role: {ROLES.find(r => r.value === role)?.label}
                        </p>
                    </div>
                    <button className="text-body hover:text-heading p-2 rounded-xl hover:bg-background transition-colors focus:ring-2 focus:ring-accent/50 outline-none">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Scrollable Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background space-y-3 relative scroll-smooth">
                    
                    {messages.length === 1 && (
                        <div className="text-center mt-10 mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm border border-primary/20">
                                <span className="text-2xl">☕</span>
                            </div>
                            <h3 className="font-heading text-lg font-medium text-heading">Start a conversation</h3>
                            <p className="text-body text-sm mt-1 max-w-sm mx-auto">Priya's digital clone is ready to chat. Pick a role and say hi!</p>
                        </div>
                    )}

                    {messages.map(msg => (
                        <ChatBubble key={msg.id} message={msg.text} isAI={msg.isAI} timestamp={msg.timestamp} />
                    ))}

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
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

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3 shadow-sm mx-auto w-max"
                        >
                            <WifiOff size={16} />
                            {error}
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* Fixed Input Bar */}
                <div className="p-4 bg-card border-t border-border shrink-0 z-10">
                    <form
                        onSubmit={e => { e.preventDefault(); handleSend(); }}
                        className="flex items-center gap-3 bg-background p-2 pl-4 border border-border rounded-full focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Message Priya..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none h-11 py-3 text-body text-sm placeholder:text-body/50 outline-none"
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
                            className="bg-primary text-card p-3 rounded-full hover:bg-secondary hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:bg-primary disabled:hover:scale-100 transition-all shadow-sm shrink-0 flex items-center justify-center"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}

import { useState, useEffect } from 'react';
import { Search, Filter, Inbox } from 'lucide-react';
import ConversationCard from '../components/ConversationCard';

export default function ConversationHistory() {
    const [conversations, setConversations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Load sessions saved by AIChat.jsx from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        setConversations(stored);
    }, []);

    const handleDelete = (id) => {
        const updated = conversations.filter(c => c.id !== id);
        setConversations(updated);
        localStorage.setItem('chatSessions', JSON.stringify(updated));
    };

    const filteredConversations = conversations.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.snippet.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-heading mb-2">History</h1>
                    <p className="text-body">Manage and review your past digital clone interactions.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-body">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-card text-body focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                    </div>
                    <button className="p-2 border border-border rounded-xl bg-card text-body hover:bg-background transition-colors flex items-center justify-center shrink-0">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                        <ConversationCard
                            key={conv.id}
                            title={conv.title}
                            date={conv.date}
                            snippet={conv.snippet}
                            onDelete={() => handleDelete(conv.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 bg-card border border-border rounded-2xl flex flex-col items-center gap-4">
                        <Inbox size={40} className="text-body/30" />
                        <div>
                            <p className="text-body text-lg font-medium">No conversations yet</p>
                            <p className="text-body/60 text-sm mt-1">Start chatting with Priya — your sessions will appear here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

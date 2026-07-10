import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import { Plus, Upload, MessageSquare, Users, Clock, Smile } from 'lucide-react';

const getStats = () => {
    const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const totalMessages = sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
    const totalSessions = sessions.length;

    // Derive avg reply length from AI messages
    const aiMessages = sessions.flatMap(s => s.messages?.filter(m => m.sender === 'ai') || []);
    const avgWords = aiMessages.length > 0
        ? Math.round(aiMessages.reduce((sum, m) => sum + m.text.split(' ').length, 0) / aiMessages.length)
        : 12;

    return [
        { id: 1, label: 'Total Messages Sent', value: totalMessages || 0, icon: MessageSquare },
        { id: 2, label: 'Chat Sessions', value: totalSessions || 0, icon: Users },
        { id: 3, label: 'Avg. AI Reply Length', value: `${avgWords} words`, icon: Clock },
        { id: 4, label: 'Top Vibe', value: 'Casual & Hinglish', icon: Smile },
    ];
};

const getRecentActivity = () => {
    const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    return sessions.slice(0, 5).map(s => ({
        id: s.id,
        action: s.title,
        target: s.snippet || 'No messages yet',
        time: s.date,
    }));
};

export default function Dashboard() {
    const [stats, setStats] = useState(getStats());
    const [recentActivity, setRecentActivity] = useState(getRecentActivity());

    // Refresh stats when page is focused (e.g. returning from chat)
    useEffect(() => {
        const refresh = () => {
            setStats(getStats());
            setRecentActivity(getRecentActivity());
        };
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-heading mb-2">Welcome Back! 👋</h1>
                    <p className="text-body">Here's a quick overview of your digital clone status.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/upload">
                        <Button variant="secondary" className="flex items-center gap-2">
                            <Upload size={18} />
                            <span>Upload Chat</span>
                        </Button>
                    </Link>
                    <Link to="/chat">
                        <Button variant="primary" className="flex items-center gap-2">
                            <Plus size={18} />
                            <span>New AI Chat</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <StatCard
                        key={stat.id}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        delay={i * 0.1}
                    />
                ))}
            </div>

            <div className="mt-4 bg-card rounded-2xl border border-border shadow-soft p-6 md:p-8">
                <h2 className="text-xl font-heading font-semibold text-heading mb-6">Recent Activity</h2>
                {recentActivity.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {recentActivity.map((activity, i) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex justify-between items-center py-3 border-b border-border/50 last:border-0"
                            >
                                <div>
                                    <p className="font-medium text-heading">{activity.action}</p>
                                    <p className="text-sm text-body truncate max-w-xs">{activity.target}</p>
                                </div>
                                <span className="text-xs text-body font-medium bg-background px-2 py-1 rounded-md shrink-0 ml-4">
                                    {activity.time}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-body/60">
                        <p>No activity yet — start a chat with Priya! 😄</p>
                        <Link to="/chat" className="text-primary text-sm hover:underline mt-2 inline-block">
                            Start chatting →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

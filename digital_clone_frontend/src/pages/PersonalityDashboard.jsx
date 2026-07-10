import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import { fetchPersonality } from '../services/api';
import { MessageCircle, Brain, Smile, Globe, Loader2 } from 'lucide-react';

const colors = ['#C68E5D', '#6F4E37', '#4B3621', '#7A8F69', '#C38A62', '#9B7D6A'];

export default function PersonalityDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPersonality()
            .then(setData)
            .catch(() => setError('Could not load personality data. Make sure the backend is running.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 gap-3 text-body">
                <Loader2 className="animate-spin" size={22} />
                <span>Loading personality data...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-16 text-red-400 bg-red-50 border border-red-200 rounded-2xl">
                <p>{error || 'Something went wrong.'}</p>
            </div>
        );
    }

    const { score, communicationStyle, languages, emojiUsage, topWords, favoritePhrases, averageReplyLength } = data;

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            <div className="mb-4">
                <h1 className="text-3xl font-bold font-heading text-heading mb-2">Personality Dashboard</h1>
                <p className="text-body">A detailed breakdown of your digital clone's communication style.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Clone Accuracy Score" value={`${score}%`} icon={Brain} delay={0.1} />
                <StatCard label="Avg. Reply Length" value={`${averageReplyLength} w`} icon={MessageCircle} delay={0.2} />
                <div className="col-span-1 md:col-span-2 bg-primary text-card rounded-2xl p-6 shadow-soft border border-primary/20 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-card/80 mb-2 flex items-center gap-2">
                        <Smile size={18} /> Communication Style
                    </h3>
                    <p className="font-heading font-medium text-lg leading-relaxed">{communicationStyle}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="Most Used Words" delay={0.3}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topWords} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#7A6F66', fontSize: 14 }} width={80} />
                                <Tooltip
                                    cursor={{ fill: '#F7F2EB' }}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E8DED1', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                                    {topWords.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                <div className="flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-card p-6 rounded-2xl border border-border shadow-soft flex-1"
                    >
                        <h3 className="text-lg font-heading font-semibold text-heading mb-4 flex items-center gap-2">
                            <Globe size={20} className="text-primary" /> Languages
                        </h3>
                        <div className="flex flex-col gap-4">
                            {languages.map((lang) => (
                                <div key={lang.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-heading">{lang.name}</span>
                                        <span className="text-body">{lang.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-background rounded-full h-2">
                                        <div className="bg-secondary h-2 rounded-full" style={{ width: `${lang.percentage}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-card p-6 rounded-2xl border border-border shadow-soft flex-1"
                    >
                        <h3 className="text-lg font-heading font-semibold text-heading mb-4">Top Emojis</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {emojiUsage.map(item => (
                                <div key={item.emoji} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50">
                                    <span className="text-2xl">{item.emoji}</span>
                                    <span className="font-medium text-body">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Favorite Phrases */}
            {favoritePhrases?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-card p-6 rounded-2xl border border-border shadow-soft"
                >
                    <h3 className="text-lg font-heading font-semibold text-heading mb-4">Favorite Phrases</h3>
                    <div className="flex flex-wrap gap-3">
                        {favoritePhrases.map((phrase, i) => (
                            <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                                "{phrase}"
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

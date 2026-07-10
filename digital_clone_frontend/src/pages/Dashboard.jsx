import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import { dashboardStats } from '../data/dashboardStats';
import { recentActivity } from '../data/recentActivity';
import { Plus, Upload } from 'lucide-react';

export default function Dashboard() {
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
                {dashboardStats.map((stat, i) => (
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
                                <p className="text-sm text-body">{activity.target}</p>
                            </div>
                            <span className="text-xs text-body font-medium bg-background px-2 py-1 rounded-md">
                                {activity.time}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

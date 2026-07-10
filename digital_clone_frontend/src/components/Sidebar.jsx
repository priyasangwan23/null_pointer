import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Upload, History, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
    const links = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
        { to: '/upload', icon: Upload, label: 'Upload Chat' },
        { to: '/personality', icon: User, label: 'Personality' },
        { to: '/history', icon: History, label: 'History' },
    ];

    return (
        <aside className="w-20 lg:w-64 border-r border-border bg-card shrink-0 hidden md:flex flex-col py-6">
            <div className="flex flex-col gap-2 px-4 flex-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-xl transition-colors relative group ${isActive ? 'text-primary bg-primary/5 font-medium' : 'text-body hover:text-heading hover:bg-background'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/10"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <link.icon size={20} className="relative z-10 shrink-0" />
                                <span className="hidden lg:block relative z-10">{link.label}</span>
                                {/* Tooltip for collapsed mode */}
                                <div className="lg:hidden absolute left-14 bg-heading text-card text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {link.label}
                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </aside>
    );
}

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Upload, History, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isExpanded, setIsExpanded }) {
    const links = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
        { to: '/upload', icon: Upload, label: 'Upload Chat' },
        { to: '/personality', icon: User, label: 'Personality' },
        { to: '/history', icon: History, label: 'History' },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full py-6">
            <div className="flex flex-col gap-2 px-4 flex-1 mt-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        title={!isExpanded ? link.label : ""}
                        className={({ isActive }) =>
                            `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                                isActive ? 'text-primary bg-primary/5 font-medium' : 'text-body hover:text-heading hover:bg-primary/5'
                            } ${isExpanded ? 'justify-start px-4' : 'justify-center px-0'}`
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
                                <link.icon size={22} className="relative z-10 shrink-0" />
                                
                                <span 
                                    className={`relative z-10 whitespace-nowrap transition-all duration-300 ${
                                        isExpanded ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0 hidden'
                                    }`}
                                >
                                    {link.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                        className="lg:hidden fixed inset-0 bg-heading/20 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside 
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col shrink-0
                    ${isExpanded ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Mobile Close Button */}
                <button 
                    onClick={() => setIsExpanded(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 text-body hover:text-heading hover:bg-background rounded-lg"
                >
                    <X size={20} />
                </button>
                
                {sidebarContent}
            </aside>
        </>
    );
}

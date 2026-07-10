import { Link } from 'react-router-dom';
import { User, Settings, Menu } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
    return (
        <header className="h-[70px] border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-body hover:text-heading hover:bg-background rounded-xl transition-colors"
                >
                    <Menu size={22} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-card shadow-sm">
                        <User size={18} />
                    </div>
                    <Link to="/" className="font-heading font-semibold text-lg md:text-xl text-heading tracking-tight">
                        Digital Clone
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link to="/settings" className="p-2 text-body hover:text-heading hover:bg-background rounded-xl transition-colors">
                    <Settings size={20} />
                </Link>
                <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-semibold text-sm shadow-sm cursor-pointer hover:bg-accent/20 transition-colors">
                    P
                </div>
            </div>
        </header>
    );
}

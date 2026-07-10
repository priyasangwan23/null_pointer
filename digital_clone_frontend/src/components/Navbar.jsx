import { Link } from 'react-router-dom';
import { Coffee, Settings } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-card">
                    <Coffee size={18} />
                </div>
                <Link to="/" className="font-heading font-semibold text-xl text-heading tracking-tight">
                    Digital Clone
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/settings" className="p-2 text-body hover:text-heading hover:bg-background rounded-lg transition-colors">
                    <Settings size={20} />
                </Link>
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent font-semibold text-sm">
                    A
                </div>
            </div>
        </header>
    );
}

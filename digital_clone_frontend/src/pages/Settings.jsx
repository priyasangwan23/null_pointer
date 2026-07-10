import { useState, useEffect } from 'react';
import { Download, Lock, Moon, Sun, Bell, Globe } from 'lucide-react';
import Button from '../components/Button';

export default function Settings() {
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState(true);
    const [privacyMode, setPrivacyMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-heading text-heading mb-2">Settings</h1>
                <p className="text-body">Manage your application preferences and digital clone data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Appearance Settings */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-soft flex flex-col gap-6">
                    <h3 className="font-heading font-semibold text-lg text-heading">Appearance & Preferences</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-body">
                            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                            <span>Theme</span>
                        </div>
                        <select
                            value={theme}
                            onChange={handleThemeChange}
                            className="bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-body">
                            <Globe size={20} />
                            <span>Language</span>
                        </div>
                        <select className="bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/50">
                            <option>English</option>
                            <option>Hinglish</option>
                        </select>
                    </div>
                </div>

                {/* Data & Privacy */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-soft flex flex-col gap-6">
                    <h3 className="font-heading font-semibold text-lg text-heading">Data & Privacy</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-body">
                            <Lock size={20} />
                            <div>
                                <p>Strict Privacy</p>
                                <p className="text-xs text-body/70">Don't store chat history</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPrivacyMode(!privacyMode)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${privacyMode ? 'bg-success' : 'bg-border'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${privacyMode ? 'left-7' : 'left-1'}`}></span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-body">
                            <Bell size={20} />
                            <span>Notifications</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-border'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`}></span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-soft">
                <h3 className="font-heading font-semibold text-lg text-heading mb-4">Export Data</h3>
                <p className="text-body text-sm mb-6 max-w-lg">
                    Download a completely autonomous copy of your digital clone data, including personality settings and chat history format.
                </p>
                <Button variant="secondary" className="flex items-center gap-2">
                    <Download size={18} />
                    <span>Export JSON</span>
                </Button>
            </div>

        </div>
    );
}

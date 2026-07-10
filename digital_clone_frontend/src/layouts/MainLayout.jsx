import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="h-screen w-full bg-background flex overflow-hidden">
            <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto w-full relative">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar />
                <main className="flex-1 px-4 py-6 md:p-8 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

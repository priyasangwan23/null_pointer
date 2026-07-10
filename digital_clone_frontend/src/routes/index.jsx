import { Routes, Route } from 'react-router-dom';
import SimpleLayout from '../layouts/SimpleLayout';
import MainLayout from '../layouts/MainLayout';
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import UploadChat from '../pages/UploadChat';
import Processing from '../pages/Processing';
import PersonalityDashboard from '../pages/PersonalityDashboard';
import AIChat from '../pages/AIChat';
import ConversationHistory from '../pages/ConversationHistory';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<SimpleLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/processing" element={<Processing />} />
                <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadChat />} />
                <Route path="/personality" element={<PersonalityDashboard />} />
                <Route path="/chat" element={<AIChat />} />
                <Route path="/history" element={<ConversationHistory />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

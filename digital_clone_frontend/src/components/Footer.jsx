export default function Footer() {
    return (
        <footer className="h-16 border-t border-border flex items-center justify-between px-6 bg-background text-body text-sm mt-auto">
            <div>&copy; {new Date().getFullYear()} Digital Clone.</div>
            <div className="flex gap-4">
                <a href="#" className="hover:text-heading transition-colors">Privacy</a>
                <a href="#" className="hover:text-heading transition-colors">Terms</a>
            </div>
        </footer>
    );
}

import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-body mb-8">Page Not Found</p>
            <Link to="/" className="text-accent underline font-medium">
                Back Home
            </Link>
        </div>
    );
}

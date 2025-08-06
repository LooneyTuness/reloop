import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div>
            <h2>Page Not Found</h2>
            <p>Sorry, the page you're looking for doesn't exist.</p>
            <Link to="/">Go back to Home</Link>
        </div>
    );
} 
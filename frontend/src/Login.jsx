import { useState } from 'react';
import { validateEmail } from './validation';

function Login({ onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!email || !password) {
            setMessage({ type: 'error', text: 'Please fill in both email and password!' });
            return;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            setMessage({ type: 'error', text: emailError });
            return;
        }

        // Log in through the backend - on success it sets the session cookie
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, haslo: password })
            });
            const data = await response.json();

            if (response.status === 401) {
                // Block - user does not exist or provided invalid credentials
                setMessage({ type: 'error', text: 'Invalid email or password!' });
                return;
            }

            if (!response.ok) {
                setMessage({ type: 'error', text: data.message });
                return;
            }

            if (onLoginSuccess) onLoginSuccess(data);
        } catch {
            setMessage({ type: 'error', text: 'No connection to the server!' });
        }
    };

    return (
        <div className="main-content">
            <div className="form-box">
                <div className="form-header">
                    <h2>Sign In</h2>
                    <p>Enter your details to access the fleet</p>
                </div>

                {message && (
                    <div className={message.type === 'error' ? 'message-error' : 'message-success'}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="userEmail@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary">Sign In</button>
                </form>

                <div className="form-footer">
                    <span>Don't have an account? </span>
                    <button type="button" className="btn-link" onClick={onSwitchToRegister}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;

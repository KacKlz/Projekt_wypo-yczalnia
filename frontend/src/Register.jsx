import { useState } from 'react';
import { validateEmail, validatePassword, validatePasswordMatch } from './validation';

function Register({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        // Check for empty fields
        if (!email || !password || !repeatPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields!' });
            return;
        }

        // Validate email format
        const emailError = validateEmail(email);
        if (emailError) {
            setMessage({ type: 'error', text: emailError });
            return;
        }

        // Validate password match
        const matchError = validatePasswordMatch(password, repeatPassword);
        if (matchError) {
            setMessage({ type: 'error', text: matchError });
            return;
        }

        // Validate password security requirements
        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage({ type: 'error', text: passwordError });
            return;
        }

        // Save the new user in the database through the backend
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, haslo: password })
            });
            const data = await response.json();

            if (response.status === 409) {
                setMessage({ type: 'error', text: 'An account with this email address already exists!' });
                return;
            }

            if (!response.ok) {
                setMessage({ type: 'error', text: data.message });
                return;
            }

            setMessage({ type: 'success', text: 'Account created successfully! You can now sign in.' });
        } catch {
            setMessage({ type: 'error', text: 'No connection to the server!' });
        }
    };

    return (
        <div className="main-content">
            <div className="form-box">
                <div className="form-header">
                    <h2>Sign Up</h2>
                    <p>Create an account to book vehicles</p>
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

                    <div className="form-field">
                        <label>Repeat Password</label>
                        <input 
                            type="password" 
                            placeholder="******"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary">Sign Up</button>
                </form>

                <div className="form-footer">
                    <span>Already have an account? </span>
                    <button type="button" className="btn-link" onClick={onSwitchToLogin}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;

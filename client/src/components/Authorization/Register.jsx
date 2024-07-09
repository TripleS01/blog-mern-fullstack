import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import PathTo from "../../paths";

const URL = import.meta.env.VITE_APP_URL;

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    const [usernameValid, setUsernameValid] = useState(null);
    const [emailValid, setEmailValid] = useState(null);
    const [passwordsValid, setPasswordsValid] = useState(null);
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const emailPattern = /@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

    async function onRegister(event) {
        event.preventDefault();

        if (!email || !username || !password || !repeatPassword) {
            setErrorMessage('All fields are required');
            return;
        }

        if (password !== repeatPassword) {
            return;
        }

        const response = await fetch(URL + '/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, repeatPassword }),
            headers: { 'Content-type': 'application/json' },
        });

        if (response.ok) {
            response.json().then(info => {
                setRedirect(true);
            })
        } else {
            setErrorMessage('Registration failed');
        }
    }

    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUsername(value);
        setUsernameValid(usernamePattern.test(value));
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        setEmailValid(emailPattern.test(value));
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        setPasswordsValid(value === repeatPassword);
    };

    const handleRepeatPasswordChange = (event) => {
        const value = event.target.value;
        setRepeatPassword(value);
        setPasswordsValid(value === password);
    };

    if (redirect) {
        return <Navigate to={PathTo.Login} />;
    }

    return (
        <>
            <div className="container-height">

                <div className="log-reg-create-edit">
                    <form className="register" onSubmit={onRegister}>
                        <h1>Let's Get Started</h1>
                        <h3>Create an account, sign up for free!</h3>
                        <img src="/img/register.jpg" />
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {email && (
                            <p className={`pattern-hint ${emailValid === null ? '' : emailValid ? 'correct' : 'incorrect'}`}>
                                {emailValid ? 'Valid email address pattern' : 'Please enter a valid email address pattern'}
                            </p>
                        )}

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        {username && (
                            <p className={`pattern-hint ${usernameValid === null ? '' : usernameValid ? 'correct' : 'incorrect'}`}>
                                {usernameValid ? 'Valid username pattern' : 'Please enter a valid username pattern'}
                            </p>
                        )}

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <input
                            type="password"
                            placeholder="Repeat Password"
                            value={repeatPassword}
                            onChange={handleRepeatPasswordChange}
                        />
                        {password && repeatPassword && (
                            <p className={`pattern-hint ${passwordsValid === null ? '' : passwordsValid ? 'correct' : 'incorrect'}`}>
                                {passwordsValid ? 'Passwords match' : 'Passwords do not match'}
                            </p>
                        )}

                        {errorMessage && (
                            <p className="required-message">
                                {errorMessage}
                            </p>
                        )}

                        <button>Register</button>

                        <div className="form-nav">
                            <span>
                                Already have an account? <Link to={PathTo.Login}>
                                    Sign In
                                </Link>
                            </span>
                        </div>

                    </form>
                </div>

            </div>
        </>
    );
}
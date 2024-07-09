import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";

import PathTo from "../../paths";
import { UserContext } from "../../contexts/UserContext";

const URL = import.meta.env.VITE_APP_URL;

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    const [identifierValid, setIdentifierValid] = useState(null);
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const emailPattern = /@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

    async function onLogin(event) {
        event.preventDefault();

        if (!identifier || !password) {
            setErrorMessage('All fields are required');
            return;
        }

        const response = await fetch(URL + '/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password }),
            headers: { 'Content-type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            response.json().then(info => {
                setUserInfo(info);
                setRedirect(true);
            })
        } else {
            setErrorMessage('Wrong credentials');
        }
    }

    const handleIdentifierChange = (event) => {
        const value = event.target.value;
        setIdentifier(value);
        setIdentifierValid(usernamePattern.test(value) || emailPattern.test(value));
    }

    if (redirect) {
        return <Navigate to={PathTo.Home} />;
    }

    return (
        <>
            <div className="container-height">

                <div className="log-reg-create-edit">

                    <form className="login" onSubmit={onLogin}>
                        <h1>Welcome Back!👋</h1>
                        <h3>Login to your existent account!</h3>
                        <img src="/img/login.jpg" />
                        <input
                            type="text"
                            placeholder="Username or Email"
                            value={identifier}
                            onChange={handleIdentifierChange}
                        />
                        {identifier && (
                            <p className={`pattern-hint ${identifierValid === null ? '' : identifierValid ? 'correct' : 'incorrect'}`}>
                                {identifierValid ? 'Valid email address or username pattern!' : 'Please enter a valid email address or username pattern!'}
                            </p>
                        )}

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                        />

                        {errorMessage && (
                            <p className="required-message">
                                {errorMessage}
                            </p>
                        )}

                        <button>Login</button>

                        <div className="form-nav">
                            <span>Don't have an account? <Link to={PathTo.Register}>
                                Sign Up
                            </Link>
                            </span>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
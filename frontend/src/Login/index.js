import React, { useState, useEffect } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import loginCss from './Login.module.css';
import './login.css';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [jwt, setJwt] = useLocalState("", "jwt");

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    function sendLoginRequest(event) {
        event.preventDefault();
        const reqBody = {
            "username": username,
            "password": password,
        };

        fetch('/login', {
            "headers": {
                "Content-Type": "application/json"
            },
            "method": "post",
            "body": JSON.stringify(reqBody)
        })
            .then((response) => {
                if (response.status === 200)
                    return response.json();
                else
                    return response.text().then((errorMessage) => {
                        throw new Error(errorMessage);
                    });
            })
            .then((data) => {
                setJwt(data.token);
                window.location.href = "predictor";
            }
            ).catch((error) => {
                alert(error.message);
            });

    }


    useEffect(() => {
        const handleBroadcastMessage = (event) => {
            setTheme(event.data);
        };

        const bc = new BroadcastChannel('theme_change');
        bc.addEventListener('message', handleBroadcastMessage);

        return () => {
            bc.removeEventListener('message', handleBroadcastMessage);
        };
    }, []);

    return (
        <div className={`bodyContainer-lg ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className={`authContainer-lg ${theme === 'dark' ? 'dark' : 'light'}`}>
                <h1>Prijavi se u <br />HNLScorePredictor</h1>
                <form onSubmit={sendLoginRequest} >
                    <div>
                        <label htmlFor='username'>Username</label>
                        <input type="text"
                            id="username"
                            required
                            value={username}
                            onChange={(event) => setUsername(event.target.value)} />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div>
                        <button id="submit-btn" type="submit">Prijava</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
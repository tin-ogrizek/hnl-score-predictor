import React, { useState, useEffect } from "react";
import { useLocalState } from '../util/useLocalStorage';
import registerCss from './Register.module.css'
import './register.css';

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [jwt, setJwt] = useLocalState("", "jwt");

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");


    function sendRegisterRequest(event) {
        event.preventDefault();
        const reqRegBody = {
            "username": username,
            "email": email,
            "password": password
        };

        fetch('/register', {
            "headers": {
                "Content-Type": "application/json"
            },
            "method": "post",
            "body": JSON.stringify(reqRegBody)
        }).then((response) => {
            if (response.status === 200)
                return response.json();
            else
                return response.text().then((errorMessage) => {
                    throw new Error(errorMessage);
                });
        }).then((data) => {
            setJwt(data.token);
            window.location.href = "predictor";
        }).catch((error) => {
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
        <div className={`bodyContainer-rg ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className={`authContainer-rg ${theme === 'dark' ? 'dark' : 'light'}`}>
                <h1>Registracija</h1>
                <form onSubmit={sendRegisterRequest} >
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
                            minLength="8"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <div>
                        <button id="submit-btn" type="submit">Registracija</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
import React, { useEffect, useState } from 'react';
import './homepage.css';

const Homepage = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

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
        <div className={`container-hp ${theme === 'dark' ? 'dark' : 'light'}`}>
            <h1>Dobrodošli na HNLScorePredictor</h1>
            <div className={`buttons-container-hp ${theme === 'dark' ? 'dark' : 'light'}`}>
                <p>Započni!</p>
                <div className={`buttons-hp ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <a href='/register' className={`button-hp ${theme === 'dark' ? 'dark' : 'light'}`}>Registracija</a>
                    <a href='/login' className={`button-hp ${theme === 'dark' ? 'dark' : 'light'}`}>Prijava</a>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
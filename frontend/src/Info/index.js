import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import './info.css';

const Info = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
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
        <>
            <div className={`body-container-info ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div className={`info-container-info ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <div className={`rules-container-info ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <h2>Pravila bodovanja</h2>
                        <ul>
                            <li>Točno predviđanje pobjednika ili gubitnika, ili izjednačenog rezultata: +2 boda</li>
                            <li>Točan broj golova domaće ekipe: +1 bod</li>
                            <li>Točan broj golova gostujuće ekipe: +1 bod</li>
                            <li>Točna gol razlika: +1 bod</li>
                        </ul>
                    </div>
                    <div className={`rights-container-info ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <h2>Izvor podataka</h2>
                        <p>Službena stranica SuperSport Hrvatske nogometne lige - <a href='https://hnl.hr/' target='_blank' rel="noreferrer">hnl.hr</a></p>
                    </div>
                    <div className={`contact-container-info ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <h2>Kontakt</h2>
                        <p><a href='mailto:hnlscorepredictor@gmail.com'>hnlscorepredictor@gmail.com</a></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Info;
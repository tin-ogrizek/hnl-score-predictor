import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import logo from "../images/hnl_logo_2.png"
import './header.css'

const Header = () => {
    const [click, setClick] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const handleClick = () => {
        setClick(!click);
        const menuActiveClass = theme === 'dark' ? 'nav-menu-active-dark' : 'nav-menu-active-light';
        if (!click) {
            document.body.classList.add(menuActiveClass);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.classList.remove(menuActiveClass);
            document.body.style.overflow = 'unset';
        }
    }
    const closeMobileMenu = () => {
        setClick(false)
        document.body.style.overflow = 'unset';
    };

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
            <nav className={`navbar ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div className={`navbar-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <Link to='/' className={`navbar-logo ${theme === 'dark' ? 'dark' : 'light'}`} onClick={closeMobileMenu}>
                        HNLScorePredictor
                    </Link>
                </div>
                <div className={`menu-icon ${theme === 'dark' ? 'dark' : 'light'}`} onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={`nav-menu ${click ? 'active' : ''} ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <li className={`nav-item ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <Link to='/table' className={`nav-links ${theme === 'dark' ? 'dark' : 'light'}`} onClick={closeMobileMenu}>
                            HNL
                        </Link>
                    </li>
                    <li className={`nav-item ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <Link to='/leaderboard' className={`nav-links ${theme === 'dark' ? 'dark' : 'light'}`} onClick={closeMobileMenu}>
                            Ljestvica
                        </Link>
                    </li>
                    <li className={`nav-item ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <Link to='/predictor' className={`nav-links ${theme === 'dark' ? 'dark' : 'light'}`} onClick={closeMobileMenu}>
                            Predictor
                        </Link>
                    </li>
                    <li className={`nav-item ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <Link to='/info' className={`nav-links ${theme === 'dark' ? 'dark' : 'light'}`} onClick={closeMobileMenu}>
                            Info
                        </Link>
                    </li>
                    <li className={`nav-item ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <Link to='/settings' className={`nav-links ${theme === 'dark' ? 'dark' : 'light'}`} onClick={closeMobileMenu}>
                            Postavke
                        </Link>
                    </li>
                    <li className={`nav-item ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <Link to='/profile' className={`nav-links ${theme === 'dark' ? 'dark' : 'light'}`} onClick={closeMobileMenu}>
                            Profil
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Header;
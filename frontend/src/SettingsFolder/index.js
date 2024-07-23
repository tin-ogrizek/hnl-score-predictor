import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import './settingsDark.css';

const SettingsPath = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const handleThemeChange = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        const bc = new BroadcastChannel('theme_change');
        bc.postMessage(newTheme);
    };

    const changePassword = (event) => {

        event.preventDefault();

        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const repeatNewPassword = document.getElementById('repeatNewPassword').value;

        fetch("/api/settings/change-password", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            "body": JSON.stringify({
                "oldPassword": oldPassword,
                "newPassword": newPassword,
                "repeatNewPassword": repeatNewPassword
            }),
        })
            .then(response => {
                if (response.status === 202) {
                    document.getElementById('oldPassword').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('repeatNewPassword').value = '';
                    alert("Lozinka uspješno promijenjena.");
                    return response.json();
                } else
                    return response.text().then((errorMessage) => {
                        throw new Error(errorMessage);
                    });
            })
            .catch(error => {
                document.getElementById('oldPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('repeatNewPassword').value = '';
                alert(error.message);
            });
    };

    return (
        <>
            <div className={`body-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div className={`settings-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <div className={`password-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <form className={`password-form ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label className={`label-naslov ${theme === 'dark' ? 'dark' : 'light'}`}>Promijeni lozinku</label>
                            <div className={`input-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                                <label htmlFor='password'>Trenutna lozinka</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    required
                                    minLength="8"
                                />

                            </div>
                            <div className={`input-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                                <label htmlFor='password'>Nova lozinka</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    required
                                    minLength="8" />

                            </div>
                            <div className={`input-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                                <label htmlFor='password'>Ponovljena nova lozinka</label>
                                <input
                                    type="password"
                                    id="repeatNewPassword"
                                    required
                                    minLength="8" />

                            </div>
                            <div className={`savebtn-div ${theme === 'dark' ? 'dark' : 'light'}`} type="submit">
                                <button onClick={changePassword}>Spremi promjenu</button>
                            </div>
                        </form>
                    </div>
                    <div className={`themes-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <div className={`themes-subcontainer ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label className={`themes-label ${theme === 'dark' ? 'dark' : 'light'}`}>Promijeni temu</label>
                            <div className={`buttons-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                                <label className={`switch ${theme === 'dark' ? 'dark' : 'light'}`}>
                                    <input
                                        className={`theme-switch ${theme === 'dark' ? 'dark' : 'light'}`}
                                        type='checkbox'
                                        checked={theme === 'light'}
                                        onChange={handleThemeChange} />
                                    <div></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPath;
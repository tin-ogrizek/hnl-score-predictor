import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import './profile.css';


const Profile = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [userData, setUserData] = useState(null);

    const [username, setUsername] = useState();

    const [startDate, setStartDate] = useState();

    const [totalPoints, setTotalPoints] = useState();

    const [numExactResults, setNumExactResults] = useState(0);

    const [maxMatchday, setMaxMatchday] = useState("");

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


    /**
     * Gumb za logout
     */
    const handelLogout = () => {
        localStorage.removeItem('jwt');

        window.location.reload();
    };

    const fetchUserProfile = () => {
        fetch('/api/profile', {
            "headers": {
                "Content-type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            "method": "get"
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then((errorMessage) => {
                        throw new Error(errorMessage);
                    })
                }
            })
            .then((data) => {
                setUsername(data.username);
                setStartDate(data.accStartDate);
                setTotalPoints(data.totalUserPoints);
                setNumExactResults(data.numOfGuessMatchdays);
                if (data.mostSuccessMatchday !== null) {
                    setMaxMatchday(data.mostSuccessMatchday);
                } else {
                    setMaxMatchday("");
                }
                setUserData(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    /*
        useEffect(() => {
            console.log(username);
            console.log(startDate);
            console.log(totalPoints);
            console.log(numExactResults);
            console.log(maxMatchday);
        }, [username, startDate, totalPoints, numExactResults, maxMatchday]);
    */

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}.`;
        return formattedDate;
    };

    return userData ? (
        <>
            <div className={`body-container-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div className={`position-container-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <div className={`profile-container-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <div className={`label-info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label>Korisničko ime:</label>
                            <div className={`info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                                {username}
                            </div>
                        </div>
                        <div className={`label-info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label>Datum pridruživanja:</label>
                            <div className={`info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                                {formatDate(startDate)}
                            </div>
                        </div>
                        <div className={`label-info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label>Ukupan broj bodova:</label>
                            <div className={`info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                                {totalPoints}
                            </div>
                        </div>
                        <div className={`label-info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label>Broj točno pogođenih rezultata:</label>
                            <div className={`info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                                {numExactResults}
                            </div>
                        </div>
                        <div className={`label-info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label>Kolo s najviše bodova:</label>
                            <div className={`info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                                {maxMatchday}
                            </div>
                        </div>
                        <div className={`label-info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <label>Opcija odjave:</label>
                            <div className={`info-div-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                                <button onClick={handelLogout}
                                    className={`logout-button-pf ${theme === 'dark' ? 'dark' : 'light'}`}>
                                    Odjavi se
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : null;
};

export default Profile;
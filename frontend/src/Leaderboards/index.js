import React, { useState, useEffect } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import './leaderboards.css'

const Leaderboards = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const [leaderboards, setLeaderboards] = useState({});

    const [currentUsername, setCurrentUsername] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const topUsersLimit = 30; // STAVIL BUM NA 30 korisnika

    const [dataFetched, setDataFetched] = useState(false);

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

    const fetchUsers = () => {
        fetch('/api/prediction-score/leaderboards', {
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
                setLeaderboards(data);
                setDataFetched(true);
            })
            .catch((error) => {
                alert(error.message);
            });
    };


    useEffect(() => {
        fetchUsers();

        const extractUsernameFromJWT = (jwt) => { // uzimanje korisnickog imena iz jwt-a
            if (!jwt) return null;

            const token = jwt.split('.')[1];
            const decodedToken = atob(token);
            const parsedToken = JSON.parse(decodedToken);

            return parsedToken.sub;
        };

        setCurrentUsername(extractUsernameFromJWT(jwt));
    }, [jwt]);

    const sortedUsers = Object.entries(leaderboards) // sortiranje korisnika
        .map(([username, points]) => ({ username, points }))
        .sort((a, b) => b.points - a.points);

    const currentUserRank = sortedUsers.findIndex((user) => user.username === currentUsername) + 1; // trenutna pozicija ulogiranog korisnika

    const topUsers = sortedUsers.slice(0, topUsersLimit); // samo top # korisnika

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = topUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber); // mijanjenje stranica

    if (!dataFetched) {
        return null;
    }

    return (
        <div className={`body-container-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className={`ajdusting-container-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div className={`leaderboard-container-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <div className={`leaderboard-data-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <div className={`row-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
                            <div className={`header-container-ls ${theme === 'dark' ? 'dark' : 'light'}`}>
                                <div className={`position-lb ${theme === 'dark' ? 'dark' : 'light'}`}>Pozicija</div>
                                <div className={`points-lb ${theme === 'dark' ? 'dark' : 'light'}`}>Broj bodova</div>
                            </div>
                        </div>
                        {currentUsers.map((user, index) => (
                            <div className={`content-container-ls ${user.username === currentUsername ? 'highlighted' : ''} ${theme === 'dark' ? 'dark' : 'light'}`}>
                                <div key={index} className={`data-row-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
                                    <div className={`row-position-lb ${theme === 'dark' ? 'dark' : 'light'}`}>{indexOfFirstUser + index + 1}</div>
                                    <div className={`row-username-lb ${theme === 'dark' ? 'dark' : 'light'}`}>{user.username}</div>
                                    <div className={`row-points-lb ${theme === 'dark' ? 'dark' : 'light'}`}>{user.points}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        usersPerPage={usersPerPage}
                        totalUsers={topUsers.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                    {currentUserRank > topUsersLimit && (
                        <div className={`personal-container-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
                            {currentUsername && (
                                <div className={`optional-row-lb ${theme === 'dark' ? 'dark' : 'light'}`}>
                                    <div className={`row-position-lb ${theme === 'dark' ? 'dark' : 'light'}`}>{currentUserRank}</div>
                                    <div className={`row-username-lb ${theme === 'dark' ? 'dark' : 'light'}`}>{currentUsername}</div>
                                    <div className={`row-points-lb ${theme === 'dark' ? 'dark' : 'light'}`}>{leaderboards[currentUsername] || 0}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
    const pageNumbers = [];
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

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className={`pagination ${theme === 'dark' ? 'dark' : 'light'}`}>
                {pageNumbers.map((number) => (
                    <li key={number}
                        className={currentPage === number ? 'active' : ''}>
                        <button
                            className={`page-num-lb ${theme === 'dark' ? 'dark' : 'light'}`}
                            onClick={() => paginate(number)}>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Leaderboards;
import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import predictorCss from './Predictor.module.css';
import { FaChevronCircleRight } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import moment from 'moment-timezone';
import './predictor.css';

const Predictor = () => {

    const [jwt, setJwt] = useLocalState("", "jwt");

    const [matchdays, setMatchdays] = useState([]);

    const [startIndex, setStartIndex] = useState(0);
    const [focusIndex, setFocusIndex] = useState(0);
    const [selectedMatchdayIndex, setSelectedMatchdayIndex] = useState(null);
    const [numMatchdays, setNumMatchdays] = useState(7);

    const [userPredictions, setUserPredictions] = useState([]);

    const [totalUserPoints, setTotalUserPoints] = useState(0);

    const [inputValue, setInputValue] = useState('');

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");


    const fetchUserPrediction = () => {
        fetch('/api/prediction-score/user-score', {
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
                setUserPredictions(data);
                setTotalUserPoints(data.length > 0 && data[0].user && data[0].user.points !== undefined
                    ? data[0].user.points
                    : 0);
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const fetchMatchdays = () => {
        fetch('/api/predictor/match-days', {
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
                    });
                }
            })
            .then((data) => {
                setMatchdays(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    };
    useEffect(() => {
        fetchMatchdays();

        const intervalId = setInterval(fetchMatchdays, 24 * 60 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetchUserPrediction();
        console.log(userPredictions);
    }, [inputValue, selectedMatchdayIndex]);

    /*
    useEffect(() => {
        setSelectedMatchdayIndex(Object.keys(matchdays).length);
        console.log(selectedMatchdayIndex);
    }, []);

    useEffect(() => {
        console.log(selectedMatchdayIndex);
    }, [selectedMatchdayIndex]);
    */

    /* navigacija, broj kola*/
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1875 && window.innerWidth > 1643) {
                setNumMatchdays(6);
            } else if (window.innerWidth <= 1643 && window.innerWidth > 1408) {
                setNumMatchdays(5);
            } else if (window.innerWidth <= 1408 && window.innerWidth > 1380) {
                setNumMatchdays(4);
            } else if (window.innerWidth < 1380 && window.innerWidth > 1186) {
                setNumMatchdays(5);
            } else if (window.innerWidth <= 1186 && window.innerWidth > 990) {
                setNumMatchdays(4);
            } else if (window.innerWidth <= 990 && window.innerWidth > 793) {
                setNumMatchdays(3);
            } else if (window.innerWidth <= 793 && window.innerWidth > 597) {
                setNumMatchdays(2);
            } else if (window.innerWidth <= 597) {
                setNumMatchdays(1);
            } else {
                setNumMatchdays(7);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);



    useEffect(() => {
        setFocusIndex(Object.keys(matchdays).length - 1);

        setStartIndex(Math.max(0, Object.keys(matchdays).length - numMatchdays));

        setSelectedMatchdayIndex(Object.keys(matchdays).length);
    }, [Object.keys(matchdays).length]);

    const handleButtonClick = (matchday) => {
        const numPart = matchday.match(/\d+/);

        if (parseInt(numPart, 10) >= 10) {
            setSelectedMatchdayIndex(parseInt(matchday.slice(0, 2)));
        } else {
            setSelectedMatchdayIndex(parseInt(matchday.slice(0, 1)));
        }
    };

    const handlePrevButtonClick = () => {
        if (numMatchdays === 1) {
            console.log(selectedMatchdayIndex);
            const prevMatchdayIndex = selectedMatchdayIndex - 1;
            if (prevMatchdayIndex > 0) {
                setSelectedMatchdayIndex(prevMatchdayIndex);
                if (startIndex >= numMatchdays) {
                    setStartIndex(startIndex - numMatchdays);
                } else {
                    setStartIndex(0);
                }
            }
        } else {
            if (startIndex >= numMatchdays) {
                setStartIndex(startIndex - numMatchdays);
                setSelectedMatchdayIndex(selectedMatchdayIndex - numMatchdays);
                //console.log("PREVIOUS BUTTON - SelectedMatchdayIndex: ", selectedMatchdayIndex);
            } else {
                setStartIndex(0);
                setSelectedMatchdayIndex(numMatchdays);
                //console.log("PREVIOUS BUTTON - SelectedMatchdayIndex: ", selectedMatchdayIndex);
            }
        }
    };

    const handleNextButtonClick = () => {
        if (numMatchdays === 1) {
            console.log(selectedMatchdayIndex);
            const nextMatchdayIndex = selectedMatchdayIndex + 1;
            if (nextMatchdayIndex <= Object.keys(matchdays).length) {
                setSelectedMatchdayIndex(nextMatchdayIndex);
                const nextIndex = Math.min(startIndex + numMatchdays, Object.keys(matchdays).length - numMatchdays);
                setStartIndex(nextIndex);
            }
        } else {
            const nextIndex = Math.min(startIndex + numMatchdays, Object.keys(matchdays).length - numMatchdays);
            setStartIndex(nextIndex);
            if ((selectedMatchdayIndex + numMatchdays) <= Object.keys(matchdays).length) {
                setSelectedMatchdayIndex(selectedMatchdayIndex + numMatchdays);
                //console.log("NEXT BUTTON - SelectedMatchdayIndex: ", selectedMatchdayIndex);
            } else if ((selectedMatchdayIndex + numMatchdays) > Object.keys(matchdays).length) {
                setSelectedMatchdayIndex((Object.keys(matchdays).length - selectedMatchdayIndex) + selectedMatchdayIndex);
                //console.log("NEXT BUTTON - SelectedMatchdayIndex: ", selectedMatchdayIndex);
            }
        }
    };


    const formattedDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}.`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };



    useEffect(() => {
        const interval = setInterval(() => {
            Object.keys(matchdays).forEach(matchdayKey => {
                matchdays[matchdayKey].forEach(match => {
                    if (!match.hasOwnProperty('hasPassed') || match.hasPassed === "no") {
                        match.hasPassed = hasDateTimePassed(match.gameTime) ? "yes" : "no";
                    }
                });
            });
            setMatchdays({ ...matchdays });
        }, 500);

        return () => clearInterval(interval);
    }, [matchdays]);

    function hasDateTimePassed(dateTimeString) {
        const gamePlayingDateTimeTz = moment.tz(dateTimeString, "Europe/Zagreb");
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const currentDateTime = new Date();

        const userDateTimetz = moment.tz(currentDateTime, userTimeZone);

        return gamePlayingDateTimeTz.isBefore(userDateTimetz);
    }


    const handleInputChange = (e, matchId, predictionTeam) => {
        const { value } = e.target;
        setInputValue(value);
        if (value !== "") {
            e.target.blur();
            handleInputBlur(e);
        }
        setUserPredictions(prevUserPredictions => {
            const updatedPredictions = prevUserPredictions.map(prediction => {
                if (prediction.fixture.id === matchId) {
                    return {
                        ...prediction,
                        [predictionTeam]: value
                    };
                }
                return prediction;
            });
            return updatedPredictions;
        });

        if (predictionTeam === "userHomeTeamScore") {
            sendHomePredictionsToDatabase(matchId, value);
        } else if (predictionTeam === "userAwayTeamScore") {
            sendAwayPredictionsToDatabase(matchId, value);
        }
    };

    const sendHomePredictionsToDatabase = (fixtureId, predictionValue) => {
        fetch(`/api/prediction-score/submit-home/${fixtureId}`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            "body": JSON.stringify({
                "inputResult": predictionValue
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation: ", error);
            });
    };


    const sendAwayPredictionsToDatabase = (fixtureId, predictionValue) => {
        fetch(`/api/prediction-score/submit-away/${fixtureId}`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            "body": JSON.stringify({
                "inputResult": predictionValue
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation: ", error);
            });
    };


    const handleInputBlur = (e) => {
        if (theme === 'dark') {
            e.target.style.backgroundColor = 'rgb(125, 163, 210)';
        } else if (theme === 'light') {
            e.target.style.backgroundColor = 'rgb(24, 238, 242)';
        }

        //e.target.style.color = 'rgb(5, 6, 121)';
        setTimeout(() => {
            e.target.style.backgroundColor = '';
            e.target.style.color = '';
        }, 500);
    };

    /* sluzi za mijenjanje teme */
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

    const teamWebsites = {
        "Dinamo": "https://gnkdinamo.hr/",
        "Hajduk": "https://hajduk.hr/",
        "Rijeka": "https://nk-rijeka.hr/",
        "Osijek": "https://nk-osijek.hr/",
        "Lokomotiva": "https://nklokomotiva.hr/",
        "Gorica": "https://www.hnk-gorica.hr/",
        "Istra 1961": "https://nkistra.com/",
        "Slaven Belupo": "https://nk-slaven-belupo.hr/",
        "Rudeš": "https://nk-rudes.hr/",
        "Varaždin": "https://nk-varazdin.hr/"
    };

    const getTeamWebsiteUrl = (teamName) => {
        if (teamWebsites.hasOwnProperty(teamName)) {
            return teamWebsites[teamName];
        } else {
            return "/predictor";
        }
    }

    return (
        <div className={`mainContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className={`navContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                <button onClick={handlePrevButtonClick} disabled={startIndex === 0}
                    className={`arrowButton-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <FaChevronCircleLeft />
                </button>
                <nav className={`navigation-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <ul className={`navList-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                        {Object.keys(matchdays)
                            .slice(startIndex, startIndex + numMatchdays)
                            .map((matchday, index) => (
                                <li key={index} className={`navItem-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                    <button onClick={() => handleButtonClick(matchday)}
                                        className={`${`navButton-pr ${theme === 'dark' ? 'dark' : 'light'}`} ${selectedMatchdayIndex.toString() === matchday.slice(0, 2) || selectedMatchdayIndex.toString() === matchday.slice(0, 1) ? 'active' : ''}`}
                                        autoFocus={index === focusIndex}>
                                        {matchday}
                                    </button>
                                </li>
                            ))}
                    </ul>
                </nav>
                <button onClick={handleNextButtonClick} disabled={startIndex >= Object.keys(matchdays).length - numMatchdays}
                    className={`arrowButton-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <FaChevronCircleRight />
                </button>
                <div className={`totalPotinsContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <div className={`totalPointsAjdust-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <div className={`stringTotal-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                            Total
                        </div>
                        <div className={`totalPointsNum-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                            {totalUserPoints}
                            <span>
                                pts
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`fixturesContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                {Object.keys(matchdays).map((matchdayKey, index) => (
                    <div key={index} className={`matchdayContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                        {matchdays[matchdayKey]
                            .filter(match => match.matchDay === `${selectedMatchdayIndex}. kolo`)
                            .map((match, matchIndex) => {
                                const userPrediction = userPredictions.find(prediction => prediction.fixture.id === match.id);
                                const fixturePoints = userPrediction ? userPrediction.fixturePoints : 0;

                                return (
                                    <div key={matchIndex} className={`matchContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                        <div className={`adjustingMatchContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                            <div className={`dateAndScoreContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                <h2 className={`dateDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                    {/*<label>2x</label>*/}
                                                    <span>{formattedDateTime(match.gameTime)}</span>
                                                </h2>
                                                <div className={`realScoreDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                    <span>{match.homeTeamScore} - {match.awayTeamScore}</span>
                                                </div>
                                            </div>
                                            <div className={`clubsContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                <div className={`clubInfoDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                    <div className={`clubImageDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                        <img src={match.homeTeam.logoUrl}
                                                            alt={`${match.homeTeam.clubName} logo`}
                                                            className={`clubLogo-pr ${theme === 'dark' ? 'dark' : 'light'}`}
                                                            onClick={() => window.open(getTeamWebsiteUrl(match.homeTeam.clubName), "_blank")}
                                                            title={getTeamWebsiteUrl(match.homeTeam.clubName)} />
                                                    </div>
                                                    <div className={`clubNameDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                        {match.homeTeam.clubName}
                                                    </div>
                                                </div>
                                                <div className={`inputDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>

                                                    <input
                                                        type="tel"
                                                        pattern="[0-9]"
                                                        maxLength="1"
                                                        inputMode="numeric"
                                                        autoComplete="off"
                                                        name="homeScorePrediction"
                                                        defaultValue={userPrediction ? userPrediction.homeScorePrediction : undefined}
                                                        onInput={(e) => {
                                                            if (!/^\d$/.test(e.target.value)) {
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                        onChange={(e) => handleInputChange(e, match.id, 'userHomeTeamScore')}
                                                        disabled={match.hasPassed === "yes"}>
                                                    </input>


                                                    <input
                                                        type="tel"
                                                        pattern="[0-9]"
                                                        maxLength="1"
                                                        inputMode="numeric"
                                                        autoComplete="off"
                                                        name="awayScorePrediction"
                                                        defaultValue={userPrediction ? userPrediction.awayScorePrediction : undefined}
                                                        onInput={(e) => {
                                                            if (!/^\d$/.test(e.target.value)) {
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                        onChange={(e) => handleInputChange(e, match.id, 'userAwayTeamScore')}
                                                        disabled={match.hasPassed === "yes"}
                                                    >
                                                    </input>

                                                </div>
                                                <div className={`clubInfoDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                    <div className={`clubImageDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                        <img
                                                            src={match.awayTeam.logoUrl}
                                                            alt={`${match.awayTeam.clubName} logo`}
                                                            className={`clubLogo-pr ${theme === 'dark' ? 'dark' : 'light'}`}
                                                            onClick={() => window.open(getTeamWebsiteUrl(match.awayTeam.clubName), "_blank")}
                                                            title={getTeamWebsiteUrl(match.awayTeam.clubName)} />
                                                    </div>
                                                    <div className={`clubNameDiv-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                                        {match.awayTeam.clubName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`pointsContainer-pr ${theme === 'dark' ? 'dark' : 'light'}`}>
                                            +{fixturePoints}pts
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Predictor;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocalState } from '../util/useLocalStorage';
import './table.css';

const Table = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [tableData, setTableData] = useState([]);


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

    const fetchTableData = () => {
        fetch('/api/predictor/hnl-table', {
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
                setTableData(data);
                setDataFetched(true);
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    useEffect(() => {
        fetchTableData();
    }, []);


    return dataFetched ? (
        <div className={`body-container-tb ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className={`ajdusting-container-tb ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div className={`table-container-tb ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <div className={`table-data-tb ${theme === 'dark' ? 'dark' : 'light'}`}>
                        <div className={`row-tb ${theme === 'dark' ? 'dark' : 'light'}`}>
                            {tableData.map((row, index) => (
                                <div className={`underline-tb ${theme === 'dark' ? 'dark' : 'light'} 
                                    ${index === 0 ? 'first-child' : ''} 
                                    ${index === tableData.length - 1 ? 'last-child' : ''}`}
                                >
                                    <div className={`table-data-container-tb ${theme === 'dark' ? 'dark' : 'light'}
                                    ${index === 0 ? 'first' : ''} `}
                                        key={index}>
                                        <div style={{ width: '5%', marginRight: '5px', fontWeight: 'bold' }}>{row.position}</div>
                                        <div style={{ width: '25%', fontWeight: 'bold' }}>{row.club}</div>
                                        <div style={{ width: '8.57%' }}>{row.matches}</div>
                                        <div style={{ width: '8.57%' }}>{row.wins}</div>
                                        <div style={{ width: '8.57%' }}>{row.draws}</div>
                                        <div style={{ width: '8.57%' }}>{row.losses}</div>
                                        <div style={{ width: '8.57%' }}>{row.goalsFor}</div>
                                        <div style={{ width: '8.57%' }}>{row.goalsAgainst}</div>
                                        <div style={{ width: '10%' }}>{row.goalDifference}</div>
                                        <div style={{ width: '8.57%', fontWeight: 'bold' }}>{row.points}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default Table;
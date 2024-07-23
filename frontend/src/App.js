import { useEffect, useState } from 'react';
import './App.css';
import { useLocalState } from './util/useLocalStorage';
import { Route, Routes } from 'react-router-dom';
import Predictor from './Predictor';
import Homepage from './Homepage';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import Register from './Register';
import Header from './Header';
import Table from './Table';
import Leaderboards from './Leaderboards';
import SettingsPath from './SettingsFolder';
import Profile from './ProfileFolder';
import Info from './Info';


function App() {

  const [jwt, setJwt] = useLocalState("", "jwt");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");


  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (!theme) {
      localStorage.setItem('theme', 'dark');
    }
  }, []);


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
      <Header />
      <div className={`app-body ${theme === 'dark' ? 'dark' : 'light'}`}>
        <Routes>
          <Route path="predictor" element={
            <PrivateRoute>
              <Predictor />
            </PrivateRoute>
          } />

          <Route path="table" element={
            <PrivateRoute>
              <Table />
            </PrivateRoute>
          } />
          <Route path="leaderboard" element={
            <PrivateRoute>
              <Leaderboards />
            </PrivateRoute>
          } />
          <Route path="info" element={
            <PrivateRoute>
              <Info />
            </PrivateRoute>
          } />
          <Route path="settings" element={
            <PrivateRoute>
              <SettingsPath />
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/" element={<Homepage />} />

        </Routes >
      </div>
    </>
  );
}

export default App;

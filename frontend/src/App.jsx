import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { wakeServer } from './services/api';
import SplashScreen from './components/SplashScreen';

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    wakeServer();
  }, []);

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './Pages/Login/Login';
import TravelLogs from './Pages/TravelLogs';
import JourneyPlans from './Pages/JourneyPlans';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="content">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/travel-logs" /> : 
                <Login 
                  setIsAuthenticated={setIsAuthenticated} 
                  setCurrentUser={setCurrentUser} 
                />
            } 
          />
          <Route 
            path="/travel-logs" 
            element={
              isAuthenticated ? 
                <TravelLogs currentUser={currentUser} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/journey-plans" 
            element={
              isAuthenticated ? 
                <JourneyPlans currentUser={currentUser} /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

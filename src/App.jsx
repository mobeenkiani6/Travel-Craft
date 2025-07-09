import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import { SessionProvider } from './contexts/SessionContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import TripPlan from './pages/TripPlan';
import MyTrips from './pages/MyTrips';
import About from './pages/About';
import Contact from './pages/Contact';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <SessionProvider>
      <AuthProvider>
        <TripProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/plan-trip" element={<PlanTrip />} />
                <Route path="/trip-plan" element={<TripPlan />} />
                <Route path="/my-trips" element={<MyTrips />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <div className="fixed bottom-4 right-4 w-80 z-50">
                <Chatbot />
              </div>
            </div>
          </Router>
        </TripProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default App;
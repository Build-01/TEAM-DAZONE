import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import CreateAccount from './components/CreateAccount';
import DescribeYou from './components/DescribeYou'; 
import TellUsAboutYou from './components/TellUsAboutYou';
import './App.css';
import Dashboard from './components/Dashboard';
import PostGig from './components/PostGig';
import MatchResults from './components/MatchResults';
import ArtisanProfile from './components/ArtisanProfile';
import ConfirmOrder from './components/ConfirmOrder';
import ContractDetails from './components/ContractDetails';
import ChatList from './components/ChatList';
import Messages from './components/Messages';
import Contracts from './components/Contracts'; 
import Payments from './components/Payments';   
import Profile from './components/Profile';     

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              borderRadius: '12px',
              background: 'var(--bg-white)',
              color: 'var(--text-dark)',
              boxShadow: '0 4px 15px rgba(29, 29, 31, 0.1)',
            },
            success: {
              iconTheme: {
                primary: 'var(--primary-green)',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<CreateAccount />} />
          <Route path="/describe-you" element={<DescribeYou />} />
          <Route path="/tell-us-about-you" element={<TellUsAboutYou />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-gig" element={<PostGig />} />
          <Route path="/match-results" element={<MatchResults />} />
          <Route path="/artisan-profile/:id" element={<ArtisanProfile />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/contract/:id" element={<ContractDetails />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
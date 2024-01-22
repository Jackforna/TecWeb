import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Form, InputGroup, FormControl, Button, Image, Dropdown, Card, Row, Col, Modal, CardGroup} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useLocation} from 'react-router-dom';
import './App.css';
import logo from './img/logo.png'
import { Camera, Globe, Link as LinkLogo, PersonCircle, Gear, NodeMinus, Send, CaretDownFill, HouseDoor, Search as SearchLogo, PatchCheckFill} from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import Home from './Home';
import CreateMessage from './CreateMessage';
import Redirector from './Redirector';
import Search from './Search';
import Profile from './Profile';
import Settings from './Settings'

//ogni user è composto da nickname, bio, photoprofile, fullname, email, password, clients, version (normal, verified, professional, SMM, moderator), blocked(booleano), char_d, char_w, char_m : 7000, popularity, notifications[]
//ogni messaggio è composto da sender, typesender, body:{text:'', link:'', photo:'', position:[], video}, photoprofile, date, hour, seconds, pos_reactions, neg_reactions, usersReactions:[{nickname:'', posReaction:0, negReaction:0}], usersViewed:[], category, receivers:[], channel, impressions
//ogni gruppo è composto da creator, photoprofile, name, type, rule, list_mess, silenceable, list_users, list_posts, blocked(booleano, solo se è di tipo channel), description, popularity
//ogni list_mess è composto da un messaggio(con tutte le componenti),type, request, remind:{every, dayMonth, dayWeek, hour}

function App() {
  const [entered, setEntered] = useState(false);

  useEffect(()=>{
    if (JSON.parse(localStorage.getItem('actualUserId'))!=1) {
      setEntered(true);
    }
  },[]);
   
  const goToAccess = () => {
    window.location.href = "http://localhost:8080";
  }

  return (
  <Router>
    <Redirector />
    <div style={{backgroundColor: 'black', height: '100vh', display: 'flex', flexDirection: 'column',}}>
      <div className="d-flex">

        <div style={{width:'20%',position:'absolute', overflow:'hidden'}}>
          {/*Side menu */}
          <Nav className="flex-column bg-dark text-white p-4" style={{height: '100vh',alignItems:'center'}}>
            {/* Spazio vuoto */}
            <div style={{ flex: '0.5' }}></div>

            {/* Logo */}
            <div className="text-center mb-3">
              <Image src={'/squealer-app'+logo} alt="Logo" roundedCircle width="80%" />
            </div>

            {/* Spazio vuoto */}
            <div style={{ flex: '0.2' }}></div>

            {/* Sezione Navigazione */}
            <div style={{minHeight:'240px', width:'80%'}}>
              <Nav.Item className="mb-2 d-flex" style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s'}}>
                <HouseDoor alt="house-door" size="30" className='ms-5 mt-1'/>
                <Link to="/squealer-app/home" className='nav-link text-white' style={{width:'80%'}}>Home</Link>
              </Nav.Item>
              <Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s'}}>
                <SearchLogo alt="search" size="30" className='ms-5 mt-1'/>
                <Link to="/squealer-app/search" className='nav-link text-white' style={{width:'80%'}}>Search</Link>
              </Nav.Item>
              <Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s'}}>
                <PersonCircle alt="person-circle" size="30" className='ms-5 mt-1'/>
                <Link to="/squealer-app/profile" className='nav-link text-white' style={{width:'80%'}}>Profile</Link>
              </Nav.Item>
              <Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s'}}>
                <Gear alt="settings" size="30" className='ms-5 mt-1'/>
                <Link to="/squealer-app/settings" className="nav-link text-white" style={{width:'80%'}}>Settings</Link>
              </Nav.Item>
            </div>

            <div style={{ flex: '0.2' }}></div>

            <Link to="/squealer-app/create-message" className={entered ? '' : 'd-none'} style={{ display: 'flex', justifyContent: 'center'}}>
              <Button>Create Message</Button>
            </Link>

            <Button onClick={goToAccess} className={entered ? 'd-none' : ''} style={{ display: 'flex', justifyContent: 'center'}}>Create Account</Button>
            
            <div style={{ flex: '0.5' }}></div>

          </Nav>
        </div>

          <Routes>  
            <Route path="/squealer-app/home" element={<Home />} />

            <Route path="/squealer-app/create-message" element={<CreateMessage />} />

            <Route path="/squealer-app/search" element={<Search />} />

            <Route path="/squealer-app/profile" element={<Profile />} />

            <Route path="/squealer-app/settings" element={<Settings />} />
          </Routes>
          </div>
      </div>
  </Router>
  );
}

export default App;
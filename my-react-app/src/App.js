import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Button, Image} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import './App.css';
import logo from './img/logo.png'
import {PersonCircle, Gear, HouseDoor, Search as SearchLogo, PlusCircle, PersonPlus} from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import Home from './Home';
import CreateMessage from './CreateMessage';
import Redirector from './Redirector';
import Search from './Search';
import Profile from './Profile';
import Settings from './Settings';
import {getActualUser} from './serverRequests.js';


//ogni user è composto da nickname, bio, photoprofile, fullname, email, password, clients, version (normal, verified, professional, SMM, moderator), blocked(booleano), char_d, char_w, char_m : 7000, popularity, notifications[]
//ogni messaggio è composto da sender, typesender (keywords, channels, Users, CHANNELS), body:{text:'', link:'', photo:'', position:[], video}, photoprofile, date, hour, seconds, pos_reactions, neg_reactions, usersReactions:[{nickname:'', posReaction:0, negReaction:0}], usersViewed:[], answers:[{sender,body:{text:'',photo:'',video:'',link:'',position:[]},photoprofile:'',photoprofileX,photoprofileY,date,hour,seconds}], category, receivers:[], channel, impressions
//ogni gruppo è composto da creator, photoprofile, photoprofileX, photoprofileY, name, type, list_mess, silenceable, list_users, usersSilenced[], list_posts, blocked(booleano, solo se è di tipo channel), description, popularity
//ogni list_mess è composto da un messaggio(con tutte le componenti),type, request, repetition

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

function App() {
  const [entered, setEntered] = useState(false);
  const windowSize = useWindowSize();
  const [actualUserProfile, setActualUserProfile] = useState(null);
  const [photoProfile, setPhotoProfile] = useState('');
  const [nicknameProfile, setNicknameProfile] = useState('');
  const UrlSite = 'http://localhost:8080';
  
  useEffect(()=>{
    if (JSON.parse(localStorage.getItem('actualUserId'))!=1) {
      setEntered(true);
    }
  },[]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getActualUser(); // Assuming this function returns the logged-in user data
        setActualUserProfile(userData);
        setPhotoProfile(userData.photoprofile);
        setNicknameProfile(userData.nickname);
        console.log('User data:', userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);
  

  const goToAccess = () => {
    window.location.href = UrlSite;
  }

  return (
  <Router>
    <Redirector />
    <div style={{backgroundColor: '#eee', color: '#000000DE', height: '100vh', display: 'flex', flexDirection: 'column'}}>

          <Routes>  
            <Route path="/squealer-app/home" element={<Home />} />

            <Route path="/squealer-app/create-message" element={<CreateMessage />} />

            <Route path="/squealer-app/search" element={<Search />} />

            <Route path="/squealer-app/profile" element={<Profile />} />

            <Route path="/squealer-app/settings" element={<Settings />} />
          </Routes>

          <Nav className="d-flex flex-column bg-white text-black" style={{width: windowSize >= 1024 ? '20%' : windowSize >= 600 ? '10%' : '100%',position:'absolute', top:windowSize >= 600 ? '0' : '90%', height: windowSize >= 600 ? '100vh' : '10%', overflow:'hidden', zIndex:'1005', alignItems:'center'}}>
            <div style={{ flex: '0.2' }}></div>

            {windowSize >= 1024 && (<div className="text-center mb-3">
              <Image src={logo} alt="Logo" roundedCircle width="80%" />
            </div>)}


            <div style={{ flex: windowSize >= 1024 ? '0.2' : windowSize >= 768 ? '0.3' : '0.0' }}></div>
            
            {windowSize >= 768 && (<div style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              {photoProfile !== '' ? (
                        <div className="profile-image-container"
                          style = {
                            {
                              width: windowSize >= 1024 ? '100px' : windowSize >= 768 ? '60px' : '0', 
                              height: windowSize >= 1024 ? '100px' : windowSize >= 768 ? '60px' : '0', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                              border: '2px solid white',
                              overflow: 'hidden',
                            }
                          }>
                          <img src={photoProfile} alt="Profile" className="profile-image"/>
                        </div>
                      ) : (
                        <PersonCircle size='100' color='white' />
              )}
              {windowSize >= 1024 && (<div className="text-center">
                <h7>{nicknameProfile}</h7>
              </div>)}
            </div>)}

            <div style={{ flex: '0.1' }}></div>

            {entered && (<div className={windowSize >= 600 ? 'd-flex flex-column' : 'd-flex flex-row'} style={{alignItems:'center', justifyContent:'space-around', flex: windowSize >= 1024 ? '0' : '1', width:'100%'}}>
              <Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                <Link to="/squealer-app/home"><HouseDoor alt="house-door" size="25" className='mt-2' style={{color: '#000000DE'}}/></Link>
                {windowSize >= 1024 && (<Link to="/squealer-app/home" className='nav-link' style={{color: '#000000DE'}}>Home</Link>)}
              </Nav.Item>
              <Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                <Link to="/squealer-app/search"><SearchLogo alt="search" size="25" className='mt-2' style={{color: '#000000DE'}}/></Link>
                {windowSize >= 1024 && (<Link to="/squealer-app/search" className='nav-link' style={{color: '#000000DE'}}>Search</Link>)}
              </Nav.Item>
              {windowSize < 1024 && (<Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                <Link to="/squealer-app/create-message"><PlusCircle alt="message" size="25" className='mt-2' style={{color: '#000000DE'}}/></Link>
              </Nav.Item>)}
              <Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                <Link to="/squealer-app/profile"><PersonCircle alt="person-circle" size="25" className='mt-2' style={{color: '#000000DE'}}/></Link>
                {windowSize >= 1024 && (<Link to="/squealer-app/profile" className='nav-link' style={{color: '#000000DE'}}>Profile</Link>)}
              </Nav.Item>
              <Nav.Item className={entered ? 'mb-2 d-flex' : 'd-none'} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                <Link to="/squealer-app/settings"><Gear alt="settings" size="25" className='mt-2' style={{color: '#000000DE'}}/></Link>
                {windowSize >= 1024 && (<Link to="/squealer-app/settings" className="nav-link" style={{color: '#000000DE'}}>Settings</Link>)}
              </Nav.Item>
            </div>)}
            {!entered && (<div className={windowSize >= 600 ? 'd-flex flex-column' : 'd-flex flex-row'} style={{alignItems:'center', justifyContent:'space-around', flex: windowSize >= 1024 ? '0' : '1', width:'100%'}}>
              <Nav.Item className="mb-2 d-flex" style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                <Link to="/squealer-app/home"><HouseDoor alt="house-door" size="25" className='mt-2 text-white'/></Link>
                {windowSize >= 1024 && (<Link to="/squealer-app/home" className='nav-link'>Home</Link>)}
              </Nav.Item>
              {windowSize < 1024 && (<Nav.Item className='mb-2 d-flex' style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                <Button onClick={goToAccess} style={{ display: 'flex', justifyContent: 'center', backgroundColor:'transparent', border:'0'}}><PersonPlus alt="access" size="25" className='mt-1 text-white'/></Button>
              </Nav.Item>)}
            </div>)}

            <div style={{ flex: '0.2' }}></div>

            {windowSize >= 1024 && (<Link to="/squealer-app/create-message" className={entered ? '' : 'd-none'} style={{ display: 'flex', justifyContent: 'center'}}>
              <Button id = "buttonSend">Create Message</Button>
            </Link>)}

            {windowSize >= 1024 && (<Button onClick={goToAccess} id = "buttonSend" className={entered ? 'd-none' : ''} style={{ display: 'flex', justifyContent: 'center'}}>Create Account</Button>)}
            
            <div style={{ flex: '0.5' }}></div>

          </Nav>

      </div>
  </Router>
  );
}

export default App;
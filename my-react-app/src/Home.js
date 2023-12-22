import React, { useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Form, InputGroup, FormControl, Button, Image, Dropdown, Card, Row, Col, Modal, CardGroup} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useLocation} from 'react-router-dom';
import './App.css';
import search_logo from './img/search.png'
import pos_reaction1 from './img/reaction_positive1.png'
import pos_reaction2 from './img/reaction_positive2.png'
import pos_reaction3 from './img/reaction_positive3.png'
import neg_reaction1 from './img/reaction_negative1.png'
import neg_reaction2 from './img/reaction_negative2.png'
import neg_reaction3 from './img/reaction_negative3.png'
import channel_profile from './img/channel_profile.png';
import { Camera, Globe, Link as LinkLogo, PersonCircle, Gear, NodeMinus, Send, CaretDownFill, HouseDoor, Search as SearchLogo, PatchCheckFill} from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {getUsers, getListChannels, getUserById, getListSqueals, getActualUser, updateUsers, updateChannels, updateSqueals, addUser, addSqueal, addChannel} from './serverRequests.js';

function Home(){
  const location = useLocation();
  const [showIcon, setShowIcon] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestedProfiles, setSuggestedProfiles] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [actualuser, setactualuser] = useState()
  const [allUsers, setAllUsers] = useState([]);
  const [allSqueals, setallSqueals] = useState([]);
  const [allSquealsprint,setallSquealsprint] = useState([]);
  const [squealpos_reaction, setsquealpos_reaction] = useState([0,0,0]) //l'array deve essere lungo quanti sono i messaggi, serve per tenere traccia della reazione positiva che ha messo l'utente a tutti i messaggi
  const [squealneg_reaction, setsquealneg_reaction] = useState([0,0,0]) //l'array deve essere lungo quanti sono i messaggi, serve per tenere traccia della reazione negativa che ha messo l'utente a tutti i messaggi
  const [showbtnopacity, setshowbtnopacity] = useState(false);
  const [inputSearch, setinputSearch] = useState("");
  const [clientinputSearch, setclientinputSearch] = useState("");
  const markerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
  });


    
  useEffect(() => {
    if(location.pathname.endsWith('/home')){
        async function getAll1(){
            try{
                const users = await getUsers();
                setAllUsers(users);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }
          async function getAll2(){
            try{
                const user = await getActualUser();
                setactualuser(user);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }
          async function getAll3(){
            try{
                const squeals = await getListSqueals();
                setallSqueals(squeals);
                
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }  
        getAll1();
        getAll2();
        getAll3();
    }
},[location.pathname]);

useEffect(()=>{
    let squealsReceived = [];
        for(let i=0; i<allSqueals.length;i++){
            for(let j=0; j<allSqueals[i].receivers.length; j++){
                if(allSqueals[i].receivers[j]==="@"+actualuser.nickname){
                    squealsReceived.push(allSqueals[i]);
                }
            }
        }
    setallSquealsprint(squealsReceived);
    setallSqueals(squealsReceived);
}, [actualuser, allSqueals]);

const handleFocus = () => {
    setShowIcon(false);
    setIsSuggestionsVisible(true);
    setshowbtnopacity(true);
    setinputSearch("");
    setSuggestedProfiles([]);
  };

  const handleBlur = () => {
      setclientinputSearch("");
      setShowIcon(true);
      setIsSuggestionsVisible(false);
      setshowbtnopacity(false);
  };

  const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
      const selectedIndex = selectedItems.indexOf(item);
      let updatedItems = [...selectedItems];
      setinputSearch();
      setIsDropdownOpen(true);

      if (selectedIndex === -1) {
          updatedItems.push(item);
      } else {
          updatedItems = updatedItems.filter((selectedItem) => selectedItem !== item);
      }
      const filterSquealprint = ([]);
      setSelectedItems(updatedItems);
      if(updatedItems.length!=0){
        for(let i=0;i<updatedItems.length;i++){
          for(let j=0;j<allSqueals.length;j++)
          if(updatedItems[i]==allSqueals[j].typesender){
            filterSquealprint.push(allSqueals[j]);
          }
        }
        setallSquealsprint(filterSquealprint);
      } else {
        setallSquealsprint([...allSqueals]);
      }
  };

  const handleItemSelect = (item) => {         //funzione per l'inserimento di un nome per filtrare i messaggi nella home
    setclientinputSearch("");
    setinputSearch(item);
    let filterSquealprint;
    if(selectedItems.length==0){
      filterSquealprint = allSqueals.filter(squeal => squeal.sender==item);
    } else {
      for(let i=0;i<selectedItems.length;i++){
        filterSquealprint = allSqueals.filter(squeal => (squeal.sender==item)&(squeal.typesender==selectedItems));
      }
    }
    setallSquealsprint(filterSquealprint);
    setIsSuggestionsVisible(false);
    setShowIcon(true);
    setshowbtnopacity(false);
  };

  const writeinputSearch = (event) => {                                  //selezione della ricerca 
    setSuggestedProfiles([]);
    const value = event.target.value;
    setclientinputSearch(value);
    if(value!=""){
      for(let i=0;i<allUsers.length;i++){
        let user = ((allUsers[i].nickname).slice(0,value.length)).toLowerCase();
            if(value.toLowerCase()==user){
                setSuggestedProfiles(prevallUsers => [...prevallUsers,allUsers[i].nickname]);
            }
      }
    } else {
      setSuggestedProfiles([]);
    }
  };

  const reactionSqueal = (indexSqueal,x) => {            //funzione per mettere una reazione a un messaggio
    const newallSqueals = [...allSqueals];
    const newsquealpos_reaction = [...squealpos_reaction];
    const newsquealneg_reaction = [...squealneg_reaction];
    if(x<4){
      if((squealpos_reaction!=0)|(squealneg_reaction!=0)){
        newallSqueals[indexSqueal].pos_reactions += x;
        newallSqueals[indexSqueal].pos_reactions -= squealpos_reaction[indexSqueal];
        newallSqueals[indexSqueal].neg_reactions -= squealneg_reaction[indexSqueal];
        newsquealneg_reaction[indexSqueal] = 0;
      }
      newsquealpos_reaction[indexSqueal] = x;
    } else {
      x-= 3;
      if((squealpos_reaction!=0)|(squealneg_reaction!=0)){
        newallSqueals[indexSqueal].neg_reactions += x;
        newallSqueals[indexSqueal].pos_reactions -= squealpos_reaction[indexSqueal];
        newallSqueals[indexSqueal].neg_reactions -= squealneg_reaction[indexSqueal];
        newsquealpos_reaction[indexSqueal] = 0;
      }
      newsquealneg_reaction[indexSqueal] = x;
    }
    setallSqueals(newallSqueals);
    setsquealneg_reaction(newsquealneg_reaction);
    setsquealpos_reaction(newsquealpos_reaction);
  };

    return(
        <Container
                style={{
                  width: '80%',
                  left:'20%',
                  height: '100vh',
                  position:'absolute',
                  alignItems: 'center',
                  overflow:'hidden'
                }}
                className="mx-auto d-flex flex-column"
              >
              <div style={{position:'relative', marginTop:'13%', height:'100%', overflowY:'scroll'}}>
                  {allSquealsprint.map((squeal,index) => (
                    <Card key={index} style={{backgroundColor:'black', color:'white', borderColor:'white', width:'500px', minHeight:'200px', marginBottom:'5%'}}>
                    <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                      <CardGroup>
                        {squeal.typesender=='Users' ?
                          ( squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={squeal.photoprofile} style={{height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                            </div>)
                            : (<PersonCircle size='30' color='white' className='me-3'></PersonCircle>)
                          )
                          :
                          ( squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={squeal.photoprofile} style={{height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                            </div>)
                            : (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={'/squealer-app'+channel_profile} style={{width:'100%', mixBlendMode:'screen'}}></Image></div>)
                          )
                        }
                        {((squeal.typesender=='channels')|(squeal.typesender=='CHANNELS')) ?
                        (squeal.sender+" from "+squeal.channel)
                        :
                        (squeal.sender)
                      }
                        
                      </CardGroup>
                      <Card.Text>{squeal.date+" "+squeal.hour}</Card.Text>
                    </Card.Header>
                    <Card.Body>
                    <Card.Text style={{textAlign:'left'}}>
                                    {squeal.body.text}
                                </Card.Text>
                                {squeal.body.photo!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" && (
                              <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                <img src={squeal.body.photo} alt="squeal photo" width="100%" />
                              </div>
                            )} 
                            {squeal.body.position.length!=0 &&(
                                <Card style={{ width: '70%', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
                                    <MapContainer center={squeal.body.position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                                            <Marker position={squeal.body.position} icon={markerIcon}>
                                                <Popup>Sei qui!</Popup>
                                            </Marker>
                                    </MapContainer>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                                        <Button variant="light" onClick={() => {const url = `https://www.google.com/maps/search/?api=1&query=${squeal.body.position[0]},${squeal.body.position[1]}`; window.open(url, '_blank');}}>Open Map</Button>
                                    </div>
                                </Card>
                            )}
                            {squeal.body.link!='' && (
                                <div style={{ marginTop: '10px', wordBreak: 'break-all', width:'100%', display:'flex', alignItems:'center', justifyContent:'left'}}>
                                    <a href={squeal.body.link} target="_blank" rel="noreferrer">{squeal.body.link}</a>
                                </div>
                            )}
                    </Card.Body>
                    <Card.Footer className='d-flex' style={{justifyContent:'space-between'}}>
                      <Link to="/create-message" className="text-white"><Send style={{cursor:'pointer'}}></Send></Link>
                      <div className='d-flex'>
                        <Card.Text className='me-1'>
                          {squeal.pos_reactions}
                        </Card.Text>
                        <Image src={'/squealer-app'+pos_reaction1} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,1)}></Image>
                        <Image src={'/squealer-app'+pos_reaction2} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,2)}></Image>
                        <Image src={'/squealer-app'+pos_reaction3} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,3)}></Image>
                        <Card.Text style={{marginLeft:'17px'}} className='me-1'>
                          {squeal.neg_reactions}
                        </Card.Text>
                        <Image src={'/squealer-app'+neg_reaction1} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,4)}></Image>
                        <Image src={'/squealer-app'+neg_reaction2} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,5)}></Image>
                        <Image src={'/squealer-app'+neg_reaction3} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,6)}></Image>
                      </div>
                    </Card.Footer>
                  </Card>
                  ))}
              </div>
              <button
                style={{width:'100%',height:'100%', opacity:'0.7', position:'absolute', border:'none', backgroundColor:'black'}}
                className={`${showbtnopacity ? '' : 'd-none'}`}
                onClick={handleBlur}
              >
              </button>

              <Form className="d-flex flex-column" style={{position:'absolute', top:'5%'}}>
                <InputGroup style={{ width: '500px'}} className="d-flex flex-column">
                    <FormControl
                      type="text"
                      placeholder={inputSearch}
                      value={clientinputSearch}
                      variant="outline-success"
                      className="formcontroll-inputSearch"
                      style={{
                        boxShadow: 'none',
                        borderRadius: '14px',
                        borderColor: 'white',
                        backgroundColor: 'transparent',
                        backgroundImage: showIcon ? `url(${search_logo})` : 'none',
                        backgroundSize: '20px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '10px center',
                        paddingLeft: showIcon ? '40px' : '20px',
                        paddingRight: '160px',
                        color: 'white',
                        width: '100%',
                      }}
                      onFocus={handleFocus}
                      onChange={writeinputSearch}
                    />
                      <Button 
                        id="dropdown-button-dark-example1" 
                        variant="secondary"
                        style={{
                          boxShadow: 'none',
                          borderRadius: '14px',
                          width: '150px',
                          backgroundColor: 'blueviolet',
                          color: 'white',
                          position: 'absolute',
                          left: '351px',
                          cursor:'pointer',
                        }}
                        onClick={toggleDropdown}
                      >Filter
                      <CaretDownFill size='12' style={{marginLeft:'10px'}}></CaretDownFill>
                      </Button>
                    
                      <div className='d-flex' width='500px'>
                        {suggestedProfiles.length > 0 && isSuggestionsVisible == true && (
                        <div className="suggested-profiles-container" style={{borderRadius:'14px',marginRight:'-350px'}}>
                          <ul style={{paddingLeft:'0'}}>
                            {suggestedProfiles.map((profile, index) => (
                              <li key={index} onClick={() => handleItemSelect(profile)} style={{listStyle:'none',textAlign:'center',cursor:'pointer'}}>
                                {profile}
                              </li>
                            ))}
                          </ul>
                        </div>
                        )}
                        <ul
                          style={{
                            boxShadow: 'none',
                            borderRadius: '14px',
                            width: '150px',
                            height: '130px',
                            marginLeft:'350px',
                            backgroundColor: 'blueviolet',
                            color: 'white',
                            position:'relative',
                            padding:'0',
                            paddingTop:'12px',
                            textAlign:'center',
                          }}
                          className={`${isDropdownOpen ? '' : 'd-none'}`}
                        >
                          <li
                              onClick={() => handleItemClick('Users')}
                              className={`${selectedItems.includes('Users') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              Users
                            </li>
                            <li
                              onClick={() => handleItemClick('channels')}
                              className={`${selectedItems.includes('channels') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              channels
                            </li>
                            <li
                              onClick={() => handleItemClick('CHANNELS')}
                              className={`${selectedItems.includes('CHANNELS') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              CHANNELS
                            </li>
                            <li
                              onClick={() => handleItemClick('keyword')}
                              className={`${selectedItems.includes('keyword') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              keyword
                            </li>
                        </ul>
                      </div>
                </InputGroup>
              </Form> 
              </Container>
    )
}

export default Home;
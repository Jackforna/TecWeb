import React, { useState, useEffect} from 'react';
import { Container, Nav, InputGroup, FormControl, Button, Card, Row} from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './App.css';
import search_logo from '../src/img/search.png'
import {XCircle, List, PersonFillUp, Bag, Bell, PatchCheckFill } from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import {getUsers, getListChannels, getUserById, getListSqueals, getActualUser, updateUsers, updateChannels, updateSqueals, addUser, addSqueal, addChannel} from './serverRequests.js';

function Settings() {
    const [actualuser, setactualuser] = useState({nickname:"Mario", bio:'', photoprofile:'', photoprofileX:0, photoprofileY:0, fullname:'', email:'', password:'', version:"normal", clients:[], smm:'', blocked:false, char_d:400, char_w:2500, char_m: 9000, notifications:[false, true, true, false, true]})
    const [openBar, setOpenBar] = useState(true);
    const location = useLocation();
    const [isNotifications, setIsNotifications] = useState(true);
    const [isAccount, setIsAccount] = useState(false);
    const [isCharacters, setIsCharacters] = useState(false);
    const [isFindSMM, setIsFindSMM] = useState(false);
    const [allUsers, setAllUsers] = useState([{nickname:"Mario", bio:"", photoprofile:'', photoprofileX:0, photoprofileY:0, fullname:'', email:'', password:'', version:"SMM", clients:[], smm:'', blocked:false, char_d:400, char_w:2500, char_m: 9000}, {nickname:"Marco", bio:'', photoprofile:'', photoprofileX:0, photoprofileY:0, fullname:'', email:'', cell:'', password:'', version:"SMM", clients:[], smm:'', blocked:false, char_d:400, char_w:2500, char_m: 9000}, {nickname:"Maria", bio:'', photoprofile:'', fullname:'', email:'', cell:'', password:'', version:"SMM", clients:[], smm:'', blocked:false, char_d:400, char_w:2500, char_m: 9000}, {nickname:"Marta", bio:'', photoprofile:'', fullname:'', email:'', cell:'', password:'', version:"normal", clients:[], smm:'', blocked:false, char_d:400, char_w:2500, char_m: 9000}, {nickname:"Martina", bio:'', photoprofile:'', fullname:'', email:'', cell:'', password:'', version:"normal", clients:[], smm:'', blocked:false, char_d:400, char_w:2500, char_m: 9000}]);
    const [showIcon, setShowIcon] = useState(true);
    const [allSqueals, setallSqueals] = useState([{sender:'Mario', photoprofile:'', photoprofileX:0, photoprofileY:0, typesender:'Users', channel:'', body:{text:'Ciao Marta', position:[], photo:'', link:''}, date:'26/10/2023', hour:'17:37', seconds:'27', pos_reactions:0, neg_reactions:0, receivers:['Marta'], category:null},{sender:'Mario', photoprofile:'', photoprofileX:0, photoprofileY:0, typesender:'channels', channel:'uni_fuoricorso', body:{text:'Ciao Marta', position:[], photo:'', link:''}, date:'26/10/2023', hour:'17:37', seconds:'27', pos_reactions:0, neg_reactions:0, receivers:['Marta'], category:null},{sender:'Mario', photoprofile:'', photoprofileX:0, photoprofileY:0, typesender:'Users', channel:'', body:{text:'Ciao Marta', position:[], photo:'', link:''}, date:'26/10/2023', hour:'17:37', seconds:'27', pos_reactions:0, neg_reactions:0, receivers:['Marta'], category:null}]);
    const [allPrint, setAllPrint] = useState([]);
    const [clientInputSearch, setClientInputSearch] = useState("");
    const [confirmBuyProfessional, setConfirmBuyProfessional] = useState(false);
    const [confirmBuyCharacters, setConfirmBuyCharacters] = useState(false);
    const [optionCharacters, setOptionCharacters] = useState(0);

    useEffect(() => {
        if (location.pathname.endsWith('/settings')) {
            const users = getUsers();
            setAllUsers(users);
            const user = getActualUser();
            setactualuser(user);
            const squeals = getListSqueals();
            setallSqueals(squeals);
        }
    },[location.pathname]);

    const openNotifications = () => {
        setIsNotifications(true);
        setIsAccount(false);
        setIsCharacters(false);
    };

    const openAccount = () => {
        setIsNotifications(false);
        setIsAccount(true);
        setIsCharacters(false);
    };

    const openCharacters = () => {
        setIsNotifications(false);
        setIsAccount(false);
        setIsCharacters(true);
    };

    const gotoDashboard = () => {                       //fare, entrare nelle dashboard
        if(actualuser.version=="SMM"){
            window.location.href = "/SMMDashboard";
        } else {
            window.location.href = "/ModeratorDashboard";
        }
    };

    const requestVerified = () => {
        let actualdate = new Date();
        let newdate = actualdate.getDate() +"/"+ actualdate.getMonth()+1 +"/"+ actualdate.getFullYear();
        let newhour = actualdate.getHours() +"/"+ actualdate.getMinutes();
        let newseconds = actualdate.getSeconds();
        let newsqueal = {sender:actualuser.nickname, photoprofile: actualuser.photoprofile, photoprofileX:actualuser.photoprofileX, photoprofileY:actualuser.photoprofileY, typesender:'Users', channel:'Request verified', body:{text:'Request verified', position:[], photo:'', link:''}, date: newdate, hour: newhour, seconds: newseconds, pos_reactions:0, neg_reactions:0, receivers:['Giacomo Fornaciari', 'Gabriel Betti'], category:''}
        setallSqueals([...allSqueals, newsqueal]);
        //salvare allSqueals
    };

    const requestSMM = () => {
        let actualdate = new Date();
        let newdate = actualdate.getDate() +"/"+ actualdate.getMonth()+1 +"/"+ actualdate.getFullYear();
        let newhour = actualdate.getHours() +"/"+ actualdate.getMinutes();
        let newseconds = actualdate.getSeconds();
        let newsqueal = {sender:actualuser.nickname, photoprofile: actualuser.photoprofile, photoprofileX:actualuser.photoprofileX, photoprofileY:actualuser.photoprofileY, typesender:'Users', channel:'Request SMM', body:{text:'Request SMM', position:[], photo:'', link:''}, date: newdate, hour: newhour, seconds: newseconds, pos_reactions:0, neg_reactions:0, receivers:['Giacomo Fornaciari', 'Gabriel Betti'], category:''}
        setallSqueals([...allSqueals, newsqueal]);
        //salvare allSqueals
    };

    const findSMM = () => {
        if(actualuser.version!='SMM'){
            setIsFindSMM(!isFindSMM);
            setClientInputSearch('');
            setAllPrint([]);
        } else {
            alert('You can\'t have a Social Media Manager if you\'re one of them');
        }
    };

    const buyProfessional = () => {
        setConfirmBuyProfessional(true);
    };

    const buyProfessionalConfirm = (confirm) => {
        if(confirm){
            setactualuser({...actualuser, version:'professional'});
            const updatedUsers = allUsers.map((obj) => {
                if (obj.nickname === actualuser.nickname) {
                    
                  return {
                    ...obj,
                    version: 'professional',
                  };
                }
                return obj;
              });
              alert("Your payment was successfull. You've now access to the professional actions");
              setAllUsers(updatedUsers);
        }
        setConfirmBuyProfessional(false);
        //salvare allUsers
    }
    
    const handleBlur = () => {
        setShowIcon(true);
    };

    const handleFocus = () => {
        setShowIcon(false);
    };

    const writeinputSearch = (event) => {
        setAllPrint([]);
        const value = event.target.value;
        setClientInputSearch(value);
        if(value!=""){
            for(let i=0;i<allUsers.length;i++){
                let user = ((allUsers[i].nickname).slice(0,value.length)).toLowerCase();
                    if((value.toLowerCase()==user)&(allUsers[i].version=='SMM')&(actualuser.smm!=allUsers[i].nickname)){
                        setAllPrint(prevallUsers => [...prevallUsers, allUsers[i].nickname]);
                    }
            }
        } else {
        setAllPrint([]);
    }
    };

    const handleItemSelect = (item) => {
        setIsFindSMM(!isFindSMM);
        setClientInputSearch('');
        setAllPrint([]);
        const updatedUsers = allUsers.map((obj) => {
            if (obj.nickname === item) {
                
              return {
                ...obj,
                clients: [...obj.clients, actualuser.nickname],
              };
            }
            return obj;
          });
          setactualuser({...actualuser, smm:item});
          alert("You select your new SMM "+item);
      
          setAllUsers(updatedUsers);
          //salvare allUsers
    }

    const changenotification = (x) => {
        const newnotifications = [...actualuser.notifications];
        newnotifications[x] = !newnotifications[x];
        setactualuser({...actualuser, notifications:newnotifications});
        const updatedUsers = allUsers.map((obj) => {
            if (obj.nickname === actualuser.nickname) {
                
              return {
                ...obj,
                notifications: [newnotifications],
              };
            }
            return obj;
          });
          alert("You've changed your notifications");
          setAllUsers(updatedUsers);
          //salvare allUsers
    }

    const morecharacter = (x) => {
        setConfirmBuyCharacters(true);
        setOptionCharacters(x);
    }

    const buyCharactersConfirm = (confirm) => {
        if(confirm){
            if(optionCharacters==1){
                setactualuser({...actualuser, char_d:actualuser.char_d + 300, char_w: actualuser.char_w + 2000, char_m: actualuser.char_m + 7000});
                const updatedUsers = allUsers.map((obj) => {
                    if (obj.nickname === actualuser.nickname) {
                        
                    return {
                        ...obj,
                        char_d:actualuser.char_d + 300, char_w: actualuser.char_w + 2000, char_m: actualuser.char_m + 7000
                    };
                    }
                    return obj;
                });
                alert("Your payment was successfull. You've now access to the professional actions");
                setAllUsers(updatedUsers);
            } else if(optionCharacters==2){
                setactualuser({...actualuser, char_d:actualuser.char_d + 700, char_w: actualuser.char_w + 4500, char_m: actualuser.char_m + 16000});
                const updatedUsers = allUsers.map((obj) => {
                    if (obj.nickname === actualuser.nickname) {
                        
                    return {
                        ...obj,
                        char_d:actualuser.char_d + 700, char_w: actualuser.char_w + 4500, char_m: actualuser.char_m + 16000
                    };
                    }
                    return obj;
                });
                alert("Your payment was successfull. You've now more characters to use this month");
                setAllUsers(updatedUsers);
            }
        }
        setConfirmBuyCharacters(false);
        //salvare allUsers
    }

    return (
        <>
            <Container style={{ width: '20%', left:'0', height: '100vh', position:'absolute', alignItems: 'center', overflowY:'scroll'}} className={`${openBar ? "mx-auto d-flex flex-column bg-dark" : "d-none"}`}>
                <Nav className="flex-column bg-dark text-white p-4" style={{height: '100vh', justifyContent:'center'}}>
                    <Nav.Item className="mb-2 d-flex" style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s'}}>
                        <Bell alt="house-door" color='white' size="30" className='ms-4 mt-1'/>
                        <p onClick={openNotifications} className='nav-link text-white' style={{width:'80%', marginBottom:'0'}}>Notifications</p>
                    </Nav.Item>
                    <Nav.Item className="mb-2 d-flex" style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s'}}>
                        <PersonFillUp alt="search" color='white' size="30" className='ms-4 mt-1'/>
                        <p onClick={openAccount} className='nav-link text-white' style={{width:'80%', marginBottom:'0'}}>Account</p>
                    </Nav.Item>
                    <Nav.Item className="mb-2 d-flex" style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s'}}>
                        <Bag alt="person-circle" color='white' size="30" className='ms-4 mt-1'/>
                        <p onClick={openCharacters} className='nav-link text-white' style={{width:'80%', marginBottom:'0'}}>Characters</p>
                    </Nav.Item>
                    <div style={{ flex: '0.2' }}></div>
                    <Button onClick={gotoDashboard} className={`${actualuser.version=='normal' | actualuser.version=='professional' ? "d-none" : ""}`}>{actualuser.version=='SMM' ? 'SMM Dashboard' : 'Moderator Dashboard'}</Button>
                </Nav>
            </Container>
            <Container style={{ width: '80%', left:'20%', height: '100vh', position:'absolute', alignItems: 'center', overflowY:'scroll'}}>
                <XCircle style={{position:'absolute', left:'10px', top:'10px', width:'30px', height:'30px', cursor:'pointer'}} color='white' className={`${openBar ? "" : "d-none"}`} onClick={() => {setOpenBar(!openBar)}}></XCircle>
                <List style={{position:'absolute', left:'10px', top:'10px', width:'30px', height:'30px', cursor:'pointer'}} color='white' className={`${openBar ? "d-none" : ""}`} onClick={() => {setOpenBar(!openBar)}}></List>

                <Container className={isNotifications ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center'}}>
                    <h3 style={{color:'white'}} className='m-3'>Decide when and how receiving notifications</h3>
                    <p style={{color:'white'}} className='m-3 mb-5'>Select the push notifications that you want receive</p>
                    <label className="switch d-flex flex-row mb-3" style={{width:'50%', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[0]} onChange={() => changenotification(0)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{color:'white', width:'50%', marginLeft:'70px'}}>My channels squeals</p>
                    </label>
                    <label className="switch d-flex flex-row mb-3" style={{width:'50%', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[1]} onChange={() => changenotification(1)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{color:'white', width:'50%', marginLeft:'70px'}}>My CHANNELS squeal</p>
                    </label>
                    <label className="switch d-flex flex-row mb-3" style={{width:'50%', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[2]} onChange={() => changenotification(2)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{color:'white', width:'50%', marginLeft:'70px'}}>For you squeals</p>
                    </label>
                    <label className="switch d-flex flex-row mb-3" style={{width:'50%', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[3]} onChange={() => changenotification(3)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{color:'white', width:'50%', marginLeft:'70px'}}>Personal squeals</p>
                    </label>
                    <label className="switch d-flex flex-row mb-3" style={{width:'50%', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[4]} onChange={() => changenotification(4)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{color:'white', width:'50%', marginLeft:'70px'}}>Comments to my squeals</p>
                    </label>
                </Container>
                <Container className={isAccount ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', overflowY:'scroll', height:'100%'}}>
                    <div className={actualuser.version=='normal' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{color:'white'}} className='m-3'>Request to be verified</h4>
                        <p style={{color:'white', width:'70%', textAlign:'center'}} className='m-3'>You'll send a message to the Squealer moderators requesting to switch to a verified account. This will allow you to be more recognizable among users</p>
                        <Button className='m-3' onClick={requestVerified}>Request</Button>
                        <hr style={{color:'white', width:'100%', height:'2px'}}></hr>
                    </div>
                    <div className={actualuser.version!='SMM' & actualuser.version=='professional' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{color:'white'}} className='m-3'>Request to be Social Media Manager</h4>
                        <p style={{color:'white', width:'70%', textAlign:'center'}} className='m-3'>You'll send a message to the Squealer moderators requesting to switch to a Social Media Manager account. This will allow you to be the account manager for your professional clients. You'll also have your personal access to the SMM Dashboard with the your clients data</p>
                        <Button onClick={requestSMM} className='m-3'>Request</Button>
                        <hr style={{color:'white', width:'100%', height:'2px'}}></hr>
                    </div>
                    <div className={actualuser.version=='professional' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{color:'white'}} className='m-3'>Find a Social Media Manager</h4>
                        <p style={{color:'white', width:'70%', textAlign:'center'}} className='m-3'>You can decide a person that can manage and modify your account for you! You can remove this person from your account whenever you want</p>
                        <div className={isFindSMM ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center'}}>
                            <InputGroup style={{ width: '500px'}} className="d-flex flex-column">
                                <FormControl type="text" 
                                value={clientInputSearch}
                                placeholder='Search Social Media Manager'
                                variant="outline-success"
                                className="formcontroll-inputSearchlight"
                                style={{boxShadow: 'none', borderRadius: '14px', borderColor: 'white', backgroundColor: 'transparent',backgroundImage: showIcon ? `url(${search_logo})` : 'none', backgroundSize: '20px', backgroundRepeat: 'no-repeat', backgroundPosition: '10px center', paddingLeft: showIcon ? '40px' : '20px', paddingRight: '160px', color: 'white', width: '100%',}}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={writeinputSearch}
                                />
                            </InputGroup>
                            {allPrint.length > 0 && (
                                <div style={{marginTop:'9%', color:'white', fontSize:'large', overflowX:'hidden', overflowY:'scroll',}}>
                                <ul style={{paddingLeft:'0'}}>
                                    {allPrint.map((profile, index) => (
                                    <li key={index} className='mb-3 d-flex flex-row' style={{listStyle:'none',cursor:'pointer', width:'300px', borderRadius:'12px', paddingTop:'0.6em', paddingBottom:'0.6em', alignItems:'center'}}>
                                        <p style={{width:'70%', marginBottom:'0'}}>{profile}<PatchCheckFill className='ms-2' color='cornflowerblue'></PatchCheckFill></p>
                                        <Button className='ms-3' onClick={() => handleItemSelect(profile)}>Select</Button>
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            )} 

                        </div>
                        <Button onClick={findSMM} className='m-3'>{isFindSMM ? 'Close' : 'Find'}</Button>
                        <hr style={{color:'white', width:'100%', height:'2px'}}></hr>
                    </div>
                    <div className={actualuser.version=='normal' | actualuser.version=='verified' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{color:'white'}} className='m-3'>Buy a professional account</h4>
                        <p style={{color:'white', width:'70%', textAlign:'center'}} className='m-3'>For 11.99$ a month, you can buy a professional account. With a professional account you can become a social media manager or decide on a social media manager who can manage your profile. Additionally, your account will be verified if it isn't already and you receive <b>300</b> more characters for day, <b>2000</b> more characters for week and <b>7000</b> more characters for month</p>
                        <Button onClick={buyProfessional} className='m-3'>Buy</Button>
                    </div>

                </Container>
                <Container className={isCharacters ? 'd-flex flex-row' : 'd-none'} style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                    <Card style={{position: 'relative', width: '30%', margin: '4%', height:'50%', background: 'linear-gradient(40deg,#539bdb,#8983f7 70%)', textAlign: 'center', justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column', borderRadius: '12px'}}>
                        <Card.Body style={{flex:'0 1 auto'}}>
                            <h3 className='mb-4' style={{cursor:'default'}}>First option</h3>
                            <p style={{cursor:'default'}}>300 more characters for day</p>
                            <p style={{cursor:'default'}}>2000 more characters for week</p>
                            <p style={{cursor:'default'}}>7000 more characters for month</p>
                            <h5 style={{cursor:'default'}}>For 9.99$ a month</h5>
                            <Button className='mt-3' onClick={() => morecharacter(1)}>Go to payment</Button>
                        </Card.Body>
                    </Card>
                    <Card style={{position: 'relative', width: '30%', margin: '4%', height: '50%', background: 'linear-gradient(40deg,#539bdb,#8983f7 70%)', textAlign: 'center',justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column', borderRadius: '12px', flex:'0 1 auto'}}>
                        <Card.Body style={{flex:'0 1 auto'}}>
                            <h3 className='mb-4' style={{cursor:'default'}}>Second option</h3>
                            <p style={{cursor:'default'}}>700 more characters for day</p>
                            <p style={{cursor:'default'}}>4500 more characters for week</p>
                            <p style={{cursor:'default'}}>16000 more characters for month</p>
                            <h5 style={{cursor:'default'}}>For 19.99$ a month</h5>
                            <Button className='mt-3' onClick={() => morecharacter(2)}>Go to payment</Button>
                        </Card.Body>
                    </Card>
                </Container>
                <Container className={confirmBuyProfessional ? 'text-white text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'black', overflowY:'scroll', paddingTop:'10%', left:'0', top:'0'}}>
                    <h4 className='mb-3 mt-3'>Buy a professional account</h4>
                    <p>Are you sure you want to buy a professional account?</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => buyProfessionalConfirm(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => buyProfessionalConfirm(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Container>
                <Container className={confirmBuyCharacters ? 'text-white text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'black', overflowY:'scroll', paddingTop:'10%', left:'0', top:'0'}}>
                    <h4 className='mb-3 mt-3'>Buy Characters</h4>
                    <p>Are you sure you want to buy additional characters?</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => buyCharactersConfirm(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => buyCharactersConfirm(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Container>
            </Container>
        </>
    );
}

export default Settings;
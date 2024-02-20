import React, { useState, useRef, useEffect, useReducer} from 'react';
import { Navbar, Container, Nav, Form, InputGroup, FormControl, Button, Dropdown, Card, Row, Col, Modal, Image, CardGroup} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Routes, useLocation} from 'react-router-dom';
import './App.css';
import Webcam from 'react-webcam';
import { Camera, GeoAlt, Link45deg as LinkLogo, Gear, NodeMinus, PersonCircle, BoxArrowLeft, BoxArrowInDown, Trash3, XCircle, CardImage, PatchCheckFill, CameraVideo, Send } from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import pos_reaction1 from '../src/img/reaction_positive1.png'
import pos_reaction2 from '../src/img/reaction_positive2.png'
import pos_reaction3 from '../src/img/reaction_positive3.png'
import neg_reaction1 from '../src/img/reaction_negative1.png'
import neg_reaction2 from '../src/img/reaction_negative2.png'
import neg_reaction3 from '../src/img/reaction_negative3.png'
import channel_profile from '../src/img/channel_profile.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {getUsers, getListChannels, getUserById, deleteUsers, getListSqueals, getActualUser, updateUsers, updateChannels, updateSqueals, addUser, addSqueal, addChannel} from './serverRequests.js';

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

function Profile() {
    const [actualuser, setactualuser] = useState({nickname: "", photoprofile: "", fullname: "", email: "", cell: "", password: "", version: "", blocked: false, popularity: 0, char_d: 0, char_w: 0, char_m: 0, bio: "", photoprofileX: 0, photoprofileY: 0, notifications: [false,false,false,false,false]})
    const [allUsers, setAllUsers] = useState([]);
    const [n_channeladmin, setn_channeladmin] = useState(0);
    const [mypostsactive, setmypostsactive] = useState(true);
    const [mychannelsactive, setmychannelsactive] = useState(false);
    const [mycharacteractive, setmycharacteractive] = useState(false);
    const [allSqueals, setallSqueals] = useState([]);
    const [allSquealsprint, setallSquealsprint] = useState([]);
    const [allChannelsprint, setallChannelsprint] = useState([]);
    const [allchannels, setallchannels] = useState([]);
    const [allCHANNELS, setallCHANNELS] = useState([]);
    const [allkeywords, setallkeywords] = useState([]);
    const location = useLocation();
    const [indexsquealtodelete, setindexsquealtodelete] = useState();
    const [confirmdeletesqueal, setconfirmdeletesqueal] = useState(false);
    const [editprofilevisible, seteditprofilevisible] = useState(false);
    const [editchannelvisible, seteditchannelvisible] = useState(false);
    const [opensectionchangephoto, setopensectionchangephoto] = useState(false);
    const [opensectionchangephotochannel, setopensectionchangephotochannel] = useState(false);
    const [newphotoprofile, setnewphotoprofile] = useState('');
    const [newphotochannel, setnewphotochannel] = useState('');
    const [newnickname, setnewnickname] = useState('');
    const [newfullname, setnewfullname] = useState('');
    const [newbio, setnewbio] = useState('');
    const [newmail, setnewmail] = useState('');
    const [newpassword, setnewpassword] = useState('');
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [showCameraModalchannel, setShowCameraModalchannel] = useState(false);
    const [showCameraModalmessage, setShowCameraModalmessage] = useState(false);
    const [showCameraVideoModalmessage, setShowCameraVideoModalmessage] = useState(false);
    const webcamRef = useRef(null);
    const webcamRef2 = useRef(null);
    const webcamRef3 = useRef(null);
    const videoRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [draggingchannel, setDraggingchannel] = useState(false);
    const [positionchannel, setPositionchannel] = useState({ x: 0, y: 0 });
    const [lastMousePoschannel, setLastMousePoschannel] = useState({ x: 0, y: 0 });
    const [channelpostsactive, setchannelpostsactive] = useState(true);
    const [channelusersactive, setchannelusersactive] = useState(false);
    const [channelmessagesactive, setchannelmessagesactive] = useState(false);
    const [indexchanneledit, setindexchanneledit] = useState();
    const [newnamechannel, setnewnamechannel] = useState('');
    const [newbiochannel, setnewbiochannel] = useState('');
    const [newsilenceablechannel, setnewsilenceablechannel] = useState(false);
    const [newchannelusers, setnewchannelusers] = useState([]);
    const [newchannelposts, setnewchannelposts] = useState([]);
    const [newchannelmessages, setnewchannelmessages] = useState([]);
    const [indexposttodelete, setindexposttodelete] = useState();
    const [indexmessagetodelete, setindexmessagetodelete] = useState();
    const [confirmdeletepostchannel, setconfirmdeletepostchannel] = useState(false);
    const [confirmdeletemessagechannel, setconfirmdeletemessagechannel] = useState(false);
    const [isModifier, setisModifier] = useState(false);
    const [isCreator, setisCreator] = useState(false);
    const [confirmdeletechannel, setconfirmdeletechannel] = useState(false);
    const [confirmleavechannel, setconfirmleavechannel] = useState(false);
    const [confirmaddmessagechannel, setconfirmaddmessagechannel] = useState(false);
    const [selection, setSelection] = useState(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [positionMap, setPositionMap] = useState(null);
    const markerIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconAnchor: [12, 41]
      });
    const [capturedImage, setCapturedImage] = useState(null);
    const [capturedVideo, setCapturedVideo] = useState(null);
    const [newmessage, setNewmessage] = useState({body:{text:'', position:[], link:'', photo:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', video:''}, request:'', type:''})
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [inputLink, setinputLink] = useState('');
    const [displayedLink, setDisplayedLink] = useState(''); 
    const [newmessagetext, setNewmessagetext] = useState('');
    const [sectiondeleteprofile, setSectiondeleteprofile] = useState(false);
    const [viewKeyword, setViewKeyword] = useState(false);
    const [newKeywordPosts, setNewKeywordPosts] = useState([]);
    const [newNameKeyword, setNewNameKeyword] = useState('');
    const [newBioKeyword, setNewBioKeyword] = useState('');
    const [newPhotoKeyword, setNewPhotoKeyword] = useState('');
    const [positionKeyword, setPositionKeyword] = useState({ x: 0, y: 0 });
    const [inKeyword, setInKeyword] = useState(false);
    const [ChannelPostsDeleted, setChannelPostsDeleted] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [stopRecording, setStopRecording] = useState(false);
    const [stream, setStream] = useState(null);
    const [viewAnswers, setViewAnswers] = useState(false);
    const [allAnswersprint, setAllAnswersprint] = useState([]);
    const [userRequest, setUserRequest] = useState('');
    const [numSeconds, setNumSeconds] = useState('');
    const windowSize = useWindowSize();

    useEffect(() => {
        if (location.pathname.endsWith('/profile')) {
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
              async function getAll4(){
                try{
                    const Channels = await getListChannels();
                    Channels.forEach(channel => {
                      switch(channel.type) {
                        case '&':
                          setallchannels(allchannelsprev => [...allchannelsprev, channel]);
                        break;
                        case '$':
                          setallCHANNELS(allCHANNELSprev => [...allCHANNELSprev, channel]);
                        break;
                        case '#':
                          setallkeywords(allkeywordsprev => [...allkeywordsprev, channel]);
                        break;
                      }
                    });
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                    throw error;
                }
              }    
            getAll1();
            getAll2();
            getAll3();
            getAll4();            
        }
    }, [location.pathname])

    useEffect(()=>{
        let channeladmin = 0;
        setallSquealsprint([]);
        setallChannelsprint([]);
        for(let i=0;i<allSqueals.length;i++){
            if(allSqueals[i].sender==actualuser.nickname){
                setallSquealsprint(prevallSquealsprint => [...prevallSquealsprint,allSqueals[i]])
            }
        }
        for(let i=0;i<allchannels.length;i++){
            for(let j=0;j<allchannels[i].list_users.length;j++)
            if(allchannels[i].list_users[j].nickname==actualuser.nickname){
                setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint,allchannels[i]]);
                    if((allchannels[i].list_users[j].type=='Modifier')|(allchannels[i].list_users[j].type=='Creator')){
                        channeladmin += 1;
                    }
            }
        }
        for(let i=0;i<allCHANNELS.length;i++){
            for(let j=0;j<allCHANNELS[i].list_users.length;j++)
            if(allCHANNELS[i].list_users[j].nickname==actualuser.nickname){
                setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint,allCHANNELS[i]]);
                    if((allCHANNELS[i].list_users[j].type=='Modifier')|(allCHANNELS[i].list_users[j].type=='Creator')){
                        channeladmin += 1;
                    }
            }
        }
        for(let i=0;i<allkeywords.length;i++){
            for(let j=0;j<allkeywords[i].list_users.length;j++)
            if(allkeywords[i].list_users[j].nickname==actualuser.nickname){
                setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint,allkeywords[i]]);
            }
        }
        setn_channeladmin(channeladmin);
    }, [allSqueals, actualuser, allchannels, allCHANNELS, allkeywords]);

    async function updateAllUsers(UsersToUpdate){
        try{
          const user = await updateUsers(UsersToUpdate);
          console.log(user)
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    async function deleteUser(UsersToUpdate){
        try{
          const user = await deleteUsers(UsersToUpdate);
          console.log(user)
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    async function updateAllChannels(ChannelsToUpdate){
        try{
            console.log(ChannelsToUpdate)
          const chan = await updateChannels(ChannelsToUpdate);
          console.log(chan);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    async function updateAllSqueals(SquealsToUpdate){
        try{
          const squeal = await updateSqueals(SquealsToUpdate);
          console.log(squeal);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    const opendeletesqueal = (index) => {
        setindexsquealtodelete(index);
        setconfirmdeletesqueal(true);
    }

    const deletesqueal = (eliminate) => {
        if(eliminate){
        const newallSqueals = [...allSquealsprint];
        let listnewchannels = [...allchannels];
        let listnewCHANNELS = [...allCHANNELS];
        let listnewkeywords = [...allkeywords];
        if(allSquealsprint[indexsquealtodelete].channel!=""){
            switch(allSquealsprint[indexsquealtodelete].typesender){
                case 'channels':
                    for(let i=0;i<allchannels.length;i++){
                        if(allSquealsprint[indexsquealtodelete].channel===allchannels[i].name){
                            listnewchannels[i].list_posts = [];
                            for(let j=0;j<allchannels[i].list_posts.length;j++){
                                if((allSquealsprint[indexsquealtodelete].sender!=allchannels[i].list_posts[j].sender)|(allSquealsprint[indexsquealtodelete].date!=allchannels[i].list_posts[j].date)|(allSquealsprint[indexsquealtodelete].hour!=allchannels[i].list_posts[j].hour)|(allSquealsprint[indexsquealtodelete].seconds!=allchannels[i].list_posts[j].seconds)){
                                    listnewchannels[i].list_posts.push(allSquealsprint[indexsquealtodelete]);
                                }
                            }
                        }
                    }
                break;
                case 'CHANNELS':
                    for(let i=0;i<allCHANNELS.length;i++){
                        if(allSquealsprint[indexsquealtodelete].channel===allCHANNELS[i].name){
                            listnewCHANNELS[i].list_posts = [];
                            for(let j=0;j<allCHANNELS[i].list_posts.length;j++){
                                if((allSquealsprint[indexsquealtodelete].sender!=allCHANNELS[i].list_posts[j].sender)|(allSquealsprint[indexsquealtodelete].date!=allCHANNELS[i].list_posts[j].date)|(allSquealsprint[indexsquealtodelete].hour!=allCHANNELS[i].list_posts[j].hour)|(allSquealsprint[indexsquealtodelete].seconds!=allCHANNELS[i].list_posts[j].seconds)){
                                    listnewCHANNELS[i].list_posts.push(allSquealsprint[indexsquealtodelete]);
                                }
                            }
                        }
                    }
                break;
                case 'keywords':
                    for(let i=0;i<allkeywords.length;i++){
                        if(allSquealsprint[indexsquealtodelete].channel===allkeywords[i].name){
                            listnewkeywords[i].list_posts = [];
                            for(let j=0;j<allkeywords[i].list_posts.length;j++){
                                if((allSquealsprint[indexsquealtodelete].sender!=allkeywords[i].list_posts[j].sender)|(allSquealsprint[indexsquealtodelete].date!=allkeywords[i].list_posts[j].date)|(allSquealsprint[indexsquealtodelete].hour!=allkeywords[i].list_posts[j].hour)|(allSquealsprint[indexsquealtodelete].seconds!=allkeywords[i].list_posts[j].seconds)){
                                    listnewkeywords[i].list_posts.push(allSquealsprint[indexsquealtodelete]);
                                }
                            }
                        }
                    }
                break;
            }
        }
        newallSqueals.splice(indexsquealtodelete, 1);
        setallSquealsprint(newallSqueals);
        setallSqueals(newallSqueals);
        updateAllSqueals(newallSqueals);
        let allnewChannels = [...listnewchannels,...listnewCHANNELS,...listnewkeywords];
        updateAllChannels(allnewChannels);
        }
        setconfirmdeletesqueal(false);
    }

    const editprofile = () => {
        seteditprofilevisible(true);
        setnewphotoprofile(actualuser.photoprofile);
        setnewnickname(actualuser.nickname);
        setnewfullname(actualuser.fullname);
        setnewbio(actualuser.bio);
        setnewmail(actualuser.email);
        setnewpassword(actualuser.password);
        setPosition({x: actualuser.photoprofileX, y: actualuser.photoprofileY});
    }

    const editchannel = (x) => {
        if(allChannelsprint[x].type!='#'){
            seteditchannelvisible(true);
            setindexchanneledit(x);
            let modify = false;
            let creator = false;
            for(let i=0; i<allChannelsprint[x].list_users.length;i++){
                if((allChannelsprint[x].list_users[i].nickname==actualuser.nickname)&((allChannelsprint[x].list_users[i].type=='Creator')|(allChannelsprint[x].list_users[i].type=='Modifier'))){
                    modify = true;
                }
                if((allChannelsprint[x].list_users[i].nickname==actualuser.nickname)&(allChannelsprint[x].list_users[i].type=='Creator')){
                    creator = true;
                }
            }
            setisModifier(modify);
            setisCreator(creator);
            setnewnamechannel(allChannelsprint[x].name);
            setnewbiochannel(allChannelsprint[x].description);
            setnewchannelusers(allChannelsprint[x].list_users);
            setnewchannelmessages(allChannelsprint[x].list_mess);
            setnewchannelposts(allChannelsprint[x].list_posts);
            setnewsilenceablechannel(allChannelsprint[x].silenceable);
            setnewphotochannel(allChannelsprint[x].photoprofile);
            setPositionchannel({x:allChannelsprint[x].photoprofileX, y:allChannelsprint[x].photoprofileY});
        } else {
            setViewKeyword(true);
            setNewNameKeyword(allChannelsprint[x].name);
            setNewBioKeyword(allChannelsprint[x].description);
            setNewKeywordPosts(allChannelsprint[x].list_posts);
            setInKeyword(false);
            for(let j=0;j<allChannelsprint[x].list_users.length;j++){
                if(allChannelsprint[x].list_users[j].nickname==(actualuser.nickname)){
                    setInKeyword(true);
                }
            }
            setNewPhotoKeyword(allChannelsprint[x].photoprofile);
            setPositionKeyword({x:allChannelsprint[x].photoprofileX, y:allChannelsprint[x].photoprofileY});
        }
    }

    const changevaluenickname = (event) => {
        const value = event.target.value;
        setnewnickname(value);
    }

    const changevaluebio = (event) => {
        const value = event.target.value;
        setnewbio(value);
    }

    const changevaluefullname = (event) => {
        const value = event.target.value;
        setnewfullname(value);
    }

    const changevaluemail = (event) => {
        const value = event.target.value;
        setnewmail(value);
    }

    const changevaluepassword = (event) => {
        const value = event.target.value;
        setnewpassword(value);
    }

    const closeeditprofile = (save) => {
        if(save){
            const newinfo = {
                ...actualuser,
                nickname: newnickname,
                fullname: newfullname,
                bio: newbio,
                email: newmail,
                password: newpassword,
                photoprofileX: position.x,
                photoprofileY: position.y,
                photoprofile: newphotoprofile
            }
            const updatedItems = [...allChannelsprint];
            for (let i = 0; i < updatedItems.length; i++) {
                for(let j=0; j<updatedItems[i].list_users.length;j++){
                if (updatedItems[i].list_users[j].nickname == actualuser.nickname) {
                    updatedItems[i].list_users[j] = { ...updatedItems[i].list_users[j],
                        nickname: newnickname,
                        fullname: newfullname,
                        bio: newbio,
                        email: newmail,
                        password: newpassword,
                        photoprofileX: position.x,
                        photoprofileY: position.y,
                        photoprofile: newphotoprofile
                        }
                    };
                } 
                for(let z=0; z<updatedItems[i].list_posts.length;z++){
                    if (updatedItems[i].list_posts[z].sender == actualuser.nickname) {
                        updatedItems[i].list_posts[z] = { ...updatedItems[i].list_posts[z],
                            sender: newnickname,
                            photoprofileX: position.x,
                            photoprofileY: position.y,
                            photoprofile: newphotoprofile
                            }
                        };
                }
            }    
            setallChannelsprint(updatedItems);
            setactualuser(newinfo);
            let newlistusers = [...allUsers];
            let newlistchannel = [...allchannels];
            let newlistCHANNEL = [...allCHANNELS];
            let newlistkeywords = [...allkeywords];
            for(let i=0;i<allUsers.length;i++){
                if(allUsers[i].nickname === actualuser.nickname){
                    newlistusers[i] = {...newinfo};
                }
            }
            for(let i=0;i<allchannels.length;i++){
                for(let j=0;j<updatedItems.length;j++){
                    if(allchannels[i]._id===updatedItems[j]._id){
                        newlistchannel[i] = {...updatedItems[j]}
                    }
                }
            }
            for(let i=0;i<allCHANNELS.length;i++){
                for(let j=0;j<updatedItems.length;j++){
                    if(allCHANNELS[i]._id===updatedItems[j]._id){
                        newlistCHANNEL[i] = {...updatedItems[j]}
                    }
                }
            }
            for(let i=0;i<allkeywords.length;i++){
                for(let j=0;j<updatedItems.length;j++){
                    if(allkeywords[i]._id===updatedItems[j]._id){
                        newlistkeywords[i] = {...updatedItems[j]}
                    }
                }
            }
            setAllUsers(newlistusers);
            setallchannels(newlistchannel);
            setallCHANNELS(newlistCHANNEL);
            setallkeywords(newlistkeywords);
            updateAllUsers(newlistusers);
            let ListChannelsToUpdate = [...newlistchannel,...newlistCHANNEL,...newlistkeywords];
            updateAllChannels(ListChannelsToUpdate);
        }
        seteditprofilevisible(false);
    }

    const changevaluenamechannel = (event) => {
        if(isModifier){
            const value = event.target.value;
            setnewnamechannel(value);
        }else{
            alert("You don't have permissions to modify this channel");
        }
    }

    const changevaluebiochannel = (event) => {
        if(isModifier){
        const value = event.target.value;
        setnewbiochannel(value);
        }else{
            alert("You don't have permissions to modify this channel");
        }
    }

    const closeeditchannel = (save) => {
        if(save){
            const updatedItems = [...allChannelsprint];
            for (let i = 0; i < updatedItems.length; i++) {
                if (i == indexchanneledit) {
                    updatedItems[i] = { ...updatedItems[i],
                        name:newnamechannel,
                        photoprofile: newphotochannel, 
                        photoprofileX: positionchannel.x,
                        photoprofileY: positionchannel.y,
                        list_mess: newchannelmessages,
                        silenceable: newsilenceablechannel,
                        list_users: newchannelusers,
                        list_posts: newchannelposts, 
                        description: newbiochannel}
                    };
                }      
            setallChannelsprint(updatedItems);
            for(let i=0;i<allchannels.length;i++){
                for(let j=0;j<updatedItems.length;j++){
                    if(allchannels[i]._id===updatedItems[j]._id){
                        allchannels[i] = {...updatedItems[j]}
                    }
                }
            }
            for(let i=0;i<allCHANNELS.length;i++){
                for(let j=0;j<updatedItems.length;j++){
                    if(allCHANNELS[i]._id===updatedItems[j]._id){
                        allCHANNELS[i] = {...updatedItems[j]}
                    }
                }
            }
            for(let i=0;i<allkeywords.length;i++){
                for(let j=0;j<updatedItems.length;j++){
                    if(allkeywords[i]._id===updatedItems[j]._id){
                        allkeywords[i] = {...updatedItems[j]}
                    }
                }
            }
            const ListSqueals = allSqueals.filter(message =>
                !ChannelPostsDeleted.some(toDelete =>
                  message.sender == toDelete.sender &&
                  message.date == toDelete.date &&
                  message.hour == toDelete.hour &&
                  message.seconds == toDelete.seconds
                )
              );
            updateAllSqueals(ListSqueals);
            const ListSquealsUser = allSquealsprint.filter(message =>
                !ChannelPostsDeleted.some(toDelete =>
                  message.sender == toDelete.sender &&
                  message.date == toDelete.date &&
                  message.hour == toDelete.hour &&
                  message.seconds == toDelete.seconds
                ));
            setallSquealsprint(ListSquealsUser);
            let ListChannelsToUpdate = [...allchannels,...allCHANNELS,...allkeywords];
            updateAllChannels(ListChannelsToUpdate);
        }
        seteditchannelvisible(false);
    }

    const openchangephoto = () => {
        setopensectionchangephoto(true);
    }

    const closechangephoto = () => {
        setopensectionchangephoto(false);
    }

    const openchangephotochannel = () => {
        if(isModifier){
        setopensectionchangephotochannel(true);
        } else {
            alert("You don't have permissions to modify this channel");
        }
    }

    const closechangephotochannel = () => {
        setopensectionchangephotochannel(false);
    }

    const deletecurrentphoto = () => {
        setnewphotoprofile('');
        setopensectionchangephoto(false);
        setPosition({ x: 0, y: 0});
        setLastMousePos({ x: 0, y: 0});
    }

    const deletecurrentphotochannel = () => {
        setnewphotochannel('');
        setopensectionchangephotochannel(false);
        setPositionchannel({ x: 0, y: 0});
        setLastMousePoschannel({ x: 0, y: 0});
    }

    const selectcurrentphoto = (event) => {
        let file = event.target.files[0];
        if (file) {
            setnewphotoprofile(URL.createObjectURL(file));
        }
        setopensectionchangephoto(false);
        setPosition({ x: 0, y: 0});
        setLastMousePos({ x: 0, y: 0});
    }

    const selectcurrentphotochannel = (event) => {
        let file = event.target.files[0];
        if (file) {
            setnewphotochannel(URL.createObjectURL(file));
        }
        setopensectionchangephotochannel(false);
        setPositionchannel({ x: 0, y: 0});
        setLastMousePoschannel({ x: 0, y: 0});
    }

    const takecurrentphoto = () => {
        setShowCameraModal(true);
    }

    const takecurrentphotochannel = () => {
        setShowCameraModalchannel(true);
    }

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setnewphotoprofile(imageSrc);
        setShowCameraModal(false);
        setopensectionchangephoto(false);
        setPosition({ x: 0, y: 0});
        setLastMousePos({ x: 0, y: 0});
    }

    const capturechannel = () => {
        const imageSrc = webcamRef2.current.getScreenshot();
        setnewphotochannel(imageSrc);
        setShowCameraModalchannel(false);
        setopensectionchangephotochannel(false);
        setPositionchannel({ x: 0, y: 0});
        setLastMousePoschannel({ x: 0, y: 0});
    }

    const handleMouseDown = (e) => {
        setDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
      };
      
    const handleMouseUp = () => {
        setDragging(false);
      };
      
    const handleMouseMove = (e) => {
        if (dragging) {
          const deltaX = e.clientX - lastMousePos.x;
          const deltaY = e.clientY - lastMousePos.y;
          setPosition({ x: position.x + deltaX, y: position.y + deltaY });
          setLastMousePos({ x: e.clientX, y: e.clientY });
        }
      };

    const handleMouseDownchannel = (e) => {
        setDraggingchannel(true);
        setLastMousePoschannel({ x: e.clientX, y: e.clientY });
      };
      
    const handleMouseUpchannel = () => {
        setDraggingchannel(false);
      };
      
    const handleMouseMovechannel = (e) => {
        if (draggingchannel) {
          const deltaX = e.clientX - lastMousePoschannel.x;
          const deltaY = e.clientY - lastMousePoschannel.y;
          setPositionchannel({ x: positionchannel.x + deltaX, y: positionchannel.y + deltaY });
          setLastMousePoschannel({ x: e.clientX, y: e.clientY });
        }
      };

    const changetypeuserchannel = (index) => {
        if(isModifier){
            let value;
            if(newchannelusers[index].type=='User'){
                value = 'Modifier';
            } else if(newchannelusers[index].type=='Modifier'){
                value = 'User';
            } else {
                value = 'Creator';
                alert("you can't change the state of the channel creator");
            }
            const updatedItems = newchannelusers.map((item, idx) =>
                idx == index ? { ...item, type: value } : item
            );
            setnewchannelusers(updatedItems);
        } else {
            alert("You don't have permissions to modify this channel");
        }
    }

    const changeblockuserchannel = (index) => {
        if(isModifier){
            if(newchannelusers[index].type!='Creator'){
            const updatedItems = newchannelusers.map((item, idx) =>
                idx == index ? { ...item, block: !item.block } : item
            );
            setnewchannelusers(updatedItems);
            } else {
                alert("you can't change the state of the channel creator");
            }
        } else {
            alert("You don't have permissions to modify this channel");
        }
    }

    const opendeletemessagechannel = (index) => {
        if(isModifier){
            setindexmessagetodelete(index);
            setconfirmdeletemessagechannel(true);
        } else {
            alert("You don't have permissions to modify this channel");
        }
    }

    const opendeletepostchannel = (index) => {
        if(isModifier){
        setindexposttodelete(index);
        setconfirmdeletepostchannel(true);
        } else {
            alert("You don't have permissions to modify this channel");
        }
    }

    const deletepostchannel = (eliminate) => {
        if(eliminate){
        const newallSqueals = [...newchannelposts];
        let postsDeleted = [...ChannelPostsDeleted];
        postsDeleted.push(newallSqueals[indexposttodelete]);
        setChannelPostsDeleted(postsDeleted);
        newallSqueals.splice(indexposttodelete, 1);
        setnewchannelposts(newallSqueals);
        }
        setconfirmdeletepostchannel(false);
    }

    const deletemessagechannel = (eliminate) => {
        if(eliminate){
        const newallSqueals = [...newchannelmessages];
        newallSqueals.splice(indexmessagetodelete, 1);
        setnewchannelmessages(newallSqueals);
        }
        setconfirmdeletemessagechannel(false);
    }

    const opendeletechannel = () => {
        setconfirmdeletechannel(true);
    }

    const openleavechannel = () => {
        setconfirmleavechannel(true);
    }

    const deletechannel = (confirm) => {
        if(confirm){
            seteditchannelvisible(false);
            let newlistchannel = allchannels.filter(oggetto => oggetto.name !== allChannelsprint[indexchanneledit].name);
            let newlistCHANNEL = allCHANNELS.filter(oggetto => oggetto.name !== allChannelsprint[indexchanneledit].name);
            const ListSqueals = allSqueals.filter(message =>
                !allChannelsprint[indexchanneledit].list_posts.some(toDelete =>
                  message.sender == toDelete.sender &&
                  message.date == toDelete.date &&
                  message.hour == toDelete.hour &&
                  message.seconds == toDelete.seconds
                )
              );
            updateAllSqueals(ListSqueals);
            setallSqueals(ListSqueals);
            const ListSquealsUser = allSquealsprint.filter(message =>
                !allChannelsprint[indexchanneledit].list_posts.some(toDelete =>
                  message.sender == toDelete.sender &&
                  message.date == toDelete.date &&
                  message.hour == toDelete.hour &&
                  message.seconds == toDelete.seconds
                ));
            setallSquealsprint(ListSquealsUser);
            setallCHANNELS(newlistCHANNEL);
            setallchannels(newlistchannel);
            let allChannelsModified = [...newlistchannel, ...newlistCHANNEL, ...allkeywords];
            updateAllChannels(allChannelsModified);
            for(let i=0; i<allChannelsprint[indexchanneledit].list_users.length;i++){
                if((allChannelsprint[indexchanneledit].list_users[i].nickname==actualuser.nickname)&((allChannelsprint[indexchanneledit].list_users[i].type=='Creator')|(allChannelsprint[indexchanneledit].list_users[i].type=='Modifier'))){
                    let channeladmin = n_channeladmin-1;
                    setn_channeladmin(channeladmin);
                }
            }
            const newlist = [
                ...allChannelsprint.slice(0, indexchanneledit),
                ...allChannelsprint.slice(indexchanneledit + 1)
            ]
            setallChannelsprint(newlist);
        }
        setconfirmdeletechannel(false);    
    }

    const leavechannel = (confirm) => {             //backend aggiungere allkeywords
        if(confirm){
            seteditchannelvisible(false);
            for(let i=0; i<allChannelsprint[indexchanneledit].list_users.length;i++){
                if((allChannelsprint[indexchanneledit].list_users[i].nickname==actualuser.nickname)&((allChannelsprint[indexchanneledit].list_users[i].type=='Creator')|(allChannelsprint[indexchanneledit].list_users[i].type=='Modifier'))){
                    let channeladmin = n_channeladmin-1;
                    setn_channeladmin(channeladmin);
                }
            }
            let newlistchannel = allchannels;
            let newlistCHANNEL = allCHANNELS;
            for(let i=0; i<allchannels.length; i++){
                if(allchannels[i].name==allChannelsprint[indexchanneledit].name){
                    for(let j=0;j<allchannels[i].list_users.length;j++){
                        if(allchannels[i].list_users[j].nickname==actualuser.nickname){
                            newlistchannel[i].list_users.splice(j,1);
                        }
                    }
                }
            }
            for(let i=0; i<allCHANNELS.length; i++){
                if(allCHANNELS[i].name==allChannelsprint[indexchanneledit].name){
                    for(let j=0;j<allCHANNELS[i].list_users.length;j++){
                        if(allCHANNELS[i].list_users[j].nickname==actualuser.nickname){
                            newlistCHANNEL[i].list_users.splice(j,1);
                        }
                    }
                }
            }
            setallCHANNELS(newlistCHANNEL);
            setallchannels(newlistchannel);
            let allChannelsModified = [...newlistchannel, ...newlistCHANNEL, ...allkeywords];
            updateAllChannels(allChannelsModified);
            const newlist = [
                ...allChannelsprint.slice(0, indexchanneledit),
                ...allChannelsprint.slice(indexchanneledit + 1)
            ]
            setallChannelsprint(newlist);
        }
        setconfirmleavechannel(false);    
    }

    const changesilenceablechannel = () => {
        setnewsilenceablechannel(!newsilenceablechannel);
    }

    const addmessagechannel = () => {
        if(isModifier){
        setconfirmaddmessagechannel(true);
        setCapturedImage(null);
        setCapturedVideo(null);
        setIsMapVisible(false); 
        setPositionMap([]);
        setDisplayedLink(null);
        setNewmessagetext('');
        setNumSeconds('');
        setUserRequest('');
        setNewmessage({body:{text:'', position:[], link:'', photo:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', video:''}, request:'', type:''});
        setSelection("Select an option");
        } else {
            alert("You don't have permissions to modify this channel");
        }
    }

    const sectionaddmessagechannel = async (confirm) => {
        if(confirm){
                switch(selection){
                    case "Welcome":
                        if(newmessage.body.text!='' | newmessage.body.position.length!=0 | newmessage.body.link!='' | newmessage.body.video!='' | newmessage.body.photo!='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'){
                            let video = newmessage.body.video;
                            setnewchannelmessages(prevmess => ([...prevmess, {
                                body: {
                                    text: newmessage.body.text,
                                    position: newmessage.body.position,
                                    link: newmessage.body.link,
                                    photo:newmessage.body.photo,
                                    video:video,
                                },
                                request: '',
                                type: selection,
                                repetition:'',
                            }]));
                        } else {
                            alert("The message is empty");
                        }
                    break;
                    case "Answer":
                        if((newmessage.request!="/")&&(newmessage.request.startsWith("/"))&&(newmessage.request!="")){
                            if(newmessage.body.text!='' | newmessage.body.position.length!=0 | newmessage.body.link!='' | newmessage.body.video!='' | newmessage.body.photo!='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'){
                                let video = newmessage.body.video;
                                setnewchannelmessages(prevmess => ([...prevmess, {
                                    body: {
                                        text: newmessage.body.text,
                                        position: newmessage.body.position,
                                        link: newmessage.body.link,
                                        photo:newmessage.body.photo,
                                        video:video,
                                    },
                                    request: "to "+newmessage.request,
                                    type: selection,
                                    repetition:'',
                                }]));
                            } else {
                                alert("The message is empty");
                            }
                        } else {
                            alert("Insert a valid request");
                            return;
                        }
                    break;
                    case "Repeat":
                        let j = false;
                        for(let i=0; i<newchannelmessages.length; i++){
                            if(newchannelmessages[i].type=="Repeat"){
                                j=true;
                            }
                        }
                        if(j==false){
                            if(numSeconds!=""){
                                setnewchannelmessages(prevmess => ([...prevmess, {
                                    body: {
                                        text: "to /begin",
                                        position: [],
                                        link: '',
                                        photo:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                                        video:'',
                                    },
                                    request: '',
                                    type: selection,
                                    repetition:"every "+numSeconds+" seconds",
                                }]));
                            } else {
                                alert('Insert the number of seconds for repeat');
                            }
                        } else {
                            alert("There is already a repeat message in this channel");
                        }
                    break;
                    case "Casual Images":
                        if(userRequest!="/" && userRequest.startsWith("/") && userRequest!=""){
                            setnewchannelmessages(prevmess => ([...prevmess, {
                                body: {
                                    text: '',
                                    position: [],
                                    link: '',
                                    photo:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                                    video:'',
                                },
                                request: "to "+userRequest,
                                type: selection,
                                repetition:'',
                            }]));
                        } else {
                            alert('Insert a valid request');
                        }
                    break;
                    case "News":
                        if(userRequest!="/" && userRequest.startsWith("/") && userRequest!=""){
                            setnewchannelmessages(prevmess => ([...prevmess, {
                                body: {
                                    text: '',
                                    position: [],
                                    link: '',
                                    photo:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                                    video:'',
                                },
                                request: "to "+userRequest,
                                type: selection,
                                repetition:'',
                            }]));
                        } else {
                            alert('Insert a valid request');
                        }
                    break;
                    case "WikiInfo":
                        if(userRequest!="/" && userRequest.startsWith("/") && userRequest!=""){
                            setnewchannelmessages(prevmess => ([...prevmess, {
                                body: {
                                    text: '',
                                    position: [],
                                    link: '',
                                    photo:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                                    video:'',
                                },
                                request: "to "+userRequest,
                                type: selection,
                                repetition:'',
                            }]));
                        } else {
                            alert('Insert a valid request');
                        }
                    break;
                    default:
                        alert("Insert a valid message type");
                        return;
                }
        }
        setconfirmaddmessagechannel(false);
    }

    const changenewmessagetext = (e) => {
        let text = e.target.value;
        setNewmessagetext(text);
        setNewmessage(prevmess => ({
            ...prevmess,
            body: {
                    ...prevmess.body,
                    text:text
                }
          }));
    }

    const takephotonewmessage = () => {
        setShowCameraModalmessage(true);
    }

    const takevideonewmessage = () => {
        setShowCameraVideoModalmessage(true);
    }

    const changenewmessagerequest = (e) => {
        let text = e.target.value;
        setNewmessage(prevmess => ({
            ...prevmess,
            request: text
          }));
    }

    const changenewmessageseconds = (e) => {
        let num = e.target.value;
        setNumSeconds(num);
    }

    const changenewmessageuserrequest = (e) => {
        let req = e.target.value;
        setUserRequest(req);
    }

    const handleLocationButtonClick = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setPositionMap([latitude, longitude]);
            setIsMapVisible(true);
            setNewmessage(prevmess => ({
                ...prevmess,
                body: {
                    ...prevmess.body,
                    position: [latitude, longitude]
                }
              }));
          }, (error) => {
            console.error(error);
          });
        } else {
          alert('La geolocalizzazione non è supportata dal tuo browser.');
        }
    };

    
  const handleInputChange = (e) => {
    setinputLink(e.target.value);
  };

  const handleSubmitLink = () => {
      if (isLink(inputLink)) {
        setDisplayedLink(inputLink);
        setShowLinkModal(false);
        setNewmessage(prevmess => ({
            ...prevmess,
            body: {
                ...prevmess.body,
                link: inputLink
            }
          }));
      } else {
        alert("Please insert a link that starts with 'http://' or 'https://'.");
      }
  };     
  
  const isLink = (string) => {
    const regex = /^(http:\/\/|https:\/\/)/;
    return regex.test(string);
  }

  const capturemessage = () => {
    const imageSrc = webcamRef3.current.getScreenshot();
    setNewmessage(prevmess => ({
        ...prevmess,
        body: {
            ...prevmess.body,
            photo: imageSrc
        }
      }));
      setCapturedImage(imageSrc);
    setShowCameraModalmessage(false);
    }

    const deleteprofile = (confirm) => {
        if(confirm){
            let newlistusers = [];
            for(let i=0; i<allUsers.length; i++){
                        if(allUsers[i].nickname!=actualuser.nickname){
                            newlistusers.push(allUsers[i]);
                        }
                    }
            setAllUsers(newlistusers);
            let newlistchannel = [];
            let newlistCHANNEL = [];
            let newlistkeywords = [...allkeywords];
            let k=-1;
            for(let i=0; i<allchannels.length; i++){
                if(allchannels[i].creator!=actualuser.nickname){
                    newlistchannel.push(allchannels[i]);
                    k += 1;
                    newlistchannel[k].list_users = [];
                    for(let j=0;j<allchannels[i].list_users.length;j++){
                        if(allchannels[i].list_users[j].nickname!=actualuser.nickname){
                            newlistchannel[k].list_users.push(allchannels[i].list_users[j]);
                        }
                    }
                }
            }
            k = -1;
            for(let i=0; i<allCHANNELS.length; i++){
                if(allCHANNELS[i].creator!=actualuser.nickname){
                    newlistCHANNEL.push(allCHANNELS[i]);
                    k += 1;
                    newlistCHANNEL[k].list_users = [];
                    for(let j=0;j<allCHANNELS[i].list_users.length;j++){
                        if(allCHANNELS[i].list_users[j].nickname!=actualuser.nickname){
                            newlistCHANNEL[k].list_users.push(allCHANNELS[i].list_users[j]);
                        }
                    }
                }
            }
            for(let i=0; i<allkeywords.length; i++){
                    newlistkeywords[i].list_users = [];
                    for(let j=0;j<allkeywords[i].list_users.length;j++){
                        if(allkeywords[i].list_users[j].nickname!=actualuser.nickname){
                            newlistkeywords[i].list_users.push(allkeywords[i].list_users[j]);
                        }
                    }
            }
            setallCHANNELS(newlistCHANNEL);
            setallchannels(newlistchannel);
            setallkeywords(newlistkeywords);
            let allChannelsModified = [...newlistchannel,...newlistCHANNEL,...newlistkeywords];
            let newlistSqueals = allSqueals.filter(oggetto => oggetto.sender !== actualuser.nickname);
            updateAllSqueals(newlistSqueals);
            updateAllChannels(allChannelsModified);
            let idActualUser = JSON.parse(localStorage.getItem("actualUserId"));
            deleteUser(idActualUser);
            window.location.href = 'http://localhost:8080';
        }
        setSectiondeleteprofile(false);
    } 
    
    const profilepostsactive = () => {
        setmypostsactive(true);
        setViewAnswers(false);
        setmychannelsactive(false);
        setmycharacteractive(false);
    }

    const profilechannelsactive = () => {
        setmypostsactive(false);
        setViewAnswers(false);
        setmychannelsactive(true);
        setmycharacteractive(false);
    }

    const profilecharacteractive = () => {
        setmypostsactive(false);
        setViewAnswers(false);
        setmychannelsactive(false);
        setmycharacteractive(true);
    }

    const sectionchannelpostsactive = () => {
        setchannelpostsactive(true);
        setchannelusersactive(false);
        setchannelmessagesactive(false);
    }

    const sectionchannelusersactive = () => {
        setchannelpostsactive(false);
        setchannelusersactive(true);
        setchannelmessagesactive(false);
    }

    const sectionchannelmessagesactive = () => {
        setchannelpostsactive(false);
        setchannelusersactive(false);
        setchannelmessagesactive(true);
    }
    
    const closeViewKeyword = () => {
        setViewKeyword(false);
    }

    const subscribekeyword = () => {
        if(inKeyword){
            for(let i=0; i<allkeywords.length; i++){
              if(allkeywords[i].name==newNameKeyword){
                for(let j=0;j<allkeywords[i].list_users.length;j++){
                  if(allkeywords[i].list_users[j].nickname==actualuser.nickname){
                      allkeywords[i].list_users.splice(j,1);
                    }
                  }
                }
              }
          } else {
            for(let i=0; i<allkeywords.length; i++){
              if(allkeywords[i].name==newNameKeyword){
                    allkeywords[i].list_users.push({
                      nickname:actualuser.nickname, 
                      photoprofile:actualuser.photoprofile, 
                      photoprofileX:actualuser.photoprofileX, 
                      photoprofileY:actualuser.photoprofileY, 
                      type:'User', 
                      block:false
                    });
              }
            }
          }
          setallkeywords(allkeywords);
          let allChannelsModified = [...allchannels,...allCHANNELS,...allkeywords];
          updateAllChannels(allChannelsModified);
          setInKeyword(!inKeyword);
    }

      const exitprofile = () => {
        localStorage.removeItem('Interval active');
        localStorage.removeItem('secToRepeat');
        localStorage.removeItem('Counter');
        localStorage.removeItem('ChannelSelectedListUsers');
        localStorage.removeItem('ChannelSelected');
        localStorage.removeItem('ChannelSelectedName');
        localStorage.removeItem('ChannelTypeSender');
        localStorage.removeItem('PhotoProfile');
        localStorage.removeItem('Nickname');
        localStorage.setItem("actualUserId", JSON.stringify(1));
        window.location.href = "http://localhost:8080";
      }

      const OpenAnswers = (index) => {
        const newAnswers = [...allSquealsprint[index].answers];
        setAllAnswersprint(newAnswers);
        setViewAnswers(true);
        setmypostsactive(false);
      }

      
const loadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewmessage(prevmess => ({
            ...prevmess,
            body: {
                ...prevmess.body,
                photo: e.target.result
            }
          }));
          setCapturedImage(e.target.result);
        setShowCameraModalmessage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setNewmessage(prevmess => ({
              ...prevmess,
              body: {
                  ...prevmess.body,
                  video: e.target.result
              }
            }));
            setCapturedVideo(e.target.result);
          setShowCameraVideoModalmessage(false);
        };
        reader.readAsDataURL(file);
      }
    }

    return (
        <>
        <Container style={{ width: windowSize>=1024 ? '80%': windowSize>=600 ? '90%' : '100%', left:windowSize>=1024 ? '20%': windowSize>=600 ? '10%' : '0', height: windowSize>=600 ? '100vh' : '90%', position:'absolute', alignItems: 'center', overflow:'hidden'}} className="d-flex flex-column">
            <header className='d-flex flex-column text-center' style={{width:'100%', alignItems:'center'}}>
                { actualuser.photoprofile!='' ? (<div className='mt-4' style={{width:'70px',height:'70px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}}>
                <Image src={actualuser.photoprofile} style={{height:'100%', width:'100%', position:'relative', marginTop: actualuser.photoprofileY, marginLeft: actualuser.photoprofileX}}></Image>
                </div>)
                : <PersonCircle size='70' color='black' className='mt-4'></PersonCircle>
                }
                <h4 className="text mt-3">{actualuser.nickname}</h4>
                <Row className='mt-3' style={{width:'60%', justifyContent:'space-between'}}>
                    <p className='text' style={{width:'50%', padding:'0'}}>{allSquealsprint.length} post published</p>
                    <p className='text' style={{width:'50%', padding:'0'}}>{allChannelsprint.length} channels of which {n_channeladmin} admin</p>
                </Row>
                <p className='text' style={{width:'90%', padding:'0'}}>{actualuser.bio}</p>
                <Button onClick={() => editprofile()} style={{position:'absolute', top:'20px', right:'20px', backgroundColor:'#696969', borderColor:'white'}}>Edit Profile</Button>
                <Button onClick={() => exitprofile()} style={{position:'absolute', left:'20px', top:'20px'}}>Exit</Button>
            </header>
            <hr style={{width:'100%',  height:'2px', marginBottom:'0'}}></hr>
            <Row>
                <Button className={`${mypostsactive ? 'active' : ''}`} style={{width:'95px', height:'40px',  background:'transparent', border:'0', borderRadius:'0px', color: 'black'}} onClick={profilepostsactive}>Posts</Button>
                <Button className={`${mychannelsactive ? 'active' : ''}`} style={{width:'100px', height:'40px',  background:'transparent', border:'0', borderRadius:'0px', color: 'black'}} onClick={profilechannelsactive}>Channels</Button>
                <Button className={`${mycharacteractive ? 'active' : ''}`} style={{width:'110px', height:'40px',  background:'transparent', border:'0', borderRadius:'0px', color: 'black'}} onClick={profilecharacteractive}>Characters</Button>
            </Row>
            <Container className="text-center text mt-5" style={{overflowY:'scroll', height:'400px'}}>
                <Row className={`${mypostsactive ? windowSize>800 ? 'row-cols-2' : 'column' : 'd-none'}`} >
                {allSquealsprint.map((squeal,index) => (
                <Col key={index} className='mt-3'>
                    <Card style={{backgroundColor:'white',  borderColor:'white', minWidth:'280px', minHeight:'200px', marginBottom:index===(allSquealsprint.length-1) ? '100px' : '5%'}}>
                        <Card.Header className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                            <CardGroup style={{display:'flex', maxWidth:'280px', overflow:'hidden'}}>
                            { actualuser.photoprofile!='' ? (<div className='me-3' style={{width:'30px', minWidth:'30px', height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={actualuser.photoprofile} style={{height:'100%', width:'100%', position:'relative', marginTop: actualuser.photoprofileY/2.5, marginLeft: actualuser.photoprofileX/2.5}}></Image>
                            </div>)
                            : <PersonCircle size='30' color='black' className='me-3'></PersonCircle>
                            }
                            {squeal.sender}
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
                                {squeal.body.video!='' && (
                                <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <video src={squeal.body.video} alt="Squeal video" width="100%" controls/>
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
                        <Card.Footer className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                        <Button className='mb-1' onClick={() => opendeletesqueal(index)}>Delete</Button>
                        <Button className="text" style={{backgroundColor:'transparent',border:'0'}} onClick={() => OpenAnswers(index)}><Send style={{cursor:'pointer'}}></Send>{'('+squeal.answers.length+')'}</Button>
                        <div className='d-flex'>
                            <Card.Text className='me-1' style={{cursor:'default'}}>
                            {squeal.pos_reactions}
                            </Card.Text>
                            <Image src={'/squealer-app'+pos_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                            <Image src={'/squealer-app'+pos_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                            <Image src={'/squealer-app'+pos_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                            <Card.Text style={{marginLeft:'17px', cursor:'default'}} className='me-1'>
                            {squeal.neg_reactions}
                            </Card.Text>
                            <Image src={'/squealer-app'+neg_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                            <Image src={'/squealer-app'+neg_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                            <Image src={'/squealer-app'+neg_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                        </div>
                        </Card.Footer>
                    </Card>
                  </Col>
                  ))}
                </Row>
                <Container style={{alignItems:'center'}} className={`${viewAnswers ? 'd-flex flex-column' : 'd-none'}`} >
                    <div className='d-flex flex-row'><button type="button" className="btn-close" aria-label="Close" style={{position: 'relative', marginLeft: '2%', marginRight:'30px', fontSize: '30px', filter: 'invert(1)'}} onClick={()=>{setViewAnswers(false); setmypostsactive(true)}}></button>
                    <h5 className="text-light text-center mt-4 mb-4">All Answers</h5></div>
                {allAnswersprint.map((squeal,index) => (
                <Col key={index} className='mt-3'>
                    <Card style={{backgroundColor:'black',  borderColor:'white', minWidth:'280px', minHeight:'200px', marginBottom:'5%'}}>
                        <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                            <CardGroup>
                            { squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={squeal.photoprofile} style={{height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                            </div>)
                            : <PersonCircle size='30' color='black' className='me-3'></PersonCircle>
                            }
                            {squeal.sender}
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
                                {squeal.body.video!='' && (
                                <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <video src={squeal.body.video} alt="Squeal video" width="100%" controls/>
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
                    </Card>
                  </Col>
                  ))}
                </Container>
                <Row className={`${mychannelsactive ? windowSize>800 ? 'row-cols-2' : 'col' : 'd-none'}`} >
                {allChannelsprint.map((channel,index) => (
                    <Row key={index} onClick={() => editchannel(index)} className='d-flex rowchannel_profile' style={{justifyContent:'center',alignItems:'center',cursor:'pointer', borderRadius:'12px', padding:'5px'}}>
                        <div style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}}>
                        { channel.photoprofile!='' ? 
                        (<Image src={channel.photoprofile} style={{height:'100%', width:'100%', marginTop:channel.photoprofileY, marginLeft:channel.photoprofileX}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', mixBlendMode:'screen'}}></Image>)}
                        </div>
                        <h4 style={{width:'60%',textAlign:'left',marginLeft:'10px'}}>{channel.name}</h4>
                    </Row>
                ))}
                </Row>
                <Col className={`${mycharacteractive ? '' : 'd-none'}`} >
                    <h5 className='pb-4'>Daily characters remaining: {actualuser.char_d}</h5>
                    <h5 className='pb-4'>Weekly characters remaining: {actualuser.char_w}</h5>
                    <h5>Monthly characters remaining: {actualuser.char_m}</h5>
                </Col>
            </Container>
            <Col className={confirmdeletesqueal ? 'text text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'#eee', zIndex:'1001'}}>
                <h4 className='mb-3'>Delete Squeal</h4>
                <p>Are you sure you want to delete this squeal? It will no longer visible to anyone!</p>
                <Row style={{display:'flex',justifyContent:'center'}}>
                    <Button onClick={() => deletesqueal(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                    <Button onClick={() => deletesqueal(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                </Row>
            </Col>   
            <Container className={editprofilevisible ? '' : 'd-none'} style={{position:'absolute',width:'100%',height:'100vh', paddingTop:'10px',backgroundColor:'#eee', color: 'black', overflow:'hidden'}}>
                <Button onClick={() => closeeditprofile(false)} className='me-3'><BoxArrowLeft className='me-2' style={{marginTop:'-2px'}}></BoxArrowLeft>Back</Button>
                <Button onClick={() => closeeditprofile(true)} className='me-3'><BoxArrowInDown className='me-2' style={{marginTop:'-4px'}}></BoxArrowInDown>Save</Button>
                <Button onClick={() => {setSectiondeleteprofile(true)}}>Delete</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <h3 className='text'>Edit Profile</h3>
                    { newphotoprofile!='' ? (<div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}} className='mt-4'>
                    <Image src={newphotoprofile} onMouseDown={handleMouseDown} style={{height:'100%', width:'100%', position:'relative', marginTop:position.y, marginLeft:position.x, cursor: dragging ? 'grabbing' : 'grab'}}></Image>
                    </div>)
                    : <PersonCircle size='85' color='black' className='mt-4'></PersonCircle>
                    }
                    <Button onClick={openchangephoto} className='mt-4'>Change photo</Button>
                    <Container style={{ maxWidth: '800px'}} className="d-flex flex-column mt-3">
                        <Row className='row-cols-2' style={{display:'flex', flexDirection:'row'}}>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluenickname} value={newnickname} placeholder='Nickname' style={{borderRadius: '14px', backgroundColor: 'white', color: 'black', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', marginLeft:'10%'}}>
                            </input>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluefullname} value={newfullname} placeholder='Fullname' style={{borderRadius: '14px', backgroundColor: 'white', color: 'black', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>
                            </input>
                            <input type='mail' className='texteditprofile mb-3' onChange={changevaluemail} value={newmail} placeholder='Mail' style={{borderRadius: '14px', backgroundColor: 'white', color: 'black', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', marginLeft:'10%'}}>
                            </input>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluepassword} value={newpassword} placeholder='Password' style={{borderRadius: '14px', backgroundColor: 'white', color: 'black', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>
                            </input>
                        </Row>
                        <textarea spellCheck='false' className='texteditprofile' onChange={changevaluebio} value={newbio} placeholder='Bio' style={{borderRadius: '14px', backgroundColor: 'white', color: 'black', width: '100%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', height:'100px', resize:'none'}}>

                        </textarea>
                    </Container>
                </Col>
                <Container className={opensectionchangephoto ? '' : 'd-none'} style={{position:'absolute', width:'100%', height:'100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', top:'0', left:'0'}}>
                    <Col style={{position:'absolute',width:'100%', bottom: windowSize>=600 ? '0' : '10%', left:'0', backgroundColor:'#232323', padding:'2em'}}>
                        <Button onClick={takecurrentphoto} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left', display:'flex', justifyContent:'center', alignItems:'center'}}><Camera style={{marginRight:'1em'}}></Camera>Take new picture</Button>
                        <input type='file' id='selectpicture' onChange={selectcurrentphoto} className='d-none'></input>
                        <label htmlFor='selectpicture' style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left',  paddingTop:'0.5em', paddingBottom:'0.5em', borderRadius:'6px', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center'}}><CardImage style={{marginRight:'1em'}}></CardImage>Select new picture</label>
                        <Button onClick={deletecurrentphoto} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', textAlign:'left', display:'flex', justifyContent:'center', alignItems:'center'}}><Trash3 style={{marginRight:'1em'}}></Trash3>Delete picture</Button>
                        <XCircle onClick={() => closechangephoto()} style={{position:'absolute', top:'10px', right:'10px',  cursor:'pointer'}} size='25'></XCircle>
                    </Col>
                </Container>
            </Container>

            <Container className={editchannelvisible ? '' : 'd-none'} style={{position:'absolute',width:'100%',height:'100vh', paddingTop:'10px',backgroundColor:'#eee',overflow:'hidden'}}>
                <Button onClick={() => closeeditchannel(false)} className='me-1'><BoxArrowLeft className='me-2' style={{marginTop:'-2px'}}></BoxArrowLeft>Back</Button>
                <Button onClick={() => closeeditchannel(true)} className='me-1'><BoxArrowInDown className='me-2' style={{marginTop:'-4px'}}></BoxArrowInDown>Save</Button>
                <Button onClick={isCreator ? opendeletechannel : openleavechannel} style={{padding:'0.5em', fontSize:'14px'}}>{isCreator ? 'Delete Channel' : 'Leave Channel'}</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <Col style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <h3 className='text'>Edit Channel</h3>
                    <div onMouseMove={handleMouseMovechannel} onMouseUp={handleMouseUpchannel} style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid black', overflow:'hidden'}}>
                        { newphotochannel!='' ? 
                        (<Image onMouseDown={handleMouseDownchannel} src={newphotochannel} style={{height:'100%', marginTop:positionchannel.y, marginLeft:positionchannel.x, cursor: draggingchannel ? 'grabbing' : 'grab'}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', mixBlendMode:'screen'}}></Image>)}
                    </div>
                    <Button onClick={openchangephotochannel} className='mt-4'>Change photo</Button>
                    </Col>
                    <Container style={{ maxWidth: '800px', alignItems:'center'}} className="d-flex flex-column mt-3">
                        <Row className='d-flex flex-row' style={{width:'100%', justifyContent:'center'}}>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluenamechannel} value={newnamechannel} placeholder='Name' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'black', width: '50%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}></input>
                            <label className="switch" style={{width:'30%', padding:'0.5em'}}>
                                <p style={{ width:'50%'}} className={windowSize>800 ? 'd-inline' : 'd-none'}>Silenceable</p>
                                <input type="checkbox" onChange={changesilenceablechannel} style={{cursor:'pointer'}}/>
                                <span className="slider"></span>
                            </label>
                        </Row>
                        <textarea spellCheck='false' className='texteditprofile' onChange={changevaluebiochannel} value={newbiochannel} placeholder='Bio' style={{borderRadius: '14px', resize:'none', backgroundColor: 'transparent', color: 'black', width: '100%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', height:'50px'}}></textarea>
                    </Container>
                    <hr style={{width:'100%',  height:'2px', marginBottom:'0'}}/>
                    <Row>
                        <Button className={`${channelpostsactive ? 'active' : ''}`} style={{width:'90px', height:'40px',  background:'transparent', border:'0', borderRadius:'0px', color: "black"}} onClick={sectionchannelpostsactive}>Posts</Button>
                        <Button className={`${channelusersactive ? 'active' : ''}`} style={{width:'100px', height:'40px',  background:'transparent', border:'0', borderRadius:'0px', color: "black"}} onClick={sectionchannelusersactive}>Users</Button>
                        <Button className={`${channelmessagesactive ? 'active' : ''}`} style={{width:'100px', height:'40px',  background:'transparent', border:'0', borderRadius:'0px', color: "black"}} onClick={sectionchannelmessagesactive}>Messages</Button>
                    </Row>
                    <Container className="text-center text mt-3"  style={{overflowY:'scroll', height:'100vh'}}>
                        <Row className={`${channelpostsactive ? windowSize>800 ? 'row-cols-2' : 'col' : 'd-none'}`}>
                        {newchannelposts.map((squeal,index) => (
                        <Col key={index}>
                            <Card style={{ borderColor:'white', minWidth:'280px', minHeight:'200px', marginBottom:index===(newchannelposts.length-1) ? '150px' : '5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                                    <CardGroup style={{display:'flex', maxWidth:'280px', overflow:'hidden'}}>
                                    { squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', minWidth:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                                    <Image src={squeal.photoprofile} style={{height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle size='30' color='black' className='me-3'></PersonCircle>
                                    }
                                    {squeal.sender}
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
                                {squeal.body.video!='' && (
                                <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <video src={squeal.body.video} alt="Squeal video" width="100%" controls/>
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
                                <Card.Footer className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                                <Button className='mb-1' onClick={() => opendeletepostchannel(index)}>Delete</Button>
                                <div className='d-flex'>
                                    <Card.Text className='me-1' style={{cursor:'default'}}>
                                    {squeal.pos_reactions}
                                    </Card.Text>
                                    <Image src={'/squealer-app'+pos_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                    <Image src={'/squealer-app'+pos_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                    <Image src={'/squealer-app'+pos_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                    <Card.Text style={{marginLeft:'17px', cursor:'default'}} className='me-1'>
                                    {squeal.neg_reactions}
                                    </Card.Text>
                                    <Image src={'/squealer-app'+neg_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                    <Image src={'/squealer-app'+neg_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                    <Image src={'/squealer-app'+neg_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                                ))}
                        </Row>
                        <Row className={`${channelmessagesactive ? windowSize>= 800 ? 'row-cols-2 d-flex' : 'col' : 'd-none'}`}>
                        {newchannelmessages.map((squeal,index) => (
                        <Col key={index}>
                            <Card style={{borderColor:'white', minWidth:'280px', minHeight:'200px', marginBottom: '5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                                    <CardGroup style={{display:'flex', maxWidth:'280px', overflow:'hidden'}}>
                                    {squeal.type} {squeal.request!="" && (" "+squeal.request)} {squeal.repetition!="" && (" "+squeal.repetition)}
                                    </CardGroup>
                                    <Card.Text>{squeal.hour}</Card.Text>
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
                                {squeal.body.video!='' && (
                                <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <video src={squeal.body.video} alt="Squeal video" width="100%" controls/>
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
                                <Button className='mb-1' onClick={() => opendeletemessagechannel(index)}>Delete</Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                        ))}
                        <Container style={{borderColor:'white', width:'500px', minHeight:'200px', marginBottom:'5%', marginTop:'100px'}}>
                            <Button onClick={addmessagechannel} style={{width:'150px', height:'50px'}}>Add Message</Button>
                        </Container>
                        </Row>
                        <Col style={{width:'80%',marginLeft:'10%', overflowY:'scroll', height:'100%'}} className={`${channelusersactive ? 'row-cols-2' : 'd-none'}`} >
                        {newchannelusers.map((channeluser,index2) => (
                            <Row key={index2} className='mt-3 d-flex' style={{width:'70%',justifyContent:'center',alignItems:'center', borderRadius:'12px', padding:'5px', marginLeft:'15%'}}>
                                { channeluser.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden', padding:'0'}}>
                                    <Image src={channeluser.photoprofile} style={{height:'100%', position:'relative', marginTop:channeluser.photoprofileY/2.5, marginLeft:channeluser.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle color='black' style={{width:'40px', height:'20px', padding:'0'}}></PersonCircle>
                                    }
                                <p style={{width:'40%',textAlign:'left', paddingTop:'15px'}}>{channeluser.nickname}</p>
                                <Button style={{width:'120px', marginRight:'3%'}} onClick={() => changetypeuserchannel(index2)}>{channeluser.type}</Button>
                                <Button style={{width:'120px',  marginTop: windowSize<508 ? '0.25rem' : ''}} onClick={() => changeblockuserchannel(index2)}>{`${channeluser.block ? 'Blocked' : 'Unblocked'}`}</Button>
                            </Row>
                        ))}
                        </Col>
                    </Container>
                </Col>
                
                <Container className={opensectionchangephotochannel ? '' : 'd-none'} style={{position:'absolute', width:'100%', height:'100%', top:'0', left:'0', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex:'1001'}}>
                    <Col style={{position:'absolute',width:'100%', bottom:windowSize>=600 ? '0' : '10%', left:'0', backgroundColor:'#232323', padding:'2em'}}>
                        <Button onClick={takecurrentphotochannel} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left', display:'flex', justifyContent:'center', alignItems:'center'}}><Camera style={{marginTop:'-5px', marginRight:'1em'}}></Camera>Take new picture</Button>
                        <input type='file' accept="image/*" id='selectpicturechannel' onChange={selectcurrentphotochannel} className='d-none'></input>
                        <label htmlFor='selectpicturechannel' style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left', display:'flex', justifyContent:'center', alignItems:'center',  paddingTop:'0.5em', paddingBottom:'0.5em', borderRadius:'6px', cursor:'pointer'}}><CardImage style={{marginTop:'-5px', marginRight:'1em'}}></CardImage>Select new picture</label>
                        <Button onClick={deletecurrentphotochannel} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', textAlign:'left', display:'flex', justifyContent:'center', alignItems:'center'}}><Trash3 style={{marginTop:'-5px', marginRight:'1em'}}></Trash3>Delete picture</Button>
                        <XCircle onClick={() => closechangephotochannel()} style={{position:'absolute', top:'10px', right:'10px',  cursor:'pointer'}} size='25'></XCircle>
                    </Col>
                </Container>
            </Container>
                <Col className={confirmdeletepostchannel ? 'text text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'#eee', overflowY:'scroll', paddingTop:'10%', zIndex:'1001'}}>
                    <h4 className='mb-3 mt-3'>Delete Squeal</h4>
                    <p>Are you sure you want to delete this squeal? It will be no longer visible to anyone!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deletepostchannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deletepostchannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col> 
                <Col className={confirmdeletemessagechannel ? 'text text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'#eee', zIndex:'1001'}}>
                    <h4 className='mb-3'>Delete Message</h4>
                    <p>Are you sure you want to delete this automatic message? It will be no longer usable for anyone!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deletemessagechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deletemessagechannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col>
                <Col className={confirmdeletechannel ? 'text text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'#eee', zIndex:'1001'}}>
                    <h4 className='mb-3'>Delete Channel</h4>
                    <p>Are you sure you want to delete this channel? It will be no longer usable for anyone!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deletechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deletechannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col> 
                <Col className={confirmleavechannel ? 'text text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'#eee', zIndex:'1001'}}>
                    <h4 className='mb-3'>Leave Channel</h4>
                    <p>Are you sure you want to leave this channel? You won't be able to read the channel squeals!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => leavechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => leavechannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col>
                <Col className={sectiondeleteprofile ? 'text text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'#eee', overflowY:'scroll', paddingTop:'10%', zIndex:'1001'}}>
                    <h4 className='mb-3 mt-3'>Delete Profile</h4>
                    <p>Are you sure you want to delete your account? You will unable to access with this credentials!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deleteprofile(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deleteprofile(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col> 
                <Col className={confirmaddmessagechannel ? 'text text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'3%',backgroundColor:'#eee', overflowY:'scroll'}}>
                    <h4 className='mb-3'>Add message</h4>
                    <Container className="container mt-3 d-flex flex-row" style={{justifyContent:'center', flexWrap:'wrap'}}>
                        <Dropdown onSelect={(eventKey) => setSelection(eventKey)} className='mb-1'>
                            <Dropdown.Toggle variant="info">
                            {selection || "Select an option"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                            <Dropdown.Item eventKey="Welcome">Welcome</Dropdown.Item>
                            <Dropdown.Item eventKey="Answer">Answer</Dropdown.Item>
                            <Dropdown.Item eventKey="Repeat">Repeat</Dropdown.Item>
                            <Dropdown.Item eventKey="Casual Images">Casual Images</Dropdown.Item>
                            <Dropdown.Item eventKey="News">News</Dropdown.Item>
                            <Dropdown.Item eventKey="WikiInfo">Wiki info</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Container>
                    { (selection==="Welcome" || selection==="Answer" || selection==="Select an option" || selection===null) && (
                    <Card className='mt-5' style={{width:'70%', minHeight:'200px', backgroundColor:'white', border:'1px solid green', borderRadius:'12px', marginLeft:'15%'}}>
                        <Card.Body className='d-flex flex-column' style={{alignItems:'center'}}>
                            <textarea placeholder='Message text' style={{width:'100%', padding:'0.5em', backgroundColor:'transparent', border:'0',  resize:'none'}} value={newmessagetext} onChange={changenewmessagetext}></textarea>
                            {capturedImage && (
                              <div style={{ position: 'relative', width: '300px', maxHeight: '300px', overflow: 'hidden' }}>
                                <img src={capturedImage} alt="Taken" width="200px" />
                                <button onClick={() => {setCapturedImage(null); newmessage.body.photo='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}} className="btn btn-sm btn-danger" style={{ position: 'absolute', top: '10px', right: '60px' }}>X</button>
                              </div>
                            )} 
                            {capturedVideo && (
                              <div style={{ position: 'relative', width: '300px', maxHeight: '300px', overflow: 'hidden' }}>
                                <video src={capturedVideo} alt="Taken" width="200px" controls/>
                                <button onClick={() => {setCapturedVideo(null); newmessage.body.video=''}} className="btn btn-sm btn-danger" style={{ position: 'absolute', top: '10px', right: '60px' }}>X</button>
                              </div>
                            )} 
                            {isMapVisible &&(
                                <Card style={{ width: '70%', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
                                    <MapContainer center={positionMap} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                                            <Marker position={positionMap} icon={markerIcon}>
                                                <Popup>Sei qui!</Popup>
                                            </Marker>
                                    </MapContainer>
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                                        <Button variant="danger" onClick={() => {setIsMapVisible(false); setPositionMap(null); newmessage.body.position=[]}}>X</Button>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                                        <Button variant="light" onClick={() => {const url = `https://www.google.com/maps/search/?api=1&query=${positionMap[0]},${positionMap[1]}`; window.open(url, '_blank');}}>Open Map</Button>
                                    </div>
                                </Card>
                            )}
                            {displayedLink && (
                                <div style={{ marginTop: '10px', wordBreak: 'break-all', width:'100%', display:'flex', alignItems:'center', justifyContent:'left'}}>
                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                    <Button variant="danger" className='ms-3' onClick={() => {setDisplayedLink(null); newmessage.body.link=''}}>X</Button>
                                </div>
                            )}
                        </Card.Body>
                        <Card.Footer>
                            <LinkLogo size={25} color='black' className='me-3' style={{cursor:'pointer'}} onClick={() => setShowLinkModal(true)}></LinkLogo>
                            <Camera size={25} color='black' className='me-3' style={{cursor:'pointer'}} onClick={takephotonewmessage}></Camera>
                            <CameraVideo size={25} color='black' className='me-3' style={{cursor:'pointer'}} onClick={takevideonewmessage}></CameraVideo>
                            <GeoAlt size={25} color="black" style={{cursor:'pointer'}} onClick={() => {if (!isMapVisible) {handleLocationButtonClick()}}}/>
                        </Card.Footer>
                    </Card>
                            )}
                    {selection === "Answer" && (
                    <Card className='mt-5' style={{width:'70%', minHeight:'50px', backgroundColor:'white', border:'1px solid green', borderRadius:'12px', marginLeft:'15%'}}>
                        <Card.Body>
                                <textarea placeholder='/Request message' style={{width:'100%', padding:'0.5em', backgroundColor:'transparent', border:'0',  resize:'none', outline:'none'}} value={newmessage.request} onChange={changenewmessagerequest}/>
                        </Card.Body>
                    </Card>
                    )}
                    {selection === "Repeat" && (
                    <Card className='mt-5' style={{width:'70%', minHeight:'50px', backgroundColor:'white', border:'1px solid green', borderRadius:'12px', marginLeft:'15%'}}>
                        <Card.Body>
                                <input type="number" placeholder='Number of seconds' style={{width:'100%', padding:'0.5em', backgroundColor:'transparent', border:'0',  resize:'none', outline:'none'}} value={numSeconds} onChange={changenewmessageseconds}/>
                        </Card.Body>
                    </Card>
                    )}
                    {(selection === "Casual Images" || selection === "WikiInfo" || selection === "News" || selection === "Twitter") && (
                    <Card className='mt-5' style={{width:'70%', minHeight:'50px', backgroundColor:'black', border:'1px solid green', borderRadius:'12px', marginLeft:'15%'}}>
                        <Card.Body>
                                <textarea placeholder='/Request message' style={{width:'100%', padding:'0.5em', backgroundColor:'transparent', border:'0',  resize:'none', outline:'none'}} value={userRequest} onChange={changenewmessageuserrequest}/>
                        </Card.Body>
                    </Card>
                    )}
                    <Row className='mt-4 mb-4' style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => sectionaddmessagechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>Back</Button>
                        <Button onClick={() => sectionaddmessagechannel(true)} style={{width:'20%'}} className='mt-3'>Add</Button>
                    </Row>
                </Col>
            <Container className={viewKeyword ? '' : 'd-none'} style={{position:'absolute',width:'100%', left:'0', height:'100vh', paddingTop:'10px',backgroundColor:'#eee', color: "black",overflow:'hidden'}}>
                <Button style={{position:'absolute', top:'10px', left:'10px'}} onClick={closeViewKeyword}>Back</Button>
                <Button style={{position:'absolute', top:'10px', right:'10px'}} onClick={subscribekeyword}>{inKeyword ? "Unsubscribe" : "Subscribe"}</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <Col style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid black', overflow:'hidden'}}>
                        { newPhotoKeyword!='' ? 
                        (<Image src={newPhotoKeyword} style={{height:'100%', width:'100%', marginTop:positionKeyword.y, marginLeft:positionKeyword.x}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', mixBlendMode:'screen'}}></Image>)}
                    </div>
                    </Col>
                    <Container style={{ maxWidth: '800px', alignItems:'center'}} className="d-flex flex-column mt-3">
                        <Row className='d-flex flex-row' style={{width:'100%', justifyContent:'center'}}>
                            <p className='mb-3' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'black', width: '50%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>{newNameKeyword}</p>
                        </Row>
                        <textarea spellCheck='false' readOnly className='textareaprofile' value={newBioKeyword} style={{borderRadius: '14px', resize:'none', backgroundColor: 'transparent', color: 'black', width: '100%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', height:'50px'}}></textarea>
                    </Container>
                    <hr style={{width:'100%',  height:'2px', marginBottom:'0'}}/>
                    <Row  style={{width:'50%', justifyContent:'center'}}>
                        <Button className='active' style={{width:'150px', height:'40px', color: "black",  background:'transparent', border:'0', borderRadius:'0px'}}>Posts</Button>
                    </Row>
                    <Container className="text-center text mt-3"  style={{overflowY:'scroll', height:'100vh'}}>
                        <Row className='row-cols-2'>
                        {newKeywordPosts.map((squeal,index) => (
                        <Col key={index} className='m-5' style={{width:'40%'}}>
                            <Card style={{borderColor:'black', width:'500px', minHeight:'200px', marginBottom:'5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                                    <CardGroup>
                                    { squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                                    <Image src={squeal.photoprofile} style={{height:'100%', width:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle size='30' color='black' className='me-3'></PersonCircle>
                                    }
                                    {squeal.sender}
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
                                {squeal.body.video!='' && (
                                <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <video src={squeal.body.video} alt="Squeal video" width="100%" controls/>
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
                                <Card.Footer className='d-flex' style={{justifyContent:'end'}}>
                                  <div className='d-flex'>
                                      <Card.Text className='me-1' style={{cursor:'default'}}>
                                      {squeal.pos_reactions}
                                      </Card.Text>
                                      <Image src={'/squealer-app'+pos_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+pos_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+pos_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Card.Text style={{marginLeft:'17px', cursor:'default'}} className='me-1'>
                                      {squeal.neg_reactions}
                                      </Card.Text>
                                      <Image src={'/squealer-app'+neg_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+neg_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+neg_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                  </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                                ))}
                        </Row>
                    </Container>
                </Col>
              </Container>
        </Container>
        
        <Modal show={showCameraModal} style={{position:'absolute', top:'0', width:'80%', left:'20%', height:'100%'}} onHide={() => setShowCameraModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Take a photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%"/>
                <Button className="mt-2" onClick={capture}>Take</Button>
            </Modal.Body>
        </Modal>
        <Modal show={showCameraModalchannel} style={{position:'absolute', top:'0', left:'20%', width:'80%', height:'100%'}} onHide={() => setShowCameraModalchannel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Take a photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Webcam audio={false} ref={webcamRef2} screenshotFormat="image/jpeg" width="100%"/>
          <Button className="mt-2" onClick={capturechannel}>Take</Button>
        </Modal.Body>
        </Modal>
        <Modal show={showCameraModalmessage} style={{position:'absolute', top:'0', left:'20%', width:'80%', height:'100%'}} onHide={() => setShowCameraModalmessage(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Take a photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Webcam audio={false} ref={webcamRef3} screenshotFormat="image/jpeg" width="100%"/>
            <Button className="mt-2" onClick={capturemessage}>Take</Button>
            <input type="file" id="selectpicturewebcam" class="d-none" accept="image/*" onChange={loadImage}></input>
            <label htmlFor="selectpicturewebcam" class="btn btn-primary mt-2 ms-2">Select picture</label>
            </Modal.Body>
        </Modal>
        <Modal show={showCameraVideoModalmessage} onHide={() => setShowCameraVideoModalmessage(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Carica un video</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mt-2">
                  <label className="btn btn-primary">
                    Carica video
                    <input 
                      type="file" 
                      hidden 
                      onChange={handleVideoChange}
                      accept="video/*"
                    />
                  </label>
                </div>
              </Modal.Body>
            </Modal>
        <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Insert a Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <FormControl placeholder="Inserisci il tuo link qui" value={inputLink} onChange={handleInputChange}/>
                    <InputGroup.Text>
                        <Button variant="primary" onClick={handleSubmitLink}>Send</Button>
                            {displayedLink && (
                                <Button variant="danger" className="ms-2" onClick={() => {setDisplayedLink(''); setinputLink('');}}>Rimuovi</Button>
                            )}
                    </InputGroup.Text>
                </InputGroup>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default Profile;
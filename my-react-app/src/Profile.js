import React, { useState, useRef, useEffect} from 'react';
import { Navbar, Container, Nav, Form, InputGroup, FormControl, Button, Dropdown, Card, Row, Col, Modal, Image, CardGroup} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Routes, useLocation} from 'react-router-dom';
import './App.css';
import Webcam from 'react-webcam';
import { Camera, Globe, Link as LinkLogo, Gear, NodeMinus, PersonCircle, BoxArrowLeft, BoxArrowInDown, Trash3, XCircle, CardImage, PatchCheckFill } from 'react-bootstrap-icons';
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
import {getUsers, getListChannels, getUserById, getListSqueals, getActualUser, updateUsers, updateChannels, updateSqueals, addUser, addSqueal, addChannel} from './serverRequests.js';

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
    const webcamRef = useRef(null);
    const webcamRef2 = useRef(null);
    const webcamRef3 = useRef(null);
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
    const [reminder, setReminder] = useState(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [positionMap, setPositionMap] = useState(null);
    const markerIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconAnchor: [12, 41]
      });
    const [capturedImage, setCapturedImage] = useState(null);
    const [newmessage, setNewmessage] = useState({body:{text:'', position:[], link:'', photo:''}, request:'', type:'', remind:{}})
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
    }, [allSqueals, actualuser, allchannels, allCHANNELS, allkeywords])

    const opendeletesqueal = (index) => {
        setindexsquealtodelete(index);
        setconfirmdeletesqueal(true);
    }

    const deletesqueal = (eliminate) => {
        if(eliminate){
        const newallSqueals = [...allSquealsprint];
        const newSqueals = allSqueals.filter(squeal => !((squeal.sender==allSquealsprint[indexsquealtodelete].sender)&(squeal.date==allSquealsprint[indexsquealtodelete].date)&(squeal.hour==allSquealsprint[indexsquealtodelete].hour)&(squeal.seconds==allSquealsprint[indexsquealtodelete].seconds)));
        newallSqueals.splice(indexsquealtodelete, 1);
        setallSquealsprint(newallSqueals);
        setallSqueals(newallSqueals);
        localStorage.setItem("newSqueals",JSON.stringify(newSqueals));
        //salvare i valori degli squeal
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
            //salva modifiche actualuser, allusers, allchannels, allCHANNELS e allkeyword
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
            //salva modifiche canali
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
            let newlistchannel;
            let newlistCHANNEL;
            for(let i=0; i<allchannels.length; i++){
                if(allchannels[i].name==allChannelsprint[indexchanneledit].name){
                    newlistchannel = allchannels.splice(i,1);
                }
            }
            for(let i=0; i<allCHANNELS.length; i++){
                if(allCHANNELS[i].name==allChannelsprint[indexchanneledit].name){
                    newlistCHANNEL = allCHANNELS.splice(i,1);
                }
            }
            setallCHANNELS(newlistCHANNEL);
            setallchannels(newlistchannel);
            //bisogna salvare le modifiche dei canali
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

    const leavechannel = (confirm) => {
        if(confirm){
            seteditchannelvisible(false);
            for(let i=0; i<allChannelsprint[indexchanneledit].list_users.length;i++){
                if((allChannelsprint[indexchanneledit].list_users[i].nickname==actualuser.nickname)&((allChannelsprint[indexchanneledit].list_users[i].type=='Creator')|(allChannelsprint[indexchanneledit].list_users[i].type=='Modifier'))){
                    let channeladmin = n_channeladmin-1;
                    setn_channeladmin(channeladmin);
                }
            }
            let newlistchannel;
            let newlistCHANNEL;
            for(let i=0; i<allchannels.length; i++){
                if(allchannels[i].name==allChannelsprint[indexchanneledit].name){
                    for(let j=0;j<allchannels[i].list_users.length;j++){
                        if(allchannels[i].list_users[j].nickname==actualuser.nickname){
                            newlistchannel = allchannels[i].list_users.splice(j,1);
                        }
                    }
                }
            }
            for(let i=0; i<allCHANNELS.length; i++){
                if(allCHANNELS[i].name==allChannelsprint[indexchanneledit].name){
                    for(let j=0;j<allCHANNELS[i].list_users.length;j++){
                        if(allCHANNELS[i].list_users[j].nickname==actualuser.nickname){
                            newlistCHANNEL = allCHANNELS[i].list_users.splice(j,1);
                        }
                    }
                }
            }
            setallCHANNELS(newlistCHANNEL);
            setallchannels(newlistchannel);
            //bisogna salvare le modifiche dei canali
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
        setIsMapVisible(false); 
        setPositionMap([]);
        setDisplayedLink(null);
        setNewmessagetext('');
        setNewmessage({body:{text:'', position:[], link:'', photo:''}, request:'', type:'', remind:{}})
        setSelection("Select an option");
        setReminder("Select reminder frequency");
        } else {
            alert("You don't have permissions to modify this channel");
        }
    }

    const sectionaddmessagechannel = (confirm) => {                 //salvare messaggio gruppo
        if(confirm){
            if((newmessage.body.text!='')|(newmessage.body.link!='')|(newmessage.body.photo!='')|(newmessage.body.position.length!=0)){
                switch(selection){
                    case "Welcome":
                        setnewchannelmessages(prevmess => ([...prevmess, {
                            body: {
                                text: newmessage.body.text,
                                position: newmessage.body.position,
                                link: newmessage.body.link,
                                photo:newmessage.body.photo,
                            },
                            request: '',
                            type: selection,
                            remind: {},
                        }]));
                    break;
                    case "Answer":
                        if((newmessage.request!="/")&(newmessage.request.startsWith("/"))){
                            setnewchannelmessages(prevmess => ([...prevmess, {
                                body: {
                                    text: newmessage.body.text,
                                    position: newmessage.body.position,
                                    link: newmessage.body.link,
                                    photo:newmessage.body.photo,
                                },
                                request: "to "+newmessage.request,
                                type: selection,
                                remind: {},
                            }]));
                        } else {
                            alert("Insert a valid request");
                            return;
                        }
                    break;
                    case "Reminder":
                        if(reminder!="Select reminder frequency"){
                            setnewchannelmessages(prevmess => ([...prevmess, {
                                body: {
                                    text: newmessage.body.text,
                                    position: newmessage.body.position,
                                    link: newmessage.body.link,
                                    photo:newmessage.body.photo,
                                },
                                request: '',
                                type: selection,
                                remind: {every:reminder, dayMonth:'1', dayWeek:'0', hour:'17:00'},
                            }]));
                        } else {
                            alert("Insert a valid reminder frequency");
                            return;
                        }
                    break;
                    default:
                        alert("Insert a valid message type");
                        return;
                }
                
            } else {
                alert("The message is empty");
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

    const changenewmessagerequest = (e) => {
        let text = e.target.value;
        setNewmessage(prevmess => ({
            ...prevmess,
            request: text
          }));
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
            let newlistusers;
            for(let i=0; i<allUsers.length; i++){
                        if(allUsers[i].nickname==actualuser.nickname){
                            newlistusers = allUsers.splice(i,1);
                        }
                    }
            setAllUsers(newlistusers);
            let newlistchannel;
            let newlistCHANNEL;
            let newlistkeywords;
            for(let i=0; i<allchannels.length; i++){
                if(allchannels[i].name==allChannelsprint[indexchanneledit].name){
                    for(let j=0;j<allchannels[i].list_users.length;j++){
                        if(allchannels[i].list_users[j].nickname==actualuser.nickname){
                            newlistchannel = allchannels[i].list_users.splice(j,1);
                        }
                    }
                }
            }
            for(let i=0; i<allCHANNELS.length; i++){
                if(allCHANNELS[i].name==allChannelsprint[indexchanneledit].name){
                    for(let j=0;j<allCHANNELS[i].list_users.length;j++){
                        if(allCHANNELS[i].list_users[j].nickname==actualuser.nickname){
                            newlistCHANNEL = allCHANNELS[i].list_users.splice(j,1);
                        }
                    }
                }
            }
            for(let i=0; i<allkeywords.length; i++){
                if(allkeywords[i].name==allChannelsprint[indexchanneledit].name){
                    for(let j=0;j<allkeywords[i].list_users.length;j++){
                        if(allkeywords[i].list_users[j].nickname==actualuser.nickname){
                            newlistkeywords = allkeywords[i].list_users.splice(j,1);
                        }
                    }
                }
            }
            setallCHANNELS(newlistCHANNEL);
            setallchannels(newlistchannel);
            setallkeywords(newlistkeywords);
            setactualuser(null);
                                                            //fare
            //salva i valori degli user
            //torna alla pagina di accesso 
        }
        setSectiondeleteprofile(false);
    } 
    
    const profilepostsactive = () => {
        setmypostsactive(true);
        setmychannelsactive(false);
        setmycharacteractive(false);
    }

    const profilechannelsactive = () => {
        setmypostsactive(false);
        setmychannelsactive(true);
        setmycharacteractive(false);
    }

    const profilecharacteractive = () => {
        setmypostsactive(false);
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
          setInKeyword(!inKeyword);
    }

    return (
        <>
        <Container style={{ width: '80%', left:'20%', height: '100vh', position:'absolute', alignItems: 'center', overflow:'hidden'}} className="d-flex flex-column">
            <header className='d-flex flex-column text-center' style={{width:'100%', alignItems:'center'}}>
                { actualuser.photoprofile!='' ? (<div className='mt-4' style={{width:'70px',height:'70px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}}>
                <Image src={actualuser.photoprofile} style={{height:'100%', position:'relative', marginTop: actualuser.photoprofileY, marginLeft: actualuser.photoprofileX}}></Image>
                </div>)
                : <PersonCircle size='70' color='white' className='mt-4'></PersonCircle>
                }
                <h4 className="text-white mt-3">{actualuser.nickname}</h4>
                <Row className='mt-3' style={{width:'60%', justifyContent:'space-between'}}>
                    <p className='text-white' style={{width:'50%', padding:'0'}}>{allSquealsprint.length} post published</p>
                    <p className='text-white' style={{width:'50%', padding:'0'}}>{allChannelsprint.length} channels of which {n_channeladmin} admin</p>
                </Row>
                <p className='text-white' style={{width:'90%', padding:'0'}}>{actualuser.bio}</p>
                <Button onClick={() => editprofile()} style={{position:'absolute', top:'20px', right:'20px', backgroundColor:'#696969', borderColor:'white'}}>Edit Profile</Button>
            </header>
            <hr style={{width:'100%', color:'white', height:'2px', marginBottom:'0'}}></hr>
            <Row  style={{width:'40%', justifyContent:'space-between'}}>
                <Button className={`${mypostsactive ? 'active' : ''}`} style={{width:'150px', height:'40px', color:'white', background:'transparent', border:'0', borderRadius:'0px'}} onClick={profilepostsactive}>My posts</Button>
                <Button className={`${mychannelsactive ? 'active' : ''}`} style={{width:'150px', height:'40px', color:'white', background:'transparent', border:'0', borderRadius:'0px'}} onClick={profilechannelsactive}>My channels</Button>
                <Button className={`${mycharacteractive ? 'active' : ''}`} style={{width:'150px', height:'40px', color:'white', background:'transparent', border:'0', borderRadius:'0px'}} onClick={profilecharacteractive}>My characters</Button>
            </Row>
            <Container className="text-center text-white mt-5" style={{overflowY:'scroll'}}>
                <Row className={`${mypostsactive ? 'row-cols-2' : 'd-none row-cols-2'}`} >
                {allSquealsprint.map((squeal,index) => (
                <Col key={index} className='m-5 mt-3' style={{width:'40%'}}>
                    <Card style={{backgroundColor:'black', color:'white', borderColor:'white', width:'500px', minHeight:'200px', marginBottom:'5%'}}>
                        <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                            <CardGroup>
                            { actualuser.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={actualuser.photoprofile} style={{height:'100%', position:'relative', marginTop: actualuser.photoprofileY/2.5, marginLeft: actualuser.photoprofileX/2.5}}></Image>
                            </div>)
                            : <PersonCircle size='30' color='white' className='me-3'></PersonCircle>
                            }
                            {squeal.sender}
                            </CardGroup>
                            <Card.Text>{squeal.date+" "+squeal.hour}</Card.Text>
                        </Card.Header>
                        <Card.Body>
                        <Card.Text style={{textAlign:'left'}}>
                                    {squeal.body.text}
                                </Card.Text>
                                {squeal.body.photo!='' && (
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
                        <Button className='mb-1' onClick={() => opendeletesqueal(index)}>Delete</Button>
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
                <Row style={{width:'70%', marginLeft:'20%'}} className={`${mychannelsactive ? 'row-cols-2' : 'd-none row-cols-2'}`} >
                {allChannelsprint.map((channel,index) => (
                    <Row key={index} onClick={() => editchannel(index)} className='m-5 d-flex rowchannel_profile' style={{width:'35%',justifyContent:'center',alignItems:'center',cursor:'pointer', borderRadius:'12px', padding:'5px'}}>
                        <div style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}}>
                        { channel.photoprofile!='' ? 
                        (<Image src={channel.photoprofile} style={{height:'100%', marginTop:channel.photoprofileY, marginLeft:channel.photoprofileX}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', mixBlendMode:'screen'}}></Image>)}
                        </div>
                        <h4 style={{color:'white',width:'60%',textAlign:'left',marginLeft:'10px'}}>{channel.name}</h4>
                    </Row>
                ))}
                </Row>
                <Col className={`${mycharacteractive ? '' : 'd-none'}`} >
                    <h5 className='pb-4'>Daily characters remaining: {actualuser.char_d}</h5>
                    <h5 className='pb-4'>Weekly characters remaining: {actualuser.char_w}</h5>
                    <h5>Monthly characters remaining: {actualuser.char_m}</h5>
                </Col>
            </Container>
            <Col className={confirmdeletesqueal ? 'text-white text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'black'}}>
                <h4 className='mb-3'>Delete Squeal</h4>
                <p>Are you sure you want to delete this squeal? It will no longer visible to anyone!</p>
                <Row style={{display:'flex',justifyContent:'center'}}>
                    <Button onClick={() => deletesqueal(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                    <Button onClick={() => deletesqueal(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                </Row>
            </Col>   
            <Container className={editprofilevisible ? '' : 'd-none'} style={{position:'absolute',width:'100%',height:'100vh', paddingTop:'10px',backgroundColor:'black',overflow:'hidden'}}>
                <Button onClick={() => closeeditprofile(false)} className='me-3'><BoxArrowLeft className='me-2' style={{marginTop:'-2px'}}></BoxArrowLeft>Back</Button>
                <Button onClick={() => closeeditprofile(true)} className='me-3'><BoxArrowInDown className='me-2' style={{marginTop:'-4px'}}></BoxArrowInDown>Save</Button>
                <Button onClick={() => {setSectiondeleteprofile(true)}}>Delete</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <h3 className='text-white'>Edit Profile</h3>
                    { newphotoprofile!='' ? (<div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}} className='mt-4'>
                    <Image src={newphotoprofile} onMouseDown={handleMouseDown} style={{height:'100%', position:'relative', marginTop:position.y, marginLeft:position.x, cursor: dragging ? 'grabbing' : 'grab'}}></Image>
                    </div>)
                    : <PersonCircle size='85' color='white' className='mt-4'></PersonCircle>
                    }
                    <Button onClick={openchangephoto} className='mt-4'>Change photo</Button>
                    <Container style={{ maxWidth: '800px'}} className="d-flex flex-column mt-3">
                        <Row className='row-cols-2' style={{display:'flex', flexDirection:'row'}}>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluenickname} value={newnickname} placeholder='Nickname' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'white', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', marginLeft:'10%'}}>
                            </input>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluefullname} value={newfullname} placeholder='Fullname' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'white', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>
                            </input>
                            <input type='mail' className='texteditprofile mb-3' onChange={changevaluemail} value={newmail} placeholder='Mail' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'white', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', marginLeft:'10%'}}>
                            </input>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluepassword} value={newpassword} placeholder='Password' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'white', width: '40%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>
                            </input>
                        </Row>
                        <textarea spellCheck='false' className='texteditprofile' onChange={changevaluebio} value={newbio} placeholder='Bio' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'white', width: '100%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', height:'100px', resize:'none'}}>

                        </textarea>
                    </Container>
                </Col>
                <Container className={opensectionchangephoto ? '' : 'd-none'} style={{position:'absolute', width:'100%', height:'100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', top:'0', left:'0'}}>
                    <Col style={{position:'absolute',width:'100%', bottom:'0', left:'0', backgroundColor:'#232323', padding:'2em'}}>
                        <Button onClick={takecurrentphoto} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left', paddingLeft:'29%'}}><Camera style={{marginTop:'-5px', marginRight:'1em'}}></Camera>Take new picture</Button>
                        <input type='file' id='selectpicture' onChange={selectcurrentphoto} className='d-none'></input>
                        <label htmlFor='selectpicture' style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left', paddingLeft:'29%', color:'white', paddingTop:'0.5em', paddingBottom:'0.5em', borderRadius:'6px', cursor:'pointer'}}><CardImage style={{marginTop:'-5px', marginRight:'1em'}}></CardImage>Select new picture</label>
                        <Button onClick={deletecurrentphoto} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', textAlign:'left', paddingLeft:'29%'}}><Trash3 style={{marginTop:'-5px', marginRight:'1em'}}></Trash3>Delete picture</Button>
                        <XCircle onClick={() => closechangephoto()} style={{position:'absolute', top:'10px', right:'10px', color:'white', cursor:'pointer'}} size='25'></XCircle>
                    </Col>
                </Container>
            </Container>

            <Container className={editchannelvisible ? '' : 'd-none'} style={{position:'absolute',width:'100%',height:'100vh', paddingTop:'10px',backgroundColor:'black',overflow:'hidden'}}>
                <Button onClick={() => closeeditchannel(false)} className='me-3'><BoxArrowLeft className='me-2' style={{marginTop:'-2px'}}></BoxArrowLeft>Back</Button>
                <Button onClick={() => closeeditchannel(true)} className='me-3'><BoxArrowInDown className='me-2' style={{marginTop:'-4px'}}></BoxArrowInDown>Save</Button>
                <Button onClick={isCreator ? opendeletechannel : openleavechannel}>{isCreator ? 'Delete Channel' : 'Leave Channel'}</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <Col style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <h3 className='text-white'>Edit Channel</h3>
                    <div onMouseMove={handleMouseMovechannel} onMouseUp={handleMouseUpchannel} style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}}>
                        { newphotochannel!='' ? 
                        (<Image onMouseDown={handleMouseDownchannel} src={newphotochannel} style={{height:'100%', marginTop:positionchannel.y, marginLeft:positionchannel.x, cursor: draggingchannel ? 'grabbing' : 'grab'}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', mixBlendMode:'screen'}}></Image>)}
                    </div>
                    <Button onClick={openchangephotochannel} className='mt-4'>Change photo</Button>
                    </Col>
                    <Container style={{ maxWidth: '800px', alignItems:'center'}} className="d-flex flex-column mt-3">
                        <Row className='d-flex flex-row' style={{width:'100%', justifyContent:'center'}}>
                            <input type='text' className='texteditprofile mb-3' onChange={changevaluenamechannel} value={newnamechannel} placeholder='Name' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'white', width: '50%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}></input>
                            <label className="switch" style={{width:'30%', padding:'0.5em'}}>
                                <p style={{color:'white', width:'50%'}}>Silenceable</p>
                                <input type="checkbox" onChange={changesilenceablechannel} style={{cursor:'pointer'}}/>
                                <span className="slider"></span>
                            </label>
                        </Row>
                        <textarea spellCheck='false' className='texteditprofile' onChange={changevaluebiochannel} value={newbiochannel} placeholder='Bio' style={{borderRadius: '14px', resize:'none', backgroundColor: 'transparent', color: 'white', width: '100%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', height:'50px'}}></textarea>
                    </Container>
                    <hr style={{width:'100%', color:'white', height:'2px', marginBottom:'0'}}/>
                    <Row  style={{width:'50%', justifyContent:'space-between'}}>
                        <Button className={`${channelpostsactive ? 'active' : ''}`} style={{width:'150px', height:'40px', color:'white', background:'transparent', border:'0', borderRadius:'0px'}} onClick={sectionchannelpostsactive}>Posts</Button>
                        <Button className={`${channelusersactive ? 'active' : ''}`} style={{width:'150px', height:'40px', color:'white', background:'transparent', border:'0', borderRadius:'0px'}} onClick={sectionchannelusersactive}>Users</Button>
                        <Button className={`${channelmessagesactive ? 'active' : ''}`} style={{width:'150px', height:'40px', color:'white', background:'transparent', border:'0', borderRadius:'0px'}} onClick={sectionchannelmessagesactive}>Messages</Button>
                    </Row>
                    <Container className="text-center text-white mt-3"  style={{overflowY:'scroll', height:'100vh'}}>
                        <Row className={`${channelpostsactive ? 'row-cols-2' : 'd-none row-cols-2'}`}>
                        {newchannelposts.map((squeal,index) => (
                        <Col key={index} className='m-5' style={{width:'40%'}}>
                            <Card style={{backgroundColor:'black', color:'white', borderColor:'white', width:'500px', minHeight:'200px', marginBottom:'5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                                    <CardGroup>
                                    { squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                                    <Image src={squeal.photoprofile} style={{height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle size='30' color='white' className='me-3'></PersonCircle>
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
                        <Row className={`${channelmessagesactive ? 'row-cols-2 d-flex' : 'd-none'}`}>
                        {newchannelmessages.map((squeal,index) => (
                        <Col key={index} className='m-5' style={{width:'40%'}}>
                            <Card style={{backgroundColor:'black', color:'white', borderColor:'white', width:'500px', minHeight:'200px', marginBottom:'5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                                    <CardGroup>
                                    {squeal.type} {squeal.remind.every} {squeal.request}
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
                        <Container style={{backgroundColor:'black', color:'white', borderColor:'white', width:'500px', minHeight:'200px', marginBottom:'5%', marginTop:'100px'}}>
                            <Button onClick={addmessagechannel} style={{width:'150px', height:'50px'}}>Add Message</Button>
                        </Container>
                        </Row>
                        <Col style={{width:'80%',marginLeft:'10%'}} className={`${channelusersactive ? 'row-cols-2' : 'd-none row-cols-2'}`} >
                        {newchannelusers.map((channeluser,index2) => (
                            <Row key={index2} className='mt-3 d-flex' style={{width:'70%',justifyContent:'center',alignItems:'center', borderRadius:'12px', padding:'5px', marginLeft:'15%'}}>
                                { channeluser.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden', padding:'0'}}>
                                    <Image src={channeluser.photoprofile} style={{height:'100%', position:'relative', marginTop:channeluser.photoprofileY/2.5, marginLeft:channeluser.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle size='30' color='white' className=' mt-0' style={{maxWidth:'10%'}}></PersonCircle>
                                    }
                                <p style={{color:'white',width:'40%',textAlign:'left', paddingTop:'15px'}}>{channeluser.nickname}</p>
                                <Button style={{width:'20%', marginRight:'3%'}} onClick={() => changetypeuserchannel(index2)}>{channeluser.type}</Button>
                                <Button style={{width:'20%'}} onClick={() => changeblockuserchannel(index2)}>{`${channeluser.block ? 'Blocked' : 'Unblocked'}`}</Button>
                            </Row>
                        ))}
                        </Col>
                    </Container>
                </Col>
                
                <Container className={opensectionchangephotochannel ? '' : 'd-none'} style={{position:'absolute', width:'100%', height:'100%', top:'0', left:'0', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex:'1001'}}>
                    <Col style={{position:'absolute',width:'100%', bottom:'0', left:'0', backgroundColor:'#232323', padding:'2em'}}>
                        <Button onClick={takecurrentphotochannel} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left', paddingLeft:'29%'}}><Camera style={{marginTop:'-5px', marginRight:'1em'}}></Camera>Take new picture</Button>
                        <input type='file' accept="image/*" id='selectpicturechannel' onChange={selectcurrentphotochannel} className='d-none'></input>
                        <label htmlFor='selectpicturechannel' style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', marginBottom:'1em', textAlign:'left', paddingLeft:'29%', color:'white', paddingTop:'0.5em', paddingBottom:'0.5em', borderRadius:'6px', cursor:'pointer'}}><CardImage style={{marginTop:'-5px', marginRight:'1em'}}></CardImage>Select new picture</label>
                        <Button onClick={deletecurrentphotochannel} style={{backgroundColor:'#69696976', width:'70%', marginLeft:'15%', border:'0', textAlign:'left', paddingLeft:'29%'}}><Trash3 style={{marginTop:'-5px', marginRight:'1em'}}></Trash3>Delete picture</Button>
                        <XCircle onClick={() => closechangephotochannel()} style={{position:'absolute', top:'10px', right:'10px', color:'white', cursor:'pointer'}} size='25'></XCircle>
                    </Col>
                </Container>
            </Container>
                <Col className={confirmdeletepostchannel ? 'text-white text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'black', overflowY:'scroll', paddingTop:'10%', zIndex:'1001'}}>
                    <h4 className='mb-3 mt-3'>Delete Squeal</h4>
                    <p>Are you sure you want to delete this squeal? It will be no longer visible to anyone!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deletepostchannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deletepostchannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col> 
                <Col className={confirmdeletemessagechannel ? 'text-white text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'black', zIndex:'1001'}}>
                    <h4 className='mb-3'>Delete Message</h4>
                    <p>Are you sure you want to delete this automatic message? It will be no longer usable for anyone!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deletemessagechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deletemessagechannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col>
                <Col className={confirmdeletechannel ? 'text-white text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'black', zIndex:'1001'}}>
                    <h4 className='mb-3'>Delete Channel</h4>
                    <p>Are you sure you want to delete this channel? It will be no longer usable for anyone!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deletechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deletechannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col> 
                <Col className={confirmleavechannel ? 'text-white text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'10%',backgroundColor:'black', zIndex:'1001'}}>
                    <h4 className='mb-3'>Leave Channel</h4>
                    <p>Are you sure you want to leave this channel? You won't be able to read the channel squeals!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => leavechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => leavechannel(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col>
                <Col className={sectiondeleteprofile ? 'text-white text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'black', overflowY:'scroll', paddingTop:'10%', zIndex:'1001'}}>
                    <h4 className='mb-3 mt-3'>Delete Profile</h4>
                    <p>Are you sure you want to delete your account? You will unable to access with this credentials!</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => deleteprofile(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => deleteprofile(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Col> 
                <Col className={confirmaddmessagechannel ? 'text-white text-center' : 'd-none'} style={{position:'absolute',width:'100%',height:'100%',paddingTop:'3%',backgroundColor:'black', overflowY:'scroll'}}>
                    <h4 className='mb-3'>Add message</h4>
                    <Container className="container mt-3 d-flex flex-row" style={{justifyContent:'center'}}>
                        <Dropdown onSelect={(eventKey) => setSelection(eventKey)}>
                            <Dropdown.Toggle variant="info">
                            {selection || "Select an option"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                            <Dropdown.Item eventKey="Welcome">Welcome</Dropdown.Item>
                            <Dropdown.Item eventKey="Answer">Answer</Dropdown.Item>
                            <Dropdown.Item eventKey="Reminder">Reminder</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {selection === "Reminder" && (
                            <div className="ms-3">
                            <Dropdown onSelect={(eventKey) => setReminder(eventKey)}>
                                <Dropdown.Toggle variant="info">
                                {reminder || "Select reminder frequency"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                <Dropdown.Item eventKey="every day">every day</Dropdown.Item>
                                <Dropdown.Item eventKey="every week">every week</Dropdown.Item>
                                <Dropdown.Item eventKey="every month">every month</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            </div>
                        )}
                    </Container>
                    <Card className='mt-5' style={{width:'70%', minHeight:'200px', backgroundColor:'black', border:'1px solid green', borderRadius:'12px', marginLeft:'15%'}}>
                        <Card.Body className='d-flex flex-column' style={{alignItems:'center'}}>
                            <textarea placeholder='Message text' style={{width:'100%', padding:'0.5em', backgroundColor:'transparent', border:'0', color:'white', resize:'none'}} value={newmessagetext} onChange={changenewmessagetext}></textarea>
                            {capturedImage && (
                              <div style={{ position: 'relative', width: '300px', maxHeight: '300px', overflow: 'hidden' }}>
                                <img src={capturedImage} alt="Taken" width="100%" />
                                <button onClick={() => {setCapturedImage(null); newmessage.body.photo=''}} className="btn btn-sm btn-danger" style={{ position: 'absolute', top: '10px', right: '10px' }}>X</button>
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
                            <Camera size={25} color='white' className='me-3' style={{cursor:'pointer'}} onClick={takephotonewmessage}></Camera>
                            <LinkLogo size={25} color='white' className='me-3' style={{cursor:'pointer'}} onClick={() => setShowLinkModal(true)}></LinkLogo>
                            <Globe size={25} color="white" style={{cursor:'pointer'}} onClick={() => {if (!isMapVisible) {handleLocationButtonClick()}}}/>
                        </Card.Footer>
                    </Card>
                    {selection === "Answer" && (
                    <Card className='mt-5' style={{width:'70%', minHeight:'50px', backgroundColor:'black', border:'1px solid green', borderRadius:'12px', marginLeft:'15%'}}>
                        <Card.Body>
                                <textarea placeholder='/Request message' style={{width:'100%', padding:'0.5em', backgroundColor:'transparent', border:'0', color:'white', resize:'none'}} value={newmessage.request} onChange={changenewmessagerequest}/>
                        </Card.Body>
                    </Card>
                    )}
                    <Row className='mt-4 mb-4' style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => sectionaddmessagechannel(false)} style={{width:'20%'}} className='me-3 mt-3'>Back</Button>
                        <Button onClick={() => sectionaddmessagechannel(true)} style={{width:'20%'}} className='mt-3'>Add</Button>
                    </Row>
                </Col>




            <Container className={viewKeyword ? '' : 'd-none'} style={{position:'absolute',width:'100%', left:'0', height:'100vh', paddingTop:'10px',backgroundColor:'black',overflow:'hidden'}}>
                <Button style={{position:'absolute', top:'10px', left:'10px'}} onClick={closeViewKeyword}>Back</Button>
                <Button style={{position:'absolute', top:'10px', right:'10px'}} onClick={subscribekeyword}>{inKeyword ? "Unsubscribe" : "Subscribe"}</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <Col style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden'}}>
                        { newPhotoKeyword!='' ? 
                        (<Image src={newPhotoKeyword} style={{height:'100%', marginTop:positionKeyword.y, marginLeft:positionKeyword.x}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', mixBlendMode:'screen'}}></Image>)}
                    </div>
                    </Col>
                    <Container style={{ maxWidth: '800px', alignItems:'center'}} className="d-flex flex-column mt-3">
                        <Row className='d-flex flex-row' style={{width:'100%', justifyContent:'center'}}>
                            <p className='mb-3' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'white', width: '50%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>{newNameKeyword}</p>
                        </Row>
                        <textarea spellCheck='false' readOnly className='textareaprofile' value={newBioKeyword} style={{borderRadius: '14px', resize:'none', backgroundColor: 'transparent', color: 'white', width: '100%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', height:'50px'}}></textarea>
                    </Container>
                    <hr style={{width:'100%', color:'white', height:'2px', marginBottom:'0'}}/>
                    <Row  style={{width:'50%', justifyContent:'center'}}>
                        <Button className='active' style={{width:'150px', height:'40px', color:'white', background:'transparent', border:'0', borderRadius:'0px'}}>Posts</Button>
                    </Row>
                    <Container className="text-center text-white mt-3"  style={{overflowY:'scroll', height:'100vh'}}>
                        <Row className='row-cols-2'>
                        {newKeywordPosts.map((squeal,index) => (
                        <Col key={index} className='m-5' style={{width:'40%'}}>
                            <Card style={{backgroundColor:'black', color:'white', borderColor:'white', width:'500px', minHeight:'200px', marginBottom:'5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                                    <CardGroup>
                                    { squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                                    <Image src={squeal.photoprofile} style={{height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle size='30' color='white' className='me-3'></PersonCircle>
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
            <Modal.Title>Scatta una foto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%"/>
                <Button className="mt-2" onClick={capture}>Scatta</Button>
            </Modal.Body>
        </Modal>
        <Modal show={showCameraModalchannel} style={{position:'absolute', top:'0', left:'20%', width:'80%', height:'100%'}} onHide={() => setShowCameraModalchannel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Scatta una foto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Webcam audio={false} ref={webcamRef2} screenshotFormat="image/jpeg" width="100%"/>
          <Button className="mt-2" onClick={capturechannel}>Scatta</Button>
        </Modal.Body>
        </Modal>
        <Modal show={showCameraModalmessage} style={{position:'absolute', top:'0', left:'20%', width:'80%', height:'100%'}} onHide={() => setShowCameraModalmessage(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Scatta una foto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Webcam audio={false} ref={webcamRef3} screenshotFormat="image/jpeg" width="100%"/>
            <Button className="mt-2" onClick={capturemessage}>Scatta</Button>
            </Modal.Body>
        </Modal>
        <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Inserisci Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <FormControl placeholder="Inserisci il tuo link qui" value={inputLink} onChange={handleInputChange}/>
                    <InputGroup.Text>
                        <Button variant="primary" onClick={handleSubmitLink}>Invia</Button>
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
import React, { useState, useRef, useEffect} from 'react';
import { Container, Form, InputGroup, FormControl, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import './App.css';
import './CreateMessage.css';
import { Camera, Globe, Link as LinkLogo, PersonCircle } from 'react-bootstrap-icons';
import Webcam from 'react-webcam';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {getUsers, updateUser, getListChannels, updateChannels, getUserById, getListSqueals, getRandomTweet, getActualUser, addSqueal, addChannel, updateChannel} from './serverRequests.js';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';


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

// Funzione per debouncare le chiamate (evita chiamate troppo frequenti)
const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

function CreateMessage(props) {
  const [showIcon, setShowIcon] = useState(true);
  const [suggestedProfiles, setSuggestedProfiles] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  const [disabledSendButton, setDisabledSendButton] = useState(false);


  /*Creazione messaggio*/
  const [showMessageCreation, setShowMessageCreation] = useState(false);
  const [messageType, setMessageType] = useState('Squeal');  
  const [squealOrChannelOption, setSquealOrChannelOption] = useState('Public');  
  const [text, setText] = useState('#');
  const [charCount, setCharCount] = useState(1);
  const [squealChatTextareaValue, setSquealChatSecondTextareaValue] = useState('');
  const [actualUser, setActualUser] = useState(null);
  const [maxChar, setMaxChar] = useState(); 
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [allchannels, setallchannels] = useState([]);
  const [allCHANNELS, setallCHANNELS] = useState([]);
  const [allkeywords, setallkeywords] = useState([]);
  const [allChannelsprint, setallChannelsprint] = useState([]);
  const [allKeywordssprint, setallkeywordsprint] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [existedChannel, setExistedChannel] = useState(false);
  let [foundChannel, setFoundChannel] = useState(null);
  const [extraCharModal, setExtraCharModal] = useState(false);
  const [isExtraCharUsed, setIsExtraCharUsed] = useState(false);

  /*Private Messagge*/
  const [privateSquealChatTextareaValue, setPrivateSquealChatTextareaValue] = useState('');
  const [privateWordsRemaining, setPrivateWordsRemaining] = useState(200);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState(''); // Stato per l'input di ricerca
  const [suggestedUsers, setSuggestedUsers] = useState([]); // Stato per gli utenti suggeriti
  const [selectedUsers, setSelectedUsers] = useState([]); // Stato per gli utenti selezionati
  const [sortedSuggestedUsers, setSortedSuggestedUsers] = useState([]);
  const maxCharsPrivate = 200;

  /*Scrivi canale*/
  const [channelSearch, setChannelSearch] = useState(''); // Per tenere traccia dell'input di ricerca
  const [suggestedChannels, setSuggestedChannels] = useState([]); // Canali suggeriti in base alla ricerca
  const [showAreYouSureWrite, setShowAreYouSureWrite] = useState(false);
  const [channelSelected, setChannelSelected] = useState(null);
  const [typeChannel, setTypeChannel] = useState('');
  const [defaultMessageSearch, setDefaultMessageSearch] = useState('');
  const [suggestedDefaultMessages, setSuggestedDefaultMessages] = useState([]);
  const [isDefaultMessageValid, setIsDefaultMessageValid] = useState(false)
  const [showDefaultMessage, setShowDefaultMessage] = useState(false);

  /*Creazione messaggi funzioni comuni*/
  const [wordsRemaining, setWordsRemaining] = useState(maxChar);
  // const [counterColor, setCounterColor] = useState('');
  const [isTextModified, setIsTextModified] = useState(false);
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationVisible, setIsLocationVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [address, setAddress] = useState('');
  const [showFileSelectionModal, setShowFileSelectionModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [inputLIink, setinputLIink] = useState('');
  const [displayedLink, setDisplayedLink] = useState(''); 
  const windowSize = useWindowSize();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [photoProfile, setPhotoProfile] = useState('');
  const [nicknameProfile, setNicknameProfile] = useState('');
  const navigate = useNavigate();



  /*Crea canale*/
  const [searchTerm2, setSearchTerm2] = useState('');
  const [selectedUsers2, setSelectedUsers2] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false); // Stato per controllare la visualizzazione del modale
  const [showTextarea, setShowTextarea] = useState(false);
  const [showDeafaultMessagge, setShowDeafaultMessagge] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [isSilenceable, setIsSilenceable] = useState(false);
  const [channelDescription, setChannelDescription] = useState('');
  const [channelUsers, setChannelUsers] = useState([]); 
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [creatorDetails, setCreatorDetails] = useState(null);
  const actualUserId = JSON.parse(localStorage.getItem("actualUserId"));
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);

    /*Crea canale - Reminder*/
    const [showReminderTextarea, setShowReminderTextarea] = useState(false);
    const [isReminderTextModified, setIsReminderTextModified] = useState(false);
    const [reminderTextareaValue, setReminderTextareaValue] = useState('');
    const [reminderPosition, setReminderPosition] = useState(null);
    const [isReminderMapVisible, setIsReminderMapVisible] = useState(false);
    const [reminderImage, setReminderImage] = useState(null);
    const [reminderLink, setReminderLink] = useState(null);
    const [showReminderLinkModal, setShowReminderLinkModal] = useState(false);
    /*beep acustico*/
    const beep = (frequency = 520, duration = 200, volume = 1, type = 'sine') => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
    
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
    
      gainNode.gain.value = volume;
      oscillator.frequency.value = frequency;
      oscillator.type = type;
    
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration * 0.001); // Converti millisecondi in secondi
    };
    /*funzione per il beep*/
    const playBeep = () => {
      beep(520, 200, 1, 'sine'); // Produce un beep di 520Hz per 200ms
    };  

    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
      const data = new Date();
      let month = '';
  
      if ((data.getMonth() + 1) < 10) {
        month = '0' + (data.getMonth() + 1);
      } else {
        month = (data.getMonth() + 1).toString();
      }
  
      const year = data.getFullYear();
      const day = data.getDate() < 10 ? `0${data.getDate()}` : data.getDate().toString();
  
      const dateStr = `${year}-${month}-${day}`;
      setFormattedDate(dateStr);
    }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getActualUser(); 
        setActualUser(userData);
        setMaxChar(userData.char_d);
        const initialWordsRemaining = userData.char_d - squealChatTextareaValue.length;
        setPhotoProfile(userData.photoprofile);
        setNicknameProfile(userData.nickname);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }    
    fetchUserData();
  }, []);

  useEffect(() => {
      const remaining = calculateCharCount();
      const remainingPrivate = calculatePrivateCharCount();
      setWordsRemaining(remaining);
      setPrivateWordsRemaining(remainingPrivate);
    }, [maxCharsPrivate, maxChar, squealChatTextareaValue, capturedImage, displayedLink, position, searchInput, capturedVideo]);
  
  useEffect(() => {
    const initialPrivateWordsRemaining = calculatePrivateCharCount();
    setPrivateWordsRemaining(initialPrivateWordsRemaining);
  }, [maxCharsPrivate, privateSquealChatTextareaValue, capturedImage, displayedLink, position, capturedVideo]);

  useEffect(() => {
    if (searchInput) {
      debouncedSearchUsers(searchInput);
    } else {
      setSuggestedUsers([]); 
    }
  }, [searchInput]);
  
  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        const userData = await getUserById(actualUserId);
        const creatorDetails = {
          blocked: false, 
          cell: userData.cell || "",
          char_d: userData.char_d || 300,
          char_m: userData.char_m || 7000,
          char_w: userData.char_w || 2000,
          email: userData.email,
          fullname: userData.fullname,
          nickname: userData.nickname,
          notification: userData.notification || [true, true, true, true],
          password: userData.password,
          photoprofile: userData.photoprofile || "",
          photoprofileX: userData.photoprofileX || 0,
          photoprofileY: userData.photoprofileY || 0,
          popularity: userData.popularity || 0,
          type: "Creator", 
          version: userData.version || "user",
          _id: userData._id,
        };
        setCreatorDetails(creatorDetails);
      } catch (error) {
        console.error('Error while retrieving creator details: ', error);
      }
    };
  
    fetchCreatorDetails();
  }, [actualUserId]);

  useEffect(() => {
    const getAll4 = async () => {
      try {
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
            default:
              console.log("Error in loading type in channels");
              break;
          }
        });
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }; 
    getAll4();
  }, []); //Mi da tutti i channel
  
  useEffect(() => {
    setallChannelsprint([]);
    setallkeywordsprint([]);
  
    for (let i = 0; i < allchannels.length; i++) {
      for (let j = 0; j < allchannels[i].list_users.length; j++) {
        if (allchannels[i].list_users[j].nickname === nicknameProfile) {
          setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint, allchannels[i]]);
          console.log(allchannels[i]);
        }
      }
    }
  
    for (let i = 0; i < allCHANNELS.length; i++) {
      for (let j = 0; j < allCHANNELS[i].list_users.length; j++) {
        if ((allCHANNELS[i].list_users[j].nickname === nicknameProfile) && ((allCHANNELS[i].list_users[j].type === 'Modifier')|(allCHANNELS[i].list_users[j].type === 'Creator'))) {
          setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint, allCHANNELS[i]]);
        }
      }
    }
  
    for (let i = 0; i < allkeywords.length; i++) {
      for (let j = 0; j < allkeywords[i].list_users.length; j++) {
        if (allkeywords[i].list_users[j].nickname === nicknameProfile) {
          setallkeywordsprint(prevallchannelsprint => [...prevallchannelsprint, allkeywords[i]]);
        }
      }
    }
    
  }, [actualUser, allchannels, allCHANNELS, allkeywords]); 
  
 
  /*---------------------------------------------------------------------Funzioni Default------------------------------------------------------------------------*/
  /*funzioni per iniziare e finire un intervallo per i messaggi ripetuti*/
  const [intervalId, setIntervalId] = useState(null);
  let counter = 0;

  useEffect(() => {
    // Funzione che avvia o ferma l'intervallo in base ai dati del localStorage
    updateInterval();
  
    // Aggiungi l'event listener per l'evento 'storage'
    window.addEventListener('storage', updateInterval);
  
    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener('storage', updateInterval);
    };
  }, []);

  const updateInterval = () => {
    const secToRepeat = localStorage.getItem("secToRepeat");
    if (secToRepeat) {
      startInterval(parseInt(secToRepeat));
    } else {
      stopInterval();
    }
  };
  
  const startInterval = (n) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      const id = setInterval(() => {
        let counter = localStorage.getItem("Counter");
        counter++;
        localStorage.setItem("Counter", counter);
        alert("This message is the number : " + counter);
        try {
          const tempBodyInterval =  {
            text: 'This message is the number : ' + counter,
            link: '',
            photo: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            video: '',
            position: '',
          }
          handleSendChannelDefaultSqueal(tempBodyInterval);
          playBeep();
        } catch (error) {
          console.error('Error during the interval: ', error);
        }
      }, n*1000);
  
      setIntervalId(id);
  };
  
  const stopInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      window.location.reload();
    }
  };

  function randomUnsplashImage(width, height) {
    return(`https://source.unsplash.com/random/${width}x${height}`);
  }

  const fetchRandomNews = async () => {
    try {
      const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/general/us.json');
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.articles.length);
      const article = data.articles[randomIndex];
      return article;
    } catch (error) {
      console.error('Error fetching news:', error);
      return null;
    }
  };

  const fetchRandomWikiArticle = async () => {
    const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=1&origin=*";
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      const title = data.query.random[0].title;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      
      return pageUrl;
    } catch (error) {
      console.error('Error fetching random Wikipedia article:', error);
      return null;
    }
  };

  /*--------------------------------------------------------------------Comuni--------------------------------------------------------------------------------------*/
  const resetAttachments = () => {
    setPosition(null);
    setCapturedImage(null);
    setCapturedVideo(null);
    setDisplayedLink(null);
  }

  const resetForm = () => {
    if (messageType === 'Squeal' && squealOrChannelOption === 'Public') {
      setText('#');
      setCharCount(1);
      setSquealChatSecondTextareaValue('');
      resetAttachments();
    } else if (messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      setPrivateSquealChatTextareaValue('');
      setPrivateWordsRemaining(maxCharsPrivate);
      resetAttachments();
      selectedUsers.length = 0;
    } else if (messageType === 'Channel' && squealOrChannelOption === 'Write') {
      setText('@');
      setChannelSearch('');
      setCharCount(1);
      setSquealChatSecondTextareaValue('');
      resetAttachments();
      setChannelSelected(null);
      if (isDefaultMessageValid) {
        setChannelSelected(null);
        setChannelSelectedHaveDefault(false);
        setChannelSelectedHaveRepeat(false);
        setDefaultMessageSearch('');
        setShowDefaultMessage(false);
        setIsDefaultMessageValid(false);
      }
    } else if (messageType === 'Channel' && squealOrChannelOption === 'Create') {
      setChannelName('');
      setChannelDescription('');
      setChannelUsers([]);
      setIsSilenceable(false);
      setSearchInput('');
      setShowDropdown(false);
      setSelectedUserIds([]);
      setSelectedUsers2([]);
      setSelectedUsers([]);
      selectedUserIds.length = 0;
      setShowAreYouSure(false);
    }
  };

  const handleMessageTypeChange = (e) => {
    const selectedType = e.target.value;
    setMessageType(selectedType);
    resetAttachments();

    if (selectedType === 'Channel') {
      setSquealOrChannelOption('Write');
    } else {
      setSquealOrChannelOption('Public');
    }
  };

  const handleSquealOrChannelOptionChange = (e) => {
    setSquealOrChannelOption(e.target.value);
    resetAttachments();
  };



  /*--------------------------------------------------------------------Allegati e gestione------------------------------------------------------------------------------*/
  const handleVideoChange = (e) => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Public') || (messageType === 'Channel' && squealOrChannelOption === 'Write'))) {
      const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCapturedVideo(event.target.result);
          setShowVideoModal(false);
          const remaining = calculateCharCount();
          setWordsRemaining(remaining);
        };
        reader.readAsDataURL(file);
        }
    } else if (privateWordsRemaining >= 125 && messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCapturedVideo(event.target.result);
          setShowVideoModal(false);
          const remainingPrivate = calculatePrivateCharCount();
          setPrivateWordsRemaining(remainingPrivate);
        };
        reader.readAsDataURL(file);
      }
    } else if (messageType === 'Channel' && squealOrChannelOption === 'Create') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCapturedVideo(event.target.result);
          setShowVideoModal(false);
        };
        reader.readAsDataURL(file);
      }
    } else {
      alert("You don't have enough characters available to upload a video.");
    }
  };

  const handleLogoClick = () => {
    setShowFileSelectionModal(true);
    setShowCameraModal(true);
  };
  
  const handleLocationButtonClick = () => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Public') || (messageType === 'Channel' && squealOrChannelOption === 'Write'))) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          const remaining = calculateCharCount();
          setWordsRemaining(remaining);
        }, (error) => {
          console.error(error);
        });
      } else {
        alert('La geolocalizzazione non è supportata dal tuo browser.');
      }
    } else if  (privateWordsRemaining >= 125 && messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          const remainingPrivate = calculatePrivateCharCount();
          setPrivateWordsRemaining(remainingPrivate);
        }, (error) => {
          console.error(error);
        });
      } else {
        alert('La geolocalizzazione non è supportata dal tuo browser.');
      }
    } else if (messageType === 'Channel' && squealOrChannelOption === 'Create') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        }, (error) => {
          console.error(error);
        });
      } else {
        alert('La geolocalizzazione non è supportata dal tuo browser.');
      }
    } else {
      alert("You don't have enough characters available to add a location.");
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
  });

  const handleFileChange = (e) => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Public') || (messageType === 'Channel' && squealOrChannelOption === 'Write'))) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCapturedImage(event.target.result);
          updateCharacterCounts();
        };
        reader.readAsDataURL(file);
      }
      setShowFileSelectionModal(false);
      setShowCameraModal(false);
    } else if (privateWordsRemaining >= 125 && messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCapturedImage(event.target.result);
          updateCharacterCounts();   
          const remainingPrivate = calculatePrivateCharCount();
          setPrivateWordsRemaining(remainingPrivate);
        };
        reader.readAsDataURL(file);
      }
      setShowFileSelectionModal(false);
      setShowCameraModal(false);
    } else if (messageType === 'Channel' && squealOrChannelOption === 'Create') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCapturedImage(event.target.result);
          updateCharacterCounts();
        };
        reader.readAsDataURL(file);
      }
      setShowFileSelectionModal(false);
      setShowCameraModal(false);
    
    } else {
      alert("You don't have enough characters available to upload a photo.");
    }
  };

  const capture = () => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Public') || (messageType === 'Channel' && squealOrChannelOption === 'Write'))) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCameraModal(false);
      const remaining = calculateCharCount();
      setWordsRemaining(remaining);
    } else if (privateWordsRemaining >= 125 && messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCameraModal(false);
      const remainingPrivate = calculatePrivateCharCount();
      setPrivateWordsRemaining(remainingPrivate);
    } else if (messageType === 'Channel' && squealOrChannelOption === 'Create'){
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCameraModal(false);
    } else {
      alert("You don't have enough characters available to take a photo.");
    }
  };
  
  const handleInputChange = (e) => {
    setinputLIink(e.target.value);
  };

  const handleSubmitLink = () => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Public') || (messageType === 'Channel' && squealOrChannelOption === 'Write'))) {
      if (isLink(inputLIink)) {
        setDisplayedLink(inputLIink);
        setShowLinkModal(false);
        const remaining = calculateCharCount();
        setWordsRemaining(remaining);
      } else {
        alert("Please enter a link that starts with 'http://' or 'https://'.");
      }
    } else if (privateWordsRemaining >= 125 && messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      if (isLink(inputLIink)) {
        setDisplayedLink(inputLIink);
        setShowLinkModal(false);
        const remainingPrivate = calculatePrivateCharCount();
        setPrivateWordsRemaining(remainingPrivate);
      } else {
        alert("Please enter a link that starts with 'http://' or 'https://'.");
      }
    } else if (messageType === 'Channel' && squealOrChannelOption === 'Create') {
      if (isLink(inputLIink)) {
        setDisplayedLink(inputLIink);
        setShowLinkModal(false);
      } else {
        alert("Please enter a link that starts with 'http://' or 'https://'.");
      }
    } else {
      alert("You don't have enough characters available to add a link.");
    }
  };  

  const updateCharacterCounts = () => {
    const remaining = calculateCharCount();
    const remainingPrivate = calculatePrivateCharCount();
    setWordsRemaining(remaining);
    setPrivateWordsRemaining(remainingPrivate);
  };
  
  const isLink = (string) => {
    const regex = /^(http:\/\/|https:\/\/)/;
    return regex.test(string);
  }

  /*--------------------------------------------------------------------Squeal Public------------------------------------------------------------------------------*/

  const handleInputChangeHashtag = (e) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/\s+/g, '_');
    const prefix = (messageType === 'Squeal' && squealOrChannelOption === 'Privato') ? '@' : '#';

    if (sanitizedValue.length <= 50 || inputValue === prefix) {
      setText(sanitizedValue.startsWith(prefix) ? sanitizedValue : prefix + sanitizedValue);
      setCharCount(sanitizedValue.startsWith(prefix) ? sanitizedValue.length : sanitizedValue.length + 1);
    }
  };
  
  const handleSquealChatTextareaChange = (e) => {
    const inputValue = e.target.value;
    const attachmentsLength = (capturedImage ? 125 : 0) + (displayedLink ? 125 : 0) + (position ? 125 : 0); // Calcola la lunghezza totale degli allegati
  
    // Calcola la lunghezza totale disponibile per il testo tenendo conto degli allegati
    const availableTextLength = maxChar - attachmentsLength;

    if (inputValue.length <= availableTextLength) {
        setSquealChatSecondTextareaValue(inputValue);
        const remaining = calculateCharCount();
        setWordsRemaining(remaining);
        if ((remaining === 1) && (isExtraCharUsed === false)) {
            setExtraCharModal(true);
        }
    } else {
        // Ripristina il valore della textarea all'ultimo valore valido
        setSquealChatSecondTextareaValue(squealChatTextareaValue);
        alert(`Currently you are limited by insufficient characters, to return to writing continue with the purchase of extra characters.`);
        e.preventDefault();
    }
  };

  const handleExtraChar = () => {
    setExtraCharModal(false);
    setMaxChar(maxChar + 100);
    setIsExtraCharUsed(true);
  };

  const handleSendMessage = () => {
    if (squealChatTextareaValue.trim() !== '') {
      setSquealChatSecondTextareaValue('');
      setIsTextModified(false);
    }
  };

  const calculateCharCount = () => {
    let count = maxChar - squealChatTextareaValue.length;
  
    if (capturedImage) count -= 125;
    if (capturedVideo) count -= 125;
    if (displayedLink) count -= 125;
    if (position) count -= 125;
  
    return count;
  };

  const handleUpdateUser = async (charToDeacrement) => {
    const userId = actualUser._id; 
    const userUpdates = {
        char_d: actualUser.char_d - charToDeacrement,
        char_w: actualUser.char_w - charToDeacrement,
        char_m: actualUser.char_m - charToDeacrement,
    };
    // const tempChar = maxChar - charToDeacrement;
    // setMaxChar(tempChar);
    // setWordsRemaining(tempChar);

    try {
        const result = await updateUser(userId, userUpdates);
        console.log(result.message); 
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
  };

  const controlChannel = () => {
    const textWithoutHashtag = text.replace(/#/g, '');
    console.log(getListChannels().find(channel => (channel.name === textWithoutHashtag && channel.type === '#')));
    const foundChannel = allkeywords.find(channel => (channel.name === textWithoutHashtag && channel.type === '#'));
    //allKeywordssprint.find(channel => channel.name === textWithoutHashtag);
    
    if (foundChannel) {
      const flagg = foundChannel.list_users;
      if (!(flagg.find(user => user.nickname === nicknameProfile))) {
        flagg.push(`@${nicknameProfile}`);
      }
      setDisabledSendButton(true);
      handleSendSqueal(foundChannel, true, flagg);
    } else {
      setExistedChannel(false);
      setListOfUsers([nicknameProfile]);
      setDisabledSendButton(true);
      handleSendSqueal(foundChannel, false, [nicknameProfile]);
    }

  };

  const handleCreateHashtagChannel = async (squealData) => {
    const channelData = {
      creator: nicknameProfile,
      photoprofile: '',
      photoprofilex: 0,
      photoprofiley: 0,
      name: text.replace(/#/g, ''),
      type: '#',
      list_mess: [],
      list_users: [
        {
          blocked: false,
          cell: actualUser.cell || "",
          char_d: actualUser.char_d || 300,
          char_m: actualUser.char_m || 7000,
          char_w: actualUser.char_w || 2000,
          email: actualUser.email,
          fullname: actualUser.fullname,
          nickname: nicknameProfile,
          notification: actualUser.notification || [true, true, true, true, true],
          password: actualUser.password,
          photoprofile: photoProfile || "",
          photoprofileX: actualUser.photoprofileX || 0,
          photoprofileY: actualUser.photoprofileY || 0,
          popularity: actualUser.popularity || 0,
          type: actualUser.type || "User",
          version: actualUser.version || "user",
          _id: actualUser._id,
        }
      ],
      list_posts: [
        {
          answers: [],
          body: {
            text: squealChatTextareaValue, 
            link: displayedLink || '', 
            photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
            video: capturedVideo || '', 
            position: position  || '', 
          },
          category: null,
          date: new Date().toLocaleDateString(),
          hour: squealData.hour,
          impressions: 0,
          neg_reactions: 0,
          photoprofile: photoProfile,
          pos_reactions: 0,
          receivers: [`@${nicknameProfile}`],
          seconds: squealData.seconds,
          sender: nicknameProfile,
          typesender: 'keywords',
          usersReactions: [],
          usersViewed: [],
        }
      ],
      usersSilenced: [],
      description: "",
      popularity: "",
    };
    try {
      const result = await addChannel(channelData);
      setallkeywords(allkeywordsprev => [...allkeywordsprev, channelData]);
      console.log('Channel created:', result);
    } catch (error) {
      console.error('Error in channel creation::', error);
    }
  };

  async function addPostToHashtag(channelName, post, userToAdd) {
    const getAllChannels = await getListChannels(); 
      // Trova l'indice del canale nell'array `channels` che corrisponde al `channelName` dato
    const channelIndex = getAllChannels.findIndex(channel => channel.name === channelName);
    
      // Se il canale è stato trovato...
      if (channelIndex !== -1) {
        if ( userToAdd !== null) {
          getAllChannels[channelIndex].list_users.push(userToAdd);
          getAllChannels[channelIndex].list_posts.push(post);
          const tempListPost = getAllChannels[channelIndex].list_posts;
          const tempListUser = getAllChannels[channelIndex].list_users;
          const updateTemp = {list_posts: tempListPost, list_users: tempListUser};
          await updateChannel(getAllChannels[channelIndex]._id, updateTemp);
        } else {
          getAllChannels[channelIndex].list_posts.push(post);
          const tempListPost = getAllChannels[channelIndex].list_posts;
          const updateTemp = {list_posts: tempListPost};
          await updateChannel(getAllChannels[channelIndex]._id, updateTemp);
        }
        console.log(`Post aggiunto al canale ${channelName}.`);
    } else {
      console.log(`Canale ${channelName} non trovato.`);
    }
  }

  const handleUpdateHashTagChannel = async (channelToUpdate, squealData) => {
    const channelDataUpdatePost = {
      answers: [],
      body: {
        text: squealChatTextareaValue, 
        link: displayedLink || '', 
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
        video: capturedVideo || '', 
        position: position  || '', 
      },
      category: null,
      date: new Date().toLocaleDateString(),
      hour: squealData.hour,
      impressions: 0,
      neg_reactions: 0,
      photoprofile: photoProfile,
      pos_reactions: 0,
      receivers: channelToUpdate.list_users.map(user => `@${user.nickname}`),
      seconds: squealData.seconds,
      sender: nicknameProfile,
      typesender: 'keywords',
      usersReactions: [],
      usersViewed: [],
    }

    let userToAdd = null;
    if (!(channelToUpdate.list_users.find(user => user.nickname === nicknameProfile))){
      userToAdd = {
        blocked: false,
        cell: actualUser.cell || "",
        char_d: actualUser.char_d || 300,
        char_m: actualUser.char_m || 7000,
        char_w: actualUser.char_w || 2000,
        email: actualUser.email,
        fullname: actualUser.fullname,
        nickname: nicknameProfile,
        notification: actualUser.notification || [true, true, true, true, true],
        photoprofile: photoProfile || "",
        photoprofileX: actualUser.photoprofileX || 0,
        photoprofileY: actualUser.photoprofileY || 0,
        popularity: actualUser.popularity || 0,
        type: actualUser.type || "User",
        version: actualUser.version || "user",
        _id: actualUser._id,
      };
    } 

    try {
      const result = await addPostToHashtag(channelToUpdate.name,  channelDataUpdatePost, userToAdd);
      console.log('Canale update:', result);
    } catch (error) {
      console.error('Error during the upadate of channel:', error);
    }
  };

  const handleSendSqueal = async (channelToUpdate, flag, flagg) => {
    const receiversFlagg = flagg.map(user => user.nickname);
    if ((!(flagg.find(user => user.nickname === nicknameProfile))) && (!(flagg.find(user => user.nickname === `@${nicknameProfile}`)))){
      receiversFlagg.push(nicknameProfile);
    }
    const squealData = {
      sender: nicknameProfile, 
      typesender: 'keywords', 
      body: {
        text: squealChatTextareaValue, 
        link: displayedLink || '', 
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
        video: capturedVideo || '', 
        position: position  || '', 
      },
      photoprofile: photoProfile, 
      date: new Date().toLocaleDateString(),
      hour: formattedTime,
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', 
      receivers: flag === false ? [actualUser.nickname] : receiversFlagg,
      channel: text.replace(/#/g, ''),
      impressions: 0,
    };
  
    try {
      if (flag === true) {
        await handleUpdateHashTagChannel(channelToUpdate, squealData);
      } else {
        await handleCreateHashtagChannel(squealData);
      }
      const result = await addSqueal(squealData);
      console.log('Squeal send:', result);
      const textChars = squealData.body.text.length; 
      let imageChars = 0;
      let videoChars = 0;
      let linkChars = 0;
      let positionChars = 0;
      if (squealData.body.photo !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
        imageChars = squealData.body.photo ? 125 : 0; 
      } else {
        imageChars = 0;
      }
      if (squealData.body.video !== '') {
        videoChars = squealData.body.video ? 125 : 0; 
      } else {
        videoChars = 0;
      }
      if (squealData.body.link !== '') {
        linkChars = squealData.body.link ? 125 : 0; 
      } else {
        linkChars = 0;
      }
      if (squealData.body.position !== '') {
        positionChars = squealData.body.position ? 125 : 0; 
      } else {
        positionChars = 0;
      }
      const usedChars = textChars + imageChars + videoChars + linkChars + positionChars; 

      await handleUpdateUser(usedChars);
      // window.location.reload();
      setSquealChatSecondTextareaValue('');
      setWordsRemaining(maxChar);
      resetForm();
      setDisabledSendButton(false);
      goToProfile();
    } catch (error) {
      console.error('Errore during the squeal sending ', error);
      window.location.reload();
      setDisabledSendButton(false);
    }
  };


  /*--------------------------------------------------------------------Squeal Private------------------------------------------------------------------------------*/
  const handleUserSelection = (user, user_id) => {
    if (selectedUsers.includes(user)) {
        setSelectedUsers(prevUsers => prevUsers.filter(u => u !== user));
        setSelectedUserIds(prevIds => prevIds.filter(id => id !== user_id));
    } else {
        if (messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
          if (selectedUsers.length < 3) {
              setSelectedUsers(prevUsers => [...prevUsers, user]);
          } else {
              alert('You can select up to 3 users.');
          }
        } else if (messageType === 'Channel' && squealOrChannelOption === 'Create')  {
          setSelectedUsers(prevUsers => [...prevUsers, user]);
          setSelectedUserIds(prevIds => [...prevIds, user_id]);
        }
    }
    setSearchInput(''); 
    setSuggestedUsers([]); 
  }

  const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestedUsers([]); 
      return;
    }
  
    try {
      const users = await getUsers(searchTerm); 
      setSuggestedUsers(users.filter(user => user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) && user.nickname!==actualUser.nickname));
    } catch (error) {
      console.error('Error during the users research', error);
    }
  };
  
  const debouncedSearchUsers = debounce(searchUsers, 300);

  useEffect(() => {
    if (searchInput) {
      debouncedSearchUsers(searchInput);
    } else {
      setSuggestedUsers([]); 
    }
  }, [searchInput]);

  const handlePrivateSquealChatTextareaChange = (e) => {
    const inputValue = e.target.value;

      const availableTextLength = maxCharsPrivate - (capturedImage ? 125 : 0) - (displayedLink ? 125 : 0) - (position ? 125 : 0) - (capturedVideo ? 125 : 0);
    
      if (inputValue.length <= availableTextLength) {
        setPrivateSquealChatTextareaValue(inputValue);
        const remainingPrivate = calculatePrivateCharCount();
        setPrivateWordsRemaining(remainingPrivate);
      } else {
        console.log(`You cannot enter more than ${availableTextLength} characters.`);
        e.preventDefault();
      }
  };

  const calculatePrivateCharCount = () => {
   
    const attachmentsLength = (capturedImage ? 125 : 0) + (displayedLink ? 125 : 0) + (position ? 125 : 0) + (capturedVideo ? 125 : 0);
    const totalLength = maxCharsPrivate - privateSquealChatTextareaValue.length - attachmentsLength;
    
    return totalLength;
  };

  const handleSendPrivateSqueal = async () => {
    setDisabledSendButton(true);
    const squealData = {
      sender: nicknameProfile, 
      typesender: 'Users', 
      body: {
        text: privateSquealChatTextareaValue, 
        link: displayedLink || '',
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
        video: capturedVideo || '', 
        position: position  || '', 
      },
      photoprofile: photoProfile, 
      date: new Date().toLocaleDateString(),
      hour: formattedTime,
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', 
      receivers: selectedUsers.map(user => `@${user}`), 
      channel: '', 
      impressions: 0,
    };
  
    try {
      const result = await addSqueal(squealData);
      console.log('Squeal send:', result);
      // window.location.reload();
      resetForm();
      setDisabledSendButton(false);
      goToProfile();
    } catch (error) {
      console.error('Error during the squeal sendind: ', error);
      setDisabledSendButton(false);
      window.location.reload();
    }
  }; 
  


  /*--------------------------------------------------------------------Scrivi canale------------------------------------------------------------------------------*/
  const handleChannelSearchChange = async (e) => {
    const searchValue = e.target.value;
    setChannelSearch(searchValue);
  
    if (!searchValue) {
      setSuggestedChannels([]);
      return;
    }
  
    try {
      setSuggestedChannels(allChannelsprint.filter(channel => channel.name.toLowerCase().includes(searchValue.toLowerCase())));
    } catch (error) {
      console.error('Error fetching channel list:', error);
    }
  };
  
  const [channelSelectedHaveDefault, setChannelSelectedHaveDefault] = useState(false);
  const [channelSelectedHaveRepeat, setChannelSelectedHaveRepeat] = useState(false);
  const [channelType, setChannelType] = useState(''); 

  const handleChannelSelection = (channel) => {
    setChannelSearch(channel.name); 
    setSuggestedChannels([]); 
    if ( channel.list_mess.length > 0) {
      setChannelSelectedHaveDefault(true);
      if(channel.list_mess.find(message => message.type === 'Repeat')) {
        setChannelSelectedHaveRepeat(true);
      }
    }
    if (channel.type === '&') {
      setChannelType('channels');
    } else if (channel.type === '$') {
      setChannelType('CHANNELS');
    }
  };

  async function updateAllChannels(ChannelsToUpdate){
    try{
      const Channels = await getListChannels();
      const ChannelsUpdated = Channels.map(oggetto1 => {
        const chan = ChannelsToUpdate.find(oggetto2 => oggetto2.name === oggetto1.name);
        return chan ? chan : oggetto1;
      });
      await updateChannels(ChannelsUpdated);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
  }

  async function addPostToChannel(channelName, post) {
    const getAllChannels = await getListChannels(); 
      // Trova l'indice del canale nell'array `channels` che corrisponde al `channelName` dato
    const channelIndex = getAllChannels.findIndex(channel => channel.name === channelName);
    
      // Se il canale è stato trovato...
      if (channelIndex !== -1) {
        // Aggiunge il `post` all'array `list_posts` del canale trovato
        getAllChannels[channelIndex].list_posts.push(post);
        const tempListPost = getAllChannels[channelIndex].list_posts;
        const updateTemp = {list_posts: tempListPost};
        await updateChannel(getAllChannels[channelIndex]._id, updateTemp);
        console.log(`Post aggiunto al canale ${channelName}.`);
    } else {
      console.log(`Canale ${channelName} non trovato.`);
    }
  }

  const handleUpdateChannelPosts = async (channelSelectedToUpdate, squealData) => {
    const channelDataUpdatePost = {
      answers: [],
      body: {
        text: squealChatTextareaValue, 
        link: displayedLink || '', 
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        video: capturedVideo || '', 
        position: position  || '', 
      },
      category: null,
      date: new Date().toLocaleDateString(),
      hour: squealData.hour,
      impressions: 0,
      neg_reactions: 0,
      pos_reactions: 0,
      photoprofile: photoProfile || '',
      receivers: channelSelected.list_users.map(user => `@${user.nickname}`),
      seconds: squealData.seconds,
      sender: nicknameProfile,
      typesender: channelType,
      usersReactions: [],
      usersViewed: [],
    }

    try {
      const resultChannel = await addPostToChannel(channelSelectedToUpdate.name, channelDataUpdatePost);
      console.log('Channels update succesfuly:', resultChannel);
    } catch (error) {
      console.error('Error in the channel updating:', error);
    }
  };

  const handleSendChannelSqueal = async () => {
    setDisabledSendButton(true);
    if (channelSelected) {
      const squealData = {
      sender: nicknameProfile, 
      typesender: channelType, 
      body: {
        text: squealChatTextareaValue, 
        link: displayedLink || '', 
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
        video: capturedVideo || '', 
        position: position  || '',
      },
      photoprofile: photoProfile || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
      date: new Date().toLocaleDateString(),
      hour: formattedTime,
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '',
      receivers: channelSelected.list_users.map(user => `@${user.nickname}`), 
      channel: channelSelected.name,
      impressions: 0,
      };

      try {
        const resultAddSqueal = await addSqueal(squealData);
        await handleUpdateChannelPosts(channelSelected, squealData);
        console.log('Squeal send:', resultAddSqueal);
        const textChars = squealData.body.text.length; 
        let imageChars = 0;
        let videoChars = 0;
        let linkChars = 0;
        let positionChars = 0;
        if (squealData.body.photo !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
          imageChars = squealData.body.photo ? 125 : 0; 
        } else {
          imageChars = 0;
        }
        if (squealData.body.video !== '') {
          videoChars = squealData.body.video ? 125 : 0; 
        } else {
          videoChars = 0;
        }
        if (squealData.body.link !== '') {
          linkChars = squealData.body.link ? 125 : 0; 
        } else {
          linkChars = 0;
        }
        if (squealData.body.position !== '') {
          positionChars = squealData.body.position ? 125 : 0; 
        } else {
          positionChars = 0;
        }
        const usedChars = textChars + imageChars + videoChars + linkChars + positionChars; 
        handleUpdateUser(usedChars); 
        // window.location.reload();
        resetForm();
        setDisabledSendButton(false);
        goToProfile();
        } catch (error) {
          console.error('Error during the squeal sending in the channel', error);
          setDisabledSendButton(false);
          window.location.reload();
        }
    } else {
      alert("Please select a channel to send the message.");
      setDisabledSendButton(false);
    }
  };
  

  useEffect(() => {
    if (defaultMessageSearch) {
      const searchPattern = new RegExp(`${defaultMessageSearch}`, 'i');  //Crea un pattern di ricerca basato sul valore di defaultMessageSearch e lo utilizza per cercare corrispondenze in una stringa in modo case-insensitive
      const filteredMessages = channelSelected?.list_mess.filter(message => 
        message.request.split('/').pop().match(searchPattern)
      );
      setSuggestedDefaultMessages(filteredMessages);
    } else {
      setSuggestedDefaultMessages([]);
    }
  }, [defaultMessageSearch, channelSelected]);

  const handleDefaultMessageSelection = (message) => {
    setDefaultMessageSearch(message);
    setIsDefaultMessageValid(true);
  };

  const cleanDefaultMessageSelection = () => {
    setDefaultMessageSearch('');
    setIsDefaultMessageValid(false);
  };
  
  const processDefaultMessageType = async () => {
    switch (defaultMessageSearch.type) {
      case 'Answer':
        handleSendChannelDefaultSqueal(defaultMessageSearch.body);
        break;
      case 'Casual Images':
        const tempBodyImages =  {
          text: '',
          link: '',
          photo: randomUnsplashImage(300, 300),
          video: '',
          position: '',
        }
        handleSendChannelDefaultSqueal(tempBodyImages);
        break;
      case 'News':
        try {
          const article = await fetchRandomNews();
          if (article) { 
            if (article.author === null) {
              article.author = "Unknown";
            };
            const tempBodyNews =  {
              text: "Author: " + article.author + "\n" + article.content + "\nPublished at: " + article.publishedAt,
              link: article.url || '',
              photo: article.urlToImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
              video: '',
              position: '',
            }
            handleSendChannelDefaultSqueal(tempBodyNews);
          } else {
            console.error('No article found.');
          }
        } catch (error) {
          console.error('Errore nel recupero delle notizie:', error);
        }
        break;
      case 'WikiInfo':
        try {
          const wiki = await fetchRandomWikiArticle();
          const tempBodyWiki =  {
            text: 'Did you know that: ',
            link: wiki|| '',
            photo: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            video: '',
            position: '',
          }
          handleSendChannelDefaultSqueal(tempBodyWiki);
        } catch (error) {
          console.error('Error in retrieving information from Wikipedia:', error);
        }
        break;
      default:
    }
  }

  const processRepeatMessage = async () => {
    setDisabledSendButton(true);
    const repeat = channelSelected.list_mess.filter(message => message.type === 'Repeat');
    const inputString = repeat[0].repetition;
    const numbers = inputString.match(/\d+/g).map(Number);
    localStorage.setItem('Interval active', 'true');
    localStorage.setItem('secToRepeat', numbers.toString());
    localStorage.setItem('Counter', 0);
    console.log("Channel selected in process repeat message: ", channelSelected);
    localStorage.setItem('ChannelSelectedListUsers', JSON.stringify(channelSelected.list_users.map(user => `@${user.nickname}`)));
    console.log("Utenti in list users ", localStorage.getItem('ChannelSelectedListUsers'));
    localStorage.setItem('ChannelSelected', JSON.stringify(channelSelected));
    localStorage.setItem('ChannelSelectedName', channelSelected.name);
    localStorage.setItem('PhotoProfile', photoProfile);
    localStorage.setItem('Nickname', nicknameProfile);
    if ( channelSelected.type === '&') {
      localStorage.setItem('ChannelTypeSender', "channels");
    } else {
      localStorage.setItem('ChannelTypeSender', "CHANNELS");
    }
    updateInterval();
  };

  const stopProcessRepeatMessage = async () => {
    localStorage.removeItem('Interval active');
    localStorage.removeItem('secToRepeat');
    localStorage.removeItem('Counter');
    localStorage.removeItem('ChannelSelectedListUsers');
    localStorage.removeItem('ChannelSelected');
    localStorage.removeItem('ChannelSelectedName');
    localStorage.removeItem('ChannelTypeSender');
    localStorage.removeItem('PhotoProfile');
    localStorage.removeItem('Nickname');
    updateInterval();
    setDisabledSendButton(false);
  };

  const handleSendChannelDefaultSqueal = async (defaultCamp) => {
    setDisabledSendButton(true);
    const squealData = {
      sender: localStorage.getItem("Interval active") ? localStorage.getItem('Nickname') : nicknameProfile, 
      typesender: localStorage.getItem("Interval active") ? localStorage.getItem('ChannelTypeSender') : channelType,
      body: {
        text: defaultCamp.text, 
        link: defaultCamp.link || '', 
        photo: defaultCamp.photo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
        video: defaultCamp.video || '', 
        position: defaultCamp.position  || '', 
      },
      photoprofile: localStorage.getItem("Interval active") ? localStorage.getItem('PhotoProfile') : photoProfile, 
      date: new Date().toLocaleDateString(),
      hour: formattedTime,
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', 
      receivers: localStorage.getItem("Interval active") ?  JSON.parse(localStorage.getItem('ChannelSelectedListUsers')) : channelSelected.list_users.map(user => `@${user.nickname}`),
      channel: localStorage.getItem("Interval active") ?  localStorage.getItem('ChannelSelectedName') :  channelSearch, 
      impressions: 0,
    };
  
    console.log("Squeal data: ", squealData);
    try {
      if (wordsRemaining >= 125 && localStorage.getItem('Interval active') === null) {
        const resultAddSqueal = await addSqueal(squealData);
        await hanleUpdateChannelDefaultMessage(channelSelected, defaultCamp, squealData);
        console.log('Squeal send:', resultAddSqueal);
        // window.location.reload();
        resetForm();
        setDisabledSendButton(false);
        goToProfile();
      } else if (localStorage.getItem('Interval active') === 'true') {
        const resultAddSqueal = await addSqueal(squealData);
        const channelToProcess = JSON.parse(localStorage.getItem('ChannelSelected'));
        await hanleUpdateChannelDefaultMessage(channelToProcess, defaultCamp, squealData);
        console.log('Squeal send:', resultAddSqueal);
      } else {
      alert("You don't have enough characters available to send the message.");
      setDisabledSendButton(false);
    }
    } catch (error) {
      console.error('Error during the channel updating: ', error);
      setDisabledSendButton(false);
      window.location.reload();
    }
  };

  const hanleUpdateChannelDefaultMessage = async (channelToUpdate, defaultCamp, squealData) => {
    const channelDataUpdatePost = {
      answers: [],
      body: {
        text: defaultCamp.text, 
        link: defaultCamp.link || '', 
        photo: defaultCamp.photo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 
        video: defaultCamp.video || '', 
        position: defaultCamp.position  || '', 
      },
      category: null,
      date: new Date().toLocaleDateString(),
      hour: squealData.hour,
      impressions: 0,
      neg_reactions: 0,
      photoprofile: localStorage.getItem("Interval active") ? localStorage.getItem('PhotoProfile') : photoProfile,
      pos_reactions: 0,
      receivers: channelToUpdate.list_users.map(user => `@${user.nickname}`),
      seconds: squealData.seconds,
      sender: localStorage.getItem("Interval active") ? localStorage.getItem('Nickname') : nicknameProfile,
      typesender: localStorage.getItem("Interval active") ? localStorage.getItem('ChannelTypeSender') : channelType,
      usersReactions: [],
      usersViewed: [],
    }
    try {
      const resultChannel = await addPostToChannel(channelToUpdate.name, channelDataUpdatePost)
      console.log('Channel update:', resultChannel);
    } catch (error) {
      console.error('Error during the channel uodate:', error);
    }
  };


  /*--------------------------------------------------------------------Crea canale------------------------------------------------------------------------------*/
  
  const handleUserSelection2 = (nickname, userId) => {
    const newUser = { nickname, _id: userId };
    setSelectedUsers(prevUsers => {
        const isUserAlreadySelected = prevUsers.some(user => user._id === userId);
        if (!isUserAlreadySelected) {
            return [...prevUsers, newUser];
        }
        return prevUsers;
    });
  };

  const processSelectedUsers = async () => {
    setUserDetails([]);
  
    for (const user of selectedUsers){
      try {
        const userData = await getUserById(user._id);
        const userDetails = {
          blocked: false,
          cell: userData.cell || "",
          char_d: userData.char_d || 300,
          char_m: userData.char_m || 7000,
          char_w: userData.char_w || 2000,
          email: userData.email,
          fullname: userData.fullname,
          nickname: userData.nickname,
          notification: userData.notification || [true, true, true, true, true],
          password: userData.password,
          photoprofile: userData.photoprofile || "",
          photoprofileX: userData.photoprofileX || 0,
          photoprofileY: userData.photoprofileY || 0,
          popularity: userData.popularity || 0,
          type: userData.type || "User",
          version: userData.version || "user",
          _id: userData._id,
        };
        setUserDetails(prevDetails => [...prevDetails, userDetails]);
      } catch (error) {
        console.error('Error while retrieving user details: ', error);
      }
    }
  };
  
  const handleRemoveUser2 = (userIdToRemove) => {
    setSelectedUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToRemove));
  };

  const isChannelExists = (channelName) => {
    console.log(allChannelsprint.some(channel => channel.name === channelName))
    return allChannelsprint.some(channel => channel.name === channelName);
  };

  const handleCreateChannel = async () => {
    const channelData = {
      creator: nicknameProfile, 
      photoprofile: '',
      photoprofilex: 0,
      photoprofiley: 0,
      name: channelName,
      type: '&', 
      list_mess: [],
      isSilenceable: isSilenceable,
      list_users: [creatorDetails, ...userDetails],
      list_posts: [],
      usersSilenced: [],
      description: channelDescription,
      popularity: "",
    };
    
    try {
      isChannelExists(channelName);
      if (channelName === '') {
        alert('Please enter a name for the channel.');
        setDisabledSendButton(false);
      } else if (isChannelExists(channelName)) {
        alert('A channel with this name already exists. Please choose a different name.');
        setDisabledSendButton(false);
      } else {
        setShowAreYouSure(false);
        setallchannels(allchannelsprev => [...allchannelsprev, channelData]);
        setChannelName('');
        setChannelDescription('');
        setChannelUsers([]);
        setUserDetails([]);
        setSelectedUserIds([]);
        setCreatorDetails({});
        setIsSilenceable(false);
        const result = await addChannel(channelData);
        setShowChannelModal(true);
      }
    } catch (error) {
      console.error('Error during the channel creation:', error);
    }
  };

  const handleChannelModalClose = () => {
    setShowChannelModal(false);
  };

  const goToProfile = () => {
    navigate('/squealer-app/profile');
  };

  const styleButtonBottom = windowSize < 426 ? { marginBottom: "30% !important" } : { };

  /*
  const loSapeviChe = async () => {
    const article = await fetchRandomNews();
      if (article) { 
        if (article.author === null) {
          article.author = "Unknown";
        };
        const tempBodyNews =  {
          text: "Author: " + article.author + "\n" + article.content + "\nPublished at: " + article.publishedAt,
          link: article.url || '',
          photo: article.urlToImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          video: '',
          position: '',
        }
      
  };
  */

  const generateOs = () => {
    const os = [];
    for (let i = 0; i < 100; i++) {
      os.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      });
    }
    return os;
  };

  const [gameState, setGameState] = useState({
    started: false,
    timeLeft: 30,
    score: 0,
    os: generateOs(),
  });

  useEffect(() => {
    setGameState((prevState) => ({ ...prevState, started: true }));
  }, []);

  const handleClick = (o) => {
    // Rimuovi l'O dallo schermo
    // Incrementa il punteggio
    setGameState((prevState) => ({
      ...prevState,
      score: prevState.score + 1,
      os: prevState.os.filter((oItem) => oItem !== o),
    }));
  };

    return (
      <>
        {(disabledSendButton && (!(messageType === 'Channel' && squealOrChannelOption === 'Create'))) ? (
          <>
            <lord-icon
              src="https://cdn.lordicon.com/nqisoomz.json"
              trigger="hover"
              colors="primary:#121331,secondary:#ebe6ef,tertiary:#efcd4c,quaternary:#3a3347"
              style={{width:'250px', height: '250px' }}>
            </lord-icon>
          </>
        ) : (
        <Container 
          style={{
            margin: '0',
            paddingTop: '7%',
            width: '80%',
            position:'absolute',
            left:'20%',
          }}
          className="mx-auto"
          id = "card-container-create-messagge-home"
        >

          {/*Modali per fotocamera e URL*/}
          <>
            <Modal show={showCameraModal} onHide={() => setShowCameraModal(false)} id = "cameraModal">
              <Modal.Header closeButton>
                <Modal.Title>Take a picture</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                />
                <Button className="mt-2" onClick={capture}>Shoot</Button>
                <div className="mt-2">
                    <label className="btn btn-primary">
                        Update image
                        <input 
                            type="file" 
                            hidden 
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </label>
                </div>
              </Modal.Body>
            </Modal>

            <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)} id = "cameraModal">
                <Modal.Header closeButton>
                    <Modal.Title>Insert Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <FormControl
                            placeholder="Insert your link here..."
                            value={inputLIink}
                            onChange={handleInputChange}
                        />
                        <InputGroup.Text>
                            <Button variant="primary" onClick={handleSubmitLink}>Send</Button>
                            {displayedLink && (
                                <Button 
                                    variant="danger" 
                                    className="ms-2"
                                    onClick={() => {
                                        setDisplayedLink('');
                                        setinputLIink('');
                                        const remaining = calculateCharCount();
                                        setWordsRemaining(remaining);
                                    }}
                                >
                                    Remove
                                </Button>
                            )}
                        </InputGroup.Text>
                    </InputGroup>
                </Modal.Body>
            </Modal>

            <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} id = "cameraModal">
              <Modal.Header closeButton>
                <Modal.Title>Upload a video</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mt-2">
                  <label className="btn btn-primary">
                    Upload video
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

            <Modal show={extraCharModal} onHide={() => setExtraCharModal(false)} id = "cameraModal">
              <Modal.Header closeButton>
                <Modal.Title>Extra characters</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to use the extra characters?</p>
                <Button variant="primary" onClick={handleExtraChar}>Yes</Button>
                <Button variant="danger" onClick={() => setExtraCharModal(false)}>No</Button>
              </Modal.Body>
            </Modal>

          </>
    
          {/*Card per creazione messaggio*/}
          <div className="d-flex align-items-start">
            <Card className={isDropdownActive ? 'blurred mx-auto' : 'mx-auto'} id="create-messagge-card" 
              style = {{
                overflowY: "scroll", 
                maxHeight: "90vh", 
                WebkitOverflowScrolling: "touch", 
                boxShadow: "-80px -30px 0 10px #f5f5f5, 80px -30px 0 10px #f5f5f5, -80px 30px 0 10px #f5f5f5, 80px 30px 0 10px #f5f5f5", 
                backgroundColor: "white",
              }}>
              <Card.Body>
                
                {/*Parte comune*/}
                <Row className="align-items-center">

                  <Col xs="auto" className="d-flex justify-content-center" id = "profileColContainer">
                    {photoProfile !== '' ? (
                      <div className="profile-image-container">
                        <img src={photoProfile} alt="Profile" className="profile-image"/>
                      </div>
                    ) : (
                      <PersonCircle size='55' color='#000000DE' />
                    )}
                  </Col>

                  <Col id = "slectionColContainer">
                    <Row className="gx-2 gx-lg-3 align-items-center" id = "RowSelectType">
                      <Col xs="auto">
                        <Form.Select 
                          size="sm" 
                          className='Form-create-messagge-home' 
                          style={{ fontSize: '12px', width: '100px', backgroundColor: 'transparent', borderRadius: '18px', color: '#000000DE', textAlign:'center', borderColor: '#555', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', appearance: 'none'}}
                          value={messageType}
                          onChange={handleMessageTypeChange}
                        >
                          <option value="Squeal">Squeal</option>
                          <option value="Channel">Channel</option>
                        </Form.Select>
                      </Col>

                      <Col xs="auto">
                        <Form.Select size="sm" 
                          className='Form-create-messagge-home' 
                          style={{
                            fontSize: '12px', 
                            width: '100px', 
                            backgroundColor: 'transparent', 
                            borderRadius: '18px', 
                            color: '#000000DE', 
                            textAlign:'center',
                            borderColor: '#555',
                            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
                            appearance: 'none',
                          }}
                          value={squealOrChannelOption}
                          onChange={handleSquealOrChannelOptionChange}
                        >
                          {messageType === 'Squeal' ? (
                            <>
                              <option value="Public">Public</option>
                              <option value="Privato">Privato</option>
                            </>
                          ) : (
                            <>
                              <option value="Write">Write</option>
                              <option value="Create">Create</option>
                            </>
                          )}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs="auto" className="ms-auto" id = "charColContainer">
                    {((messageType === 'Squeal' && squealOrChannelOption === 'Public')  || (messageType === 'Channel' && squealOrChannelOption === 'Write'))&& (
                      <div
                      id="charCounterContainer"
                      style={{
                        textAlign: 'right',
                        width: '40px',
                        height: '40px',
                        lineHeight: '40px',
                        borderRadius: '50%',
                        // backgroundColor: '#f0f0f0',
                        // border: '2px solid #ccc',
                        display: 'flex',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        fontSize: '1em', 
                      }}
                    >
                      {wordsRemaining}
                    </div>
                    )} 
                    {(messageType === 'Squeal' && squealOrChannelOption === 'Privato') && ( 
                      <div id = "charCounterContainer"
                      style={{
                        textAlign: 'right',
                        color: privateWordsRemaining <= 10 ? 'red' : '#000000DE',
                        width: '40px',
                        height: '40px',
                        lineHeight: '40px',
                        borderRadius: '50%',
                        // backgroundColor: '#f0f0f0',
                        // border: '2px solid #ccc',
                        display: 'flex',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        fontSize: '1em', 
                      }}
                      >
                        {privateWordsRemaining}
                      </div>
                    )}

                  </Col>
                </Row>


                {/*Messaggio Public*/}
                {(messageType === 'Squeal' && squealOrChannelOption === 'Public') && (
                  <>
                    {/*Hashtag*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}} id = "channelContentContainer">
                      <Col xs={12} md={6}>
                        <textarea
                          value={text}
                          onChange={handleInputChangeHashtag}
                          maxLength={51}
                          style={{
                            width: '100%',
                            lineHeight: '1.5', 
                            resize: 'none', 
                            height: '1.5em', 
                            overflowX: 'hidden',
                            overflowY: 'hidden', 
                            border: 'none', 
                            scrollbarWidth: 'none', 
                            backgroundColor: 'transparent',
                            color: '#000000DE',
                            fontSize: '20px',
                            outline: 'none',
                          }}
                          rows={1} 
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                              e.preventDefault(); 
                            }
                          }}
                        />
                      </Col>
                    </Row>
                    
                    {/*Textarea + logica allegati*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}} id = "textAreaContentContainer">
                      {/*Textarea*/}
                      <Col>
                        <Row>
                          <Col xs={12} md={10}>
                          <textarea
                            placeholder='What are you thinking about????'
                            value={squealChatTextareaValue}
                            onChange={(e) => {
                              handleSquealChatTextareaChange(e);
                              setIsTextModified(true);
                            }}
                            onBlur={() => {
                              if (squealChatTextareaValue.trim() === '') {
                                setIsTextModified(false);
                              }
                            }}
                            maxLength={maxChar}
                            style={{
                              width: '100%',
                              resize: 'none', 
                              height: '100px', 
                              overflowX: 'hidden', 
                              border: 'none', 
                              scrollbarWidth: 'none', 
                              backgroundColor: 'transparent',
                              color: '#000000DE',
                              fontSize: '16px',
                              outline: 'none',
                            }}
                            rows={1} 
                            onKeyDown={(e) => {
                              if (wordsRemaining > 0 && e.key === 'Enter') {
                                  e.preventDefault();
                              } else if (wordsRemaining <= 0 && e.key !== 'Backspace' && e.key !== 'Delete' && e.key === 'ArrowLeft' && e.key === 'ArrowRight' && e.key === 'ArrowDown' && e.key === 'ArrowUp') {
                                  e.preventDefault();
                              } 
                              if (e.key === 'Enter') {
                                  if (squealChatTextareaValue.trim() === '') {
                                      setIsTextModified(false);
                                  } else {
                                      handleSendMessage();
                                  }
                              }
                            }}
                            onFocus={() => {
                              if (!isTextModified) {
                                setIsTextModified(true);
                              }
                            }}
                          />
                          </Col>
                        </Row>
                      </Col>

                      {/*Logica allegati*/}
                      <Row>
                        <Col xs={12} md={10}>
                          {position && isMapVisible &&(
                            <Card style={{  width: '200px', height: '100px', position: 'relative' }} id = "mapAttachments">
                              <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={position} icon={markerIcon}>
                                  <Popup>You are here!</Popup>
                                </Marker>
                              </MapContainer>
                              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                              <Button variant="danger" 
                                onClick={() => {
                                  setIsMapVisible(false)
                                  setPosition(null); 
                                  const remaining = calculateCharCount();
                                  setWordsRemaining(remaining);
                                }}
                                >X
                              </Button>
                              </div>
                              <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                              <Button variant="light" onClick={() => {
                                const url = `https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`;
                                window.open(url, '_blank');
                              }}>Open Map</Button>
                              </div>
                            </Card>
                          )}
                          {capturedImage && (
                            <div style={{ position: 'relative',  width: '300px', height: '300px', overflow: 'hidden' }} id = "photoAttachments">
                              <img 
                              src={capturedImage} 
                              alt="Scattata"  
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                              }} 
                              />
                              <button 
                                onClick={() => {
                                  setCapturedImage(null)
                                  const remaining = calculateCharCount();
                                  setWordsRemaining(remaining);
                                }} 
                                className="btn btn-sm btn-danger" 
                                style={{ position: 'absolute', top: '10px', right: '10px' }}
                              >
                                X
                              </button>
                            </div>
                          )}
                          {capturedVideo && (
                              <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
                                <video width="200px" height="100px" controls>
                                  <source src={capturedVideo} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                                <button 
                                  onClick={() => {
                                    setCapturedVideo(null);
                                    const remaining = calculateCharCount();
                                    setWordsRemaining(remaining);
                                    setPrivateWordsRemaining(calculatePrivateCharCount());
                                  }} 
                                  className="btn btn-sm btn-danger" 
                                  style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }} 
                                >
                                  X
                                </button>
                              </div>
                          )}
                          {displayedLink && (
                              <div style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: '#000000DE' }}>
                                  <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                  <button 
                                      onClick={() => {
                                          setDisplayedLink('');
                                          setinputLIink('');
                                          const remaining = calculateCharCount();
                                          setWordsRemaining(remaining);
                                          setPrivateWordsRemaining(calculatePrivateCharCount());
                                      }} 
                                      className="btn btn-sm btn-danger" 
                                      style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }}
                                  >
                                      X
                                  </button>
                              </div>
                          )}
                        </Col>
                      </Row>
                    </Row>

                    {/*Allegati*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}} id = "allegatiConainer"> 

                      {/* Colonna per icone */}
                      <Col className="d-flex justify-content-start" md={10} id = "allegatiConainer2">
                        {/* Fotocamera */}
                        <div id="cameraLogo" onClick={handleLogoClick} style={{ cursor: 'pointer', marginRight: '20px' }}>
                          <Camera color="#000000DE" size={30} />
                        </div>

                        {/* Icona per il caricamento del video */}
                        <div id="videoLogo" onClick={() => setShowVideoModal(true)} style={{ cursor: 'pointer', marginRight: '20px', marginTop: '2px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>
                          </svg>
                        </div>

                        {/* URL */}
                        <button onClick={() => setShowLinkModal(true)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#000000DE', marginRight: '20px', paddingLeft: '0px', paddingRight: '0px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                          </svg>
                        </button>
                        
                        {/* Posizione */}
                        <button onClick={() => { if (!isMapVisible) { setIsMapVisible(true); } else { handleLocationButtonClick(); }}} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginRight: '20px',  paddingLeft: '0px', paddingRight: '0px', marginBottom: "4px"  }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                          </svg>
                        </button>
                      </Col>

                      {/* Colonna per il pulsante Invia, allineata a destra */}
                      <Col className="d-flex justify-content-end" md={2} id = "sendMessage">
                        <Button onClick={controlChannel} id="buttonSend" disabled = {disabledSendButton} style={{ marginBottom: windowSize < 426 ? "30%" : undefined }}>Send</Button>
                      </Col>
        
                    </Row>
                  </>
                )}

                {/*Messaggio privato*/}
                {(messageType === 'Squeal' && squealOrChannelOption === 'Privato') && (
                  <>
                    {/*Corpo messaggio*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}} id = "channelContentContainer">

                      {/*Barra ricerca utenti + corpo messaggio*/}
                      <Col>
                        <Row>
                          {/*Barra ricerca utenti + corpo messaggio*/}
                          <Col xs={12} md={10}>

                            {/*Barra ricerca utenti*/}
                            <FormControl
                                placeholder="Find users..."
                                  value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{
                                  backgroundColor: 'transparent',
                                  borderColor: 'transparent',
                                  width: '70%',
                                  marginBottom: '2%',
                                  marginTop: '2%',
                                  padding: '0px',
                                  border: 'none',
                                  outline: 'none',
                                  boxShadow: 'none',
                                  color: '#000000DE'
                                }}
                            />

                            {/* Lista a tendina dei suggerimenti utenti*/}
                            {searchInput && suggestedUsers.length > 0 && (
                                <ul style={{border: '1px solid gray', maxHeight: '150px', overflowY: 'auto', color: '#000000DE'}}>
                                    {suggestedUsers.map(user => (
                                        <li 
                                        key={user._id} 
                                        style={{padding: '10px', cursor: 'pointer', color: '#000000DE'}}
                                        onClick={() => handleUserSelection(user.nickname, user._id)}
                                        >
                                          {user.nickname}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Risultati della ricerca utenti*/}
                            {searchResults.map(user => (
                                <div key={user.id}>
                                    {user.nickname}
                                </div>
                            ))}

                            {/*Testo messaggio*/}
                            <textarea
                              placeholder='What are you thinking about????'
                              onChange={(e) => {
                                handlePrivateSquealChatTextareaChange(e); 
                                setIsTextModified(true);
                              }}
                              value={privateSquealChatTextareaValue}
                              maxLength={200}
                              onBlur={() => {
                                if (squealChatTextareaValue.trim() === '') {
                                  setIsTextModified(false);
                                }
                              }}
                              style={{
                                width: '100%',
                                resize: 'none', 
                                height: '100px', 
                                overflowX: 'hidden', 
                                border: 'none', 
                                scrollbarWidth: 'none',
                                backgroundColor: 'transparent',
                                color: '#000000DE',
                                fontSize: '16px',
                                outline: 'none',
                              }}
                              rows={1} 
                              onKeyDown={(e) => {
                                if (wordsRemaining > 0 && e.key === 'Enter') {
                                    e.preventDefault();
                                } else if (wordsRemaining <= 0 && e.key !== 'Backspace' && e.key !== 'Delete' && e.key === 'ArrowLeft' && e.key === 'ArrowRight' && e.key === 'ArrowDown' && e.key === 'ArrowUp') {
                                    e.preventDefault();
                                } 
                                if (e.key === 'Enter') {
                                    if (squealChatTextareaValue.trim() === '') {
                                        setIsTextModified(false);
                                    } else {
                                        handleSendMessage();
                                    }
                                }
                            }}
                              onFocus={() => {
                                if (!isTextModified) {
                                  setIsTextModified(true);
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>

                      {/*Allegati visibili*/}
                      <Row>
                          <Col xs={12} md={10}>
                            {position && isMapVisible &&(
                              <Card style={{  width: '200px', height: '100px', position: 'relative' }} id = "mapAttachments">
                                <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                  <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  />
                                  <Marker position={position} icon={markerIcon}>
                                    <Popup>You are here!</Popup>
                                  </Marker>
                                </MapContainer>
                                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                                <Button variant="danger" 
                                  onClick={() => {
                                    setIsMapVisible(false)
                                    setPosition(null); 
                                    const remaining = calculatePrivateCharCount(); 
                                    setPrivateWordsRemaining(remaining);
                                  }}
                                  >X
                                </Button>
                                </div>
                                <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                                <Button variant="light" onClick={() => {
                                  const url = `https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`;
                                  window.open(url, '_blank');
                                }}>Open Map</Button>
                                </div>
                              </Card>
                            )}
                            {capturedImage && (
                              <div style={{ position: 'relative',  width: '300px', height: '300px', overflow: 'hidden' }} id = "photoAttachments">
                                <img 
                                  src={capturedImage} 
                                  alt="Scattata" 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover', 
                                  }} 
                                />
                                <button 
                                  onClick={() => {
                                    setCapturedImage(null)
                                    const remaining = calculatePrivateCharCount(); 
                                    setPrivateWordsRemaining(remaining);
                                  }} 
                                  className="btn btn-sm btn-danger" 
                                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                                >
                                  X
                                </button>
                              </div>
                            )}
                            {capturedVideo && (
                                <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
                                  <video width="200px" height="100px" controls>
                                    <source src={capturedVideo} type="video/mp4" />
                                    Il tuo browser non supporta il tag video.
                                  </video>
                                  <button 
                                    onClick={() => {
                                      setCapturedVideo(null);
                                      const remaining = calculateCharCount();
                                      setWordsRemaining(remaining);
                                      setPrivateWordsRemaining(calculatePrivateCharCount());
                                    }} 
                                    className="btn btn-sm btn-danger" 
                                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }} 
                                  >
                                    X
                                  </button>
                                </div>
                            )}
                            {displayedLink && (
                                <div style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: '#000000DE' }}>
                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                    <button 
                                        onClick={() => {
                                            setDisplayedLink('');
                                            setinputLIink('');
                                            const remaining = calculateCharCount();
                                            setWordsRemaining(remaining);
                                            setPrivateWordsRemaining(calculatePrivateCharCount());
                                        }} 
                                        className="btn btn-sm btn-danger" 
                                        style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }} 
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                          </Col>
                      </Row>

                    </Row>

                    {/*Utenti selezionati*/}
                    <Row className="mt-2" style = {{marginLeft: '14%'}} id = "selectedUsersContainer">
                      {selectedUsers.map(user => (
                        <Row  key={user} style={{color: '#000000DE', padding: '0px'}}>
                            {user}
                        </Row>
                      ))}
                    </Row>

                    {/*Allegati / utenti selezionati*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}} id = "allegatiConainer"> 

                      {/* Colonna per icone */}
                      <Col className="d-flex justify-content-start" md={10} id = "allegatiConainer2">
                          {/*Fotocamera*/}
                          <div id="cameraLogo" onClick={handleLogoClick} style={{ cursor: 'pointer', marginRight: '20px' }}>
                              <Camera color="#000000DE" size={25} />
                          </div>

                          {/*Video*/}
                          <div id="videoLogo" onClick={() => setShowVideoModal(true)} style={{ cursor: 'pointer', marginRight: '20px', marginTop: '2px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>
                            </svg>
                          </div>

                          {/*Url*/}
                          <button onClick={() => setShowLinkModal(true)} 
                            style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#000000DE',
                                    marginRight: '20px',
                                    paddingLeft: '0px', 
                                    paddingRight: '0px'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                            </svg>
                          </button>

                          {/*Icona posizione*/}
                          <button
                            onClick={() => {
                              if (!isMapVisible) {
                                setIsMapVisible(true);
                              } else {
                                handleLocationButtonClick();
                              }
                            }}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                marginRight: '20px',
                                paddingLeft: '0px',
                                paddingRight: '0px',
                                marginBottom: "4px"
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                          </button>
                      </Col>

                      {/* Colonna per il pulsante Invia, allineata a destra */}
                      <Col className="d-flex justify-content-end" md={2} id = "sendMessage">
                        <Button onClick={handleSendPrivateSqueal} disabled = {disabledSendButton} id = "buttonSend" style={{ marginBottom: windowSize < 426 ? "30%" : undefined }}>Send</Button>
                      </Col>

                    </Row> 
                  </>
                )}

                {/*Scrivi Channel*/}
                {(messageType === 'Channel' && squealOrChannelOption === 'Write') && (
                    <>
                      {/*Textarea + seleziona Channel*/}
                      <Row className="mt-2" style = {{marginLeft: '6%'}} id = "channelContentContainer">
                        {/*Seleziona canale*/}
                        <>
                          <InputGroup className="mb-3">
                              <FormControl
                                  placeholder="Find channels..."
                                  value={channelSearch}
                                  onChange={handleChannelSearchChange}
                                  disabled={channelSelected}
                                  style={{
                                    backgroundColor: 'transparent',
                                    borderColor: 'transparent',
                                    width: '70%',
                                    marginBottom: '2%',
                                    marginTop: '2%',
                                    padding: '0px',
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    color: '#000000DE'
                                  }}
                              />
                              {channelSelected &&
                                <button
                                  onClick={
                                    () => {
                                      setChannelSearch('');
                                      setChannelSelected(null);
                                      setChannelSelectedHaveDefault(false);
                                      setChannelSelectedHaveRepeat(false);
                                      setDefaultMessageSearch('');
                                      setShowDefaultMessage(false);
                                      setIsDefaultMessageValid(false);
                                    }
                                  }
                                  style={{
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    color: 'red',
                                  }}
                                >
                                  X
                                </button>
                              }
                          </InputGroup>

                          {/* Lista a tendina dei suggerimenti dei canali */}
                          {suggestedChannels.length > 0 && (
                            <ul style={{border: '1px solid gray', maxHeight: '150px', overflowY: 'auto', paddingLeft: '25px'}}>
                                {suggestedChannels.map(channel => (
                                    <li 
                                        key={channel._id} 
                                        style={{padding: '10px', cursor: 'pointer'}}
                                        onClick={() => {
                                          handleChannelSelection(channel); 
                                          setChannelSelected(channel)
                                        }
                                      }
                                    >
                                        {channel.name}
                                    </li>
                                ))}
                            </ul>
                          )}
                        </>

                        {/*Default message*/}
                        <>
                          {/* Selezione deafault message */}
                          {(channelSelectedHaveDefault && channelSelected) && (
                            <>
                              <div style={{display:'flex', flexDirection: 'row'}}>
                                <h7 style = {{ fontWeight : "bold"  }}>This channel have default message avaible</h7>
                                <div>
                                  {(showDefaultMessage === false) ? (
                                    // Bottone per nascondere il messaggio
                                    <button onClick={() => setShowDefaultMessage(true)} className="icon-button" style={{marginTop: '-1%', backgroundColor: "transparent", border: "none", paddingTop: "0px"}}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                                      </svg>
                                    </button>
                                  ) : (
                                    // Bottone per mostrare il messaggio
                                    <button onClick={() => setShowDefaultMessage(false)} className="icon-button" style={{marginTop: '-1%', backgroundColor: "transparent", border: "none", paddingTop: "0px"}}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>
                              {showDefaultMessage && (
                                <div style={{display: "flex", flexDirection: "column", marginBottom: "4%", marginTop: "6%"}}>
                                  <div style={{display: "flex", flexDirection: "row", marginBottom: "4%"}}>
                                    <input
                                      type="text"
                                      placeholder="Find deafault message..."
                                      value={defaultMessageSearch.request}
                                      disabled={isDefaultMessageValid}
                                      onChange={(e) => setDefaultMessageSearch(e.target.value)}
                                      style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'gray',
                                        color: '#000000DE',
                                        width: '80%',
                                      }}
                                    />
                                    {isDefaultMessageValid && (
                                      <button
                                        onClick={() => cleanDefaultMessageSelection()}
                                        style={{
                                          cursor: 'pointer',
                                          background: 'none',
                                          border: 'none',
                                          color: '#000000DE',
                                        }}
                                      >
                                        X
                                      </button>
                                    )}
                                  </div>
                                  {suggestedDefaultMessages.length > 0 && (
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                      {suggestedDefaultMessages.map((message, index) => (
                                        <li key={index} onClick={() => handleDefaultMessageSelection(message)} style={{ cursor: 'pointer' }}>
                                          {message.request} - {message.body.text}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  {channelSelectedHaveRepeat &&  (
                                    <div style={{ display: "flex", flexDirection: "column"}}> 
                                      <h8>This channel have repeat message avaible</h8>
                                      <div style={{display: "flex", flexDirection: "row", marginBottom: "4%"}}>
                                        <button onClick={() => {processRepeatMessage()}} style={{width: "25%"}}>
                                          Repeat
                                        </button>
                                        {localStorage.getItem('Interval active') && (
                                          <button onClick={() => {stopProcessRepeatMessage()}} style={{width: "25%"}}>
                                            Stop
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}


                        </>

                        {/*Textarea*/}
                        {(showDefaultMessage === false) &&
                          <Col>
                            <Row>
                            <Col xs={12} md={10}>
                              <textarea
                                placeholder='What are you thinking about????'
                                value={squealChatTextareaValue}
                                onChange={(e) => {
                                  handleSquealChatTextareaChange(e);
                                  setIsTextModified(true);
                                }}
                                onBlur={() => {
                                  if (squealChatTextareaValue.trim() === '') {
                                    setIsTextModified(false);
                                  }
                                }}
                                maxLength={maxChar}
                                style={{
                                  width: '100%',
                                  resize: 'none', 
                                  height: '100px', 
                                  overflowX: 'hidden',
                                  border: 'none', 
                                  scrollbarWidth: 'none', 
                                  backgroundColor: 'transparent',
                                  color: '#000000DE',
                                  fontSize: '16px',
                                  outline: 'none',
                                }}
                                rows={1} 
                                onKeyDown={(e) => {
                                  if (wordsRemaining > 0 && e.key === 'Enter') {
                                      e.preventDefault();
                                  } else if (wordsRemaining <= 0 && e.key !== 'Backspace' && e.key !== 'Delete' && e.key === 'ArrowLeft' && e.key === 'ArrowRight' && e.key === 'ArrowDown' && e.key === 'ArrowUp') {
                                      e.preventDefault();
                                  } 
                                  if (e.key === 'Enter') {
                                      if (squealChatTextareaValue.trim() === '') {
                                          setIsTextModified(false);
                                      } else {
                                          handleSendMessage();
                                      }
                                  }
                                }}
                                onFocus={() => {
                                  if (!isTextModified) {
                                    setIsTextModified(true);
                                  }
                                }}
                              />
                              </Col>
                            </Row>
                          </Col>
                        }

                        {/*Logica allegati*/}
                        <Row>
                          <Col xs={12} md={10}>
                            {position && isMapVisible &&(
                              <Card style={{  width: '200px', height: '100px', position: 'relative' }} id = "mapAttachments">
                                <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                  <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  />
                                  <Marker position={position} icon={markerIcon}>
                                    <Popup>You are here!</Popup>
                                  </Marker>
                                </MapContainer>
                                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                                <Button variant="danger" 
                                  onClick={() => {
                                    setIsMapVisible(false)
                                    setPosition(null); 
                                    const remaining = calculateCharCount();
                                    setWordsRemaining(remaining);
                                  }}
                                  >X
                                </Button>
                                </div>
                                <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                                <Button variant="light" onClick={() => {
                                  const url = `https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`;
                                  window.open(url, '_blank');
                                }}>Open Map</Button>
                                </div>
                              </Card>
                            )}
                            {capturedImage && (
                              <div style={{ position: 'relative', width: '300px', height: '300px', overflow: 'hidden' }} id = "photoAttachments">
                              <img 
                                src={capturedImage} 
                                alt="Scattata" 
                                width="100%"
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover', 
                                }} 
                              />
                              <button 
                                onClick={() => {
                                  setCapturedImage(null)
                                  const remaining = calculateCharCount();
                                  setWordsRemaining(remaining);
                                }} 
                                className="btn btn-sm btn-danger" 
                                style={{ position: 'absolute', top: '10px', right: '10px' }}
                              >
                                X
                              </button>
                              </div>
                            )}
                            {capturedVideo && (
                              <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
                                <video width="200px" height="100px" controls>
                                  <source src={capturedVideo} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                                <button 
                                  onClick={() => {
                                    setCapturedVideo(null);
                                  }} 
                                  className="btn btn-sm btn-danger" 
                                  style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }} 
                                >
                                  X
                                </button>
                              </div>
                            )}
                            {displayedLink && (
                              <div style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: '#000000DE' }}>
                                  <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                  <button 
                                      onClick={() => {
                                          setDisplayedLink('');
                                          setinputLIink('');
                                          const remaining = calculateCharCount();
                                          setWordsRemaining(remaining);
                                          setPrivateWordsRemaining(calculatePrivateCharCount());
                                      }} 
                                      className="btn btn-sm btn-danger" 
                                      style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }} 
                                  >
                                      X
                                  </button>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Row>

                      
                      {/*Allegati*/}
                      {(showDefaultMessage === false) &&
                        <Row className="mt-2" style = {{marginLeft: '6%'}} id = "textAreaContentContainer"> 
                          {/* Colonna per icone */}
                          <Col className="d-flex justify-content-start" md={10} id = "allegatiConainer2">
                            {/*Fotocamera*/}
                            <div 
                                id="cameraLogo" 
                                onClick={handleLogoClick}
                                style={{ cursor: 'pointer', marginRight: '20px'}}
                            >
                              <Camera color="#000000DE" size={30} />
                            </div>
                    
                            {/*Video*/}
                            <div 
                              id="videoLogo" 
                                onClick={() => setShowVideoModal(true)}
                              style={{ cursor: 'pointer', marginRight: '20px', marginTop: '2px'}}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
                                  <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>
                              </svg>
                            </div>

                            {/*Url*/}
                            <button
                              onClick={() => setShowLinkModal(true)}
                              style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#000000DE',
                                  marginRight: '20px',
                                  paddingLeft: '0px',
                                  paddingRight: '0px'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                              </svg>
                            </button>
                            
                            {/*Posizione*/}
                            <button
                              onClick={() => {
                                if (!isMapVisible) {
                                  setIsMapVisible(true);
                                } else {
                                  handleLocationButtonClick();
                                }
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                marginRight: '20px',
                                paddingLeft: '0px',
                                paddingRight: '0px',
                                marginBottom: "4px"
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                              </svg>
                            </button>
                          </Col>

                          {/* Colonna per il pulsante Invia, allineata a destra */}
                          <Col className="d-flex justify-content-end" md={2} id = "sendMessage">
                            <Button onClick={handleSendChannelSqueal} disabled = {disabledSendButton} id = "buttonSend" style={{ marginBottom: windowSize < 426 ? "30%" : undefined }}>Send</Button>
                          </Col>
                        </Row>
                      }

                      {/*Send default*/}
                      {isDefaultMessageValid &&
                        <Col className="col-1">
                          <Button onClick={processDefaultMessageType} disabled = {disabledSendButton} id = "buttonSend" style={{ marginBottom: windowSize < 426 ? "30%" : undefined }}>Send</Button>
                        </Col> 
                      }
                    </>
                )}

                {/*Crea canale*/}
                {(messageType === 'Channel' && squealOrChannelOption === 'Create') && (
                  <Form style = {{marginTop:'4%'}}>
                    <Form.Group>
                      <Col>
                        {/*Nome canale + silenziabile*/}
                        <Row style={{justifyContent: 'center'}}>
                          <Form.Control 
                            type="name" 
                            placeholder="Channel name" 
                            value={channelName} 
                            onChange={e => setChannelName(e.target.value.toLowerCase())}
                            style = {{
                              width: '60%',
                              borderRadius: '20px',
                              border: '1px solid #ced4da',
                              padding: '10px 15px',
                              fontSize: '16px',
                              transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
                            }} className="my-formCostum-input"/>
                        </Row>

                        {/*Silenziabile*/}
                        <Row style = {{marginTop:'4%', justifyContent: 'center'}}>
                          <Form.Check
                              type="switch"
                              id="custom-switch"
                              label="Silenziabile"
                              style = {{width: 'fit-content', marginLeft: '4%'}}
                              checked={isSilenceable}
                              onChange={e => setIsSilenceable(e.target.checked)}  
                            />
                        </Row>

                        {/*Descrizione*/}
                        <Row style = {{marginTop:'4%', justifyContent: 'center'}}>
                          <Form.Control as="textarea" placeholder="A few words to describe the channel" value={channelDescription} onChange={e => setChannelDescription(e.target.value)} rows={4} style = {{width: '90%'}}/>
                        </Row>

                        {/*Aggiungi persone*/}
                        <Row style = {{marginTop:'4%', justifyContent: 'center'}}>
                          <input
                            type="text"
                            placeholder="Find users..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            style={{ 
                              width: '60%',
                              borderRadius: '20px',
                              border: '1px solid #ced4da',
                              padding: '10px 15px',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out',
                              marginBottom: '10px',
                            }} className="my-inputCustom-input"
                          />
                          {showDropdown && (
                            <>
                              <div style={{ marginTop: '4%' }}>
                                <strong>Users already entered</strong>
                                {selectedUsers.map(user => (
                                    <div key={user._id} style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: '#000000DE' }}>
                                        <a>{user.nickname}</a>
                                        <button 
                                          onClick={() => {
                                            handleRemoveUser2(user._id);
                                          }} 
                                          className="btn btn-sm btn-danger" 
                                          style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }}
                                        >
                                          X
                                        </button>
                                    </div>
                                ))}
                              </div>
                              {/* Aggiunta del modale per mostrare tutti gli utenti */}
                              <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                  <Modal.Title>All users entered</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  {selectedUsers.map(user => (
                                      <Row key={user._id} style={{color: '#000000DE', padding: '0px'}}>
                                          {user.nickname}
                                      </Row>
                                  ))}
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Close
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                              <div style={{ marginTop: '4%' }}>
                                <strong>Users</strong>
                                {suggestedUsers.map(user => (
                                  <div key={user._id} style={{marginTop: '2%', cursor: 'pointer', color: '#000000DE'}}
                                      onClick={() => {
                                        handleUserSelection2(user.nickname, user._id);
                                      }}>
                                    {user.nickname}
                                  </div>
                                ))}
                              </div>
                              <button style={{ display: 'block', margin: '10px auto' }} onClick={() => setShowDropdown(false)}>Close</button>
                            </>
                          )}
                        </Row>
                        
                        {/*Invio*/}
                        <Row style = {{marginTop:'4%'}}>
                          <Button 
                          onClick={() =>{
                            processSelectedUsers();
                            setShowAreYouSure(true);
                            setDisabledSendButton(true);
                          }}
                          id = "buttonSend"
                          disabled = {disabledSendButton}
                          >Create</Button>
                        </Row>

                        {/*Are you sure*/}
                        <Row style = {{marginTop:'4%', marginBottom: windowSize < 426 ? "30%" : "5%"}}>
                          {showAreYouSure && (
                            <div style={{ color: '#000000DE' }}>
                              <p>Are you sure you want to create the channel?</p>
                              <Button onClick={handleCreateChannel} id = "buttonSend">Yes</Button>
                              <Button onClick={() => setShowAreYouSure(false)} id = "buttonSend">No</Button>
                            </div>
                          )}
                        </Row>
                      </Col>
                    </Form.Group>
                  </Form>
                )}

                
              </Card.Body>
            </Card>
          </div>

          {/*Modale per la creazione canale*/}
          <Modal show={showChannelModal} onHide={handleChannelModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Channel Created successfully</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              The channel was created correctly, but to improve the experience we recommend adding default messages and adding a profile photo for the channel.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                handleChannelModalClose();
                resetForm();
                setDisabledSendButton(false);
              }}>
                Close
              </Button>
              <Button variant="primary" onClick={() => {
                goToProfile();
                setDisabledSendButton(false);
              }}>
                Go to edit channel
              </Button>
            </Modal.Footer>
          </Modal>
        
        </Container>
        )}
      </>
    );
}

export default CreateMessage;
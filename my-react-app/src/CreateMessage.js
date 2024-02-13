import React, { useState, useRef, useEffect} from 'react';
import { Navbar, Container, Nav, Form, InputGroup, FormControl, Button, Image, Dropdown, Card, Row, Col, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import logo from '../src/img/logo.png'
import search_logo from '../src/img/search.png'
import { Camera, Globe, Link as LinkLogo, Gear, NodeMinus, PersonCircle } from 'react-bootstrap-icons';
import Webcam from 'react-webcam';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {getUsers, updateUser, getListChannels, getUserById, getListSqueals, getActualUser, updateUsers, updateChannels, updateSqueals, addUser, addSqueal, addChannel, updateChannel} from './serverRequests.js';
import { get, set } from 'mongoose';
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

  /*Creazione messaggio*/
  const [showMessageCreation, setShowMessageCreation] = useState(false);
  const [messageType, setMessageType] = useState('Squeal');  // This will hold either 'Squeal' or 'Canale'
  const [squealOrChannelOption, setSquealOrChannelOption] = useState('Pubblico');  // This will hold either 'Pubblico' or 'Privato' for Squeal and 'Scrivi' or 'Crea' for Canale
  const [text, setText] = useState('#');
  const [charCount, setCharCount] = useState(1);
  const [squealChatTextareaValue, setSquealChatSecondTextareaValue] = useState('');
  const [actualUser, setActualUser] = useState(null);
  const [maxChar, setMaxChar] = useState(); // Initial value, will be updated
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [allchannels, setallchannels] = useState([]);
  const [allCHANNELS, setallCHANNELS] = useState([]);
  const [allkeywords, setallkeywords] = useState([]);
  const [allChannelsprint, setallChannelsprint] = useState([]);
  const [allKeywordssprint, setallkeywordsprint] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [existedChannel, setExistedChannel] = useState(false);
  let [foundChannel, setFoundChannel] = useState(null);

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

  /*Creazione messaggi funzioni comuni*/
  const [wordsRemaining, setWordsRemaining] = useState(maxChar);
  const [counterColor, setCounterColor] = useState('purple');
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
  const photoProfile = "";
  const navigate = useNavigate();



  /*Crea canale*/
  const [searchTerm2, setSearchTerm2] = useState('');
  const [selectedUsers2, setSelectedUsers2] = useState([]);
  const allUsers2 = ['Pierpaolone', 'Franco', 'Mario', 'Luigi', 'Anna'];
  const filteredUsers2 = allUsers2
    .filter(user => user.toLowerCase().includes(searchTerm2.toLowerCase()))
    .slice(0, 3); // Mostra solo i primi 3 utenti filtrati
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
      oscillator.stop(audioContext.currentTime + duration * 0.001); // duration in milliseconds
    };
    /*funzione per il beep*/
    const playBeep = () => {
      beep(520, 200, 1, 'sine'); // Gioca un beep di 520Hz per 200ms
    };  

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getActualUser(); // Assuming this function returns the logged-in user data
        setActualUser(userData);
        setMaxChar(userData.char_d); // Adjust 'char_d' to the actual property name for max characters
        const initialWordsRemaining = userData.char_d - squealChatTextareaValue.length;

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
    // Initialize the privateWordsRemaining based on the initial text and attachments
    const initialPrivateWordsRemaining = calculatePrivateCharCount();
    setPrivateWordsRemaining(initialPrivateWordsRemaining);
  }, [maxCharsPrivate, privateSquealChatTextareaValue, capturedImage, displayedLink, position, capturedVideo]);

  useEffect(() => {
    if (searchInput) {
      debouncedSearchUsers(searchInput);
    } else {
      setSuggestedUsers([]); // Pulisci i suggerimenti se l'input è vuoto
    }
  }, [searchInput]);
  
  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        const userData = await getUserById(actualUserId);
        const creatorDetails = {
          blocked: false, // Valore predefinito per il campo blocked
          cell: userData.cell || "",
          char_d: userData.char_d || 300,
          char_m: userData.char_m || 7000,
          char_w: userData.char_w || 2000,
          email: userData.email,
          fullname: userData.fullname,
          nickname: userData.nickname,
          notification: userData.notification || [true, true, true, true, true],
          password: userData.password,
          photoprofile: userData.photoprofile || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…tZ+iIV1ophfMy+kSgUDTiGsvF0SRUaR9xSPkVSB6jUSmv0f/Z",
          photoprofileX: userData.photoprofileX || 0,
          photoprofileY: userData.photoprofileY || 0,
          popularity: userData.popularity || 0,
          type: "Creator", // Sovrascrivi il tipo con "Creator"
          version: userData.version || "user",
          _id: userData._id,
        };
        setCreatorDetails(creatorDetails);
      } catch (error) {
        console.error('Errore durante il recupero dei dettagli del creatore:', error);
      }
    };
  
    fetchCreatorDetails();
  }, [actualUserId]);

  useEffect(() => {
    const getAll4 = async () => {
      try {
        const Channels = await getListChannels();
        console.log("Channels",Channels);
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
              // gestire eventuali altri casi o errori
              break;
          }
        });
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        // Gestire eventuali azioni di errore qui
      }
    }; //Mi da tutti i channel

    getAll4();
  }, []); // L'array vuoto come seconda argomentazione significa che questo effetto verrà eseguito solo una volta, quando il componente viene montato
  
  useEffect(() => {
    setallChannelsprint([]);
    setallkeywordsprint([]);
  
    for (let i = 0; i < allchannels.length; i++) {
      for (let j = 0; j < allchannels[i].list_users.length; j++) {
        if (allchannels[i].list_users[j].nickname === actualUser.nickname) {
          setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint, allchannels[i]]);
          // console.log("allchannels[i]",allchannels[i]);
        }
      }
    }
  
    for (let i = 0; i < allCHANNELS.length; i++) {
      for (let j = 0; j < allCHANNELS[i].list_users.length; j++) {
        if ((allCHANNELS[i].list_users[j].nickname === actualUser.nickname) && ((allCHANNELS[i].list_users[j].type === 'Modifier')|(allCHANNELS[i].list_users[j].type === 'Creator'))) {
          setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint, allCHANNELS[i]]);
          // console.log("allCHANNELS[i]",allCHANNELS[i]);
        }
      }
    }
  
    for (let i = 0; i < allkeywords.length; i++) {
      for (let j = 0; j < allkeywords[i].list_users.length; j++) {
        if (allkeywords[i].list_users[j].nickname === actualUser.nickname) {
          setallkeywordsprint(prevallchannelsprint => [...prevallchannelsprint, allkeywords[i]]);
          // console.log("allkeywords[i]",allkeywords[i]);
        }
      }
    }
    
  
  }, [actualUser, allchannels, allCHANNELS, allkeywords]); 
  
  /*Test only
  useEffect(() => {
    console.log("allChannelsprint has updated", allChannelsprint);
  }, [allChannelsprint]); 
  
  useEffect(() => {
    console.log("Tutti gli squeal ", getListSqueals());
  }, []); 
 
  
  useEffect(() => {
    console.log("All keywords print", allKeywordssprint);
  }, [allKeywordssprint]);
   */
  /*---------------------------------------------------------------------Funzioni Jack------------------------------------------------------------------------*/
  /*funzioni per iniziare e finire un intervallo per i messaggi ripetuti*/
  const [intervalId, setIntervalId] = useState(null);

  const startInterval = (n) => {
      // Assicurati che non ci siano intervalli già in esecuzione
      if (intervalId) {
        clearInterval(intervalId);
      }
  
      // Imposta un nuovo intervallo
      const id = setInterval(() => {
        console.log('Questo messaggio appare ogni n secondi');
        // Aggiungi qui il tuo codice che vuoi eseguire ad ogni intervallo
      }, n*1000); // Sostituisci 5000 con il numero di millisecondi che desideri
  
      // Salva l'ID dell'intervallo nello stato
      setIntervalId(id);
  };
  
  // Aggiungi una funzione per fermare l'intervallo se necessario
  const stopInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  /*funzione per generare una immagine random dalla API unsplash*/
  function randomUnsplashImage(width, height) {
    return(`https://source.unsplash.com/random/${width}x${height}`);
  }

  /*funzione per generare una news casuale usando la API Saurav Kanchan*/
  const [article, setArticle] = useState(null);

  const fetchRandomNews = async () => {
    try {
      const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/general/us.json');
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.articles.length);
      setArticle(data.articles[randomIndex]);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  /*funzione per ottenere un tweet casuale da twitter*/
  const [tweet, setTweet] = useState(null);

  const fetchTweet = async () => {
    try {
      const response = await fetch('/api/getTweet');
      const data = await response.json();
      setTweet(data.data[0]); // Prendi il primo tweet dall'array di tweet
    } catch (error) {
      console.error('Errore nel caricamento del tweet:', error);
    }
  };
  /*funzione per ottenere un'informazione casuale da wikipedia*/
  const [articleUrl, setArticleUrl] = useState('');

  const fetchRandomWikiArticle = async () => {//aggiungi in body.text "Lo sapevi che..."
    const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=1&origin=*";
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      const title = data.query.random[0].title;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      
      setArticleUrl(pageUrl);
    } catch (error) {
      console.error('Error fetching random Wikipedia article:', error);
    }
  };

  const handleFocus = () => {
    setShowIcon(false);
    setSuggestedProfiles(["Profilo 1", "Profilo 2", "Profilo 3"]);
    setIsSuggestionsVisible(true);
  };

  const handleBlur = () => {
    setShowIcon(true);
  };


  /*--------------------------------------------------------------------Comuni--------------------------------------------------------------------------------------*/
  const resetAttachments = () => {
    setPosition(null);
    setCapturedImage(null);
    setDisplayedLink(null);
    // Aggiungi altre variabili che desideri resettare qui
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsSuggestionsVisible(false);
  };

  const handleItemClick = (item) => {
    const selectedIndex = selectedItems.indexOf(item);
    let updatedItems = [...selectedItems];

    setIsDropdownVisible(true);

    if (selectedIndex === -1) {
      updatedItems.push(item);
    } else {
      updatedItems = updatedItems.filter((selectedItem) => selectedItem !== item);
    }

    setSelectedItems(updatedItems);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setIsSuggestionsVisible(false);
  };

  const handleMessageTypeChange = (e) => {
    const selectedType = e.target.value;
    setMessageType(selectedType);
    // Resetta gli allegati
    resetAttachments();

  
    // Se si cambia a "Canale", impostare il valore predefinito per "squealOrChannelOption" su "Scrivi"
    if (selectedType === 'Canale') {
      setSquealOrChannelOption('Scrivi');
    } else {
      setSquealOrChannelOption('Pubblico');
    }
  };

  const handleSquealOrChannelOptionChange = (e) => {
    setSquealOrChannelOption(e.target.value);
    // Resetta gli allegati
    resetAttachments();
  };



  /*--------------------------------------------------------------------Allegati e gestione------------------------------------------------------------------------------*/
  const handleVideoChange = (e) => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Pubblico') || (messageType === 'Canale' && squealOrChannelOption === 'Scrivi'))) {
      const file = e.target.files[0];
      if (file) {
        // Qui puoi implementare la logica per gestire il file video.
        // Per esempio, potresti voler salvare l'URL del video nello stato.
        const videoUrl = URL.createObjectURL(file);
        setCapturedVideo(videoUrl);
        setShowVideoModal(false);
        const remaining = calculateCharCount();
        setWordsRemaining(remaining);
      }
    } else if (privateWordsRemaining >= 125 && messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      const file = e.target.files[0];
      if (file) {
        // Qui puoi implementare la logica per gestire il file video.
        // Per esempio, potresti voler salvare l'URL del video nello stato.
        const videoUrl = URL.createObjectURL(file);
        setCapturedVideo(videoUrl);
        setShowVideoModal(false);
        const remainingPrivate = calculatePrivateCharCount();
        setPrivateWordsRemaining(remainingPrivate);
      }
    } else if (messageType === 'Canale' && squealOrChannelOption === 'Crea') {
      const file = e.target.files[0];
      if (file) {
        // Qui puoi implementare la logica per gestire il file video.
        // Per esempio, potresti voler salvare l'URL del video nello stato.
        const videoUrl = URL.createObjectURL(file);
        setCapturedVideo(videoUrl);
        setShowVideoModal(false);
      }
    } else {
      alert("Non hai abbastanza caratteri disponibili per caricare un video.");
    }
  };

  const handleLogoClick = () => {
    setShowFileSelectionModal(true);
    setShowCameraModal(true);
  };
  
  const handleLocationButtonClick = () => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Pubblico') || (messageType === 'Canale' && squealOrChannelOption === 'Scrivi'))) {
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
    } else if (messageType === 'Canale' && squealOrChannelOption === 'Crea') {
      if (navigator.geolocation) {
        console.log("Ci sono 1");
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("Ci sono 2");
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          console.log("Latitude: " + latitude + " Longitude: " + longitude);
        }, (error) => {
          console.error(error);
        });
      } else {
        alert('La geolocalizzazione non è supportata dal tuo browser.');
      }
    } else {
      alert("Non hai abbastanza caratteri disponibili per aggiungere una posizione.");
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
  });

  const handleFileChange = (e) => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Pubblico') || (messageType === 'Canale' && squealOrChannelOption === 'Scrivi'))) {
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
    } else if (messageType === 'Canale' && squealOrChannelOption === 'Crea') {
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
      alert("Non hai abbastanza caratteri disponibili per caricare una foto.");
    }
  };

  const capture = () => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Pubblico') || (messageType === 'Canale' && squealOrChannelOption === 'Scrivi'))) {
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
    } else if (messageType === 'Canale' && squealOrChannelOption === 'Crea'){
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCameraModal(false);
    } else {
      alert("Non hai abbastanza caratteri disponibili per aggiungere una foto.");
    }
  };
  
  const handleInputChange = (e) => {
    setinputLIink(e.target.value);
  };

  const handleSubmitLink = () => {
    if (wordsRemaining >= 125 && ((messageType === 'Squeal' && squealOrChannelOption === 'Pubblico') || (messageType === 'Canale' && squealOrChannelOption === 'Scrivi'))) {
      if (isLink(inputLIink)) {
        setDisplayedLink(inputLIink);
        setShowLinkModal(false);
        const remaining = calculateCharCount();
        setWordsRemaining(remaining);
      } else {
        alert("Per favore inserisci un link che inizi con 'http://' o 'https://'.");
      }
    } else if (privateWordsRemaining >= 125 && messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
      if (isLink(inputLIink)) {
        setDisplayedLink(inputLIink);
        setShowLinkModal(false);
        const remainingPrivate = calculatePrivateCharCount();
        setPrivateWordsRemaining(remainingPrivate);
      } else {
        alert("Per favore inserisci un link che inizi con 'http://' o 'https://'.");
      }
    } else if (messageType === 'Canale' && squealOrChannelOption === 'Crea') {
      if (isLink(inputLIink)) {
        setDisplayedLink(inputLIink);
        setShowLinkModal(false);
      } else {
        alert("Per favore inserisci un link che inizi con 'http://' o 'https://'.");
      }
    } else {
      alert("Non hai abbastanza caratteri disponibili per aggiungere un link.");
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

  const handleDropdownOpen = () => {
    setIsDropdownActive(true);
    // il resto della logica per aprire il dropdown
  };

  const handleDropdownClose = () => {
    setIsDropdownActive(false);
    // il resto della logica per chiudere il dropdown
  };

  const getAllChannelType = async () => {
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
            console.log("Errore nel caricamento dei type in channels");
            break;
        }
      });
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      // Gestire eventuali azioni di errore qui, ad esempio mostrare un messaggio all'utente
    }
  };



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
        if (remaining <= 10) {
            setCounterColor('red');
        } else {
            setCounterColor('purple');
        }
    } else {
        // Ripristina il valore della textarea all'ultimo valore valido
        setSquealChatSecondTextareaValue(squealChatTextareaValue);

        // Opzionalmente mostra un avviso o riproduce un suono
        console.log(`Non puoi inserire più di ${availableTextLength} caratteri.`);
        e.preventDefault();
    }
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
    if (position) count -= 125; // Assumendo che vuoi anche ridurre il conteggio quando inserisci una posizione
  
    return count;
  };

  const handleUpdateUser = async (charToDeacrement) => {
    const userId = actualUser._id; // Recupera l'ID dell'utente da aggiornare
    const userUpdates = {
        // Definisci qui le proprietà dell'utente da aggiornare
        char_d: actualUser.char_d - charToDeacrement,
        char_w: actualUser.char_w - charToDeacrement,
        char_m: actualUser.char_m - charToDeacrement,
        // ... altre proprietà se necessario ...
    };

    try {
        const result = await updateUser(userId, userUpdates);
        console.log(result.message); // 'Utente aggiornato con successo' o qualsiasi altra risposta dal server
        
        // Aggiorna lo stato dell'app, mostra una notifica, ecc.
        // ... 
    } catch (error) {
        console.error(error);
        // Gestisci l'errore visualizzando un messaggio all'utente, ecc.
        // ...
    }
  };

  const controlChannel = () => {
    const textWithoutHashtag = text.replace(/#/g, '');
    const foundChannel = allKeywordssprint.find(channel => channel.name === textWithoutHashtag);

    // Usa direttamente il risultato della ricerca senza aspettare che lo stato si aggiorni
    if (foundChannel) {
      console.log("Canale trovato", foundChannel);
      setListOfUsers(foundChannel.list_users);
      handleSendSqueal(foundChannel, true);
    } else {
      console.log("Canale non trovato");
      setExistedChannel(false);
      console.log("Canale non trovato in control channel", existedChannel)
      setListOfUsers([actualUser.nickname]);
      handleSendSqueal(foundChannel, false);
    }

  };

  const handleCreateHashtagChannel = async () => {
    const channelData = {
      creator: actualUser.nickname,
      photoProfile: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
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
          nickname: actualUser.nickname,
          notification: actualUser.notification || [true, true, true, true, true],
          password: actualUser.password,
          photoprofile: actualUser.photoprofile || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…tZ+iIV1ophfMy+kSgUDTiGsvF0SRUaR9xSPkVSB6jUSmv0f/Z",
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
            text: squealChatTextareaValue, // Assumi che questo sia il testo del tuo messaggio
            link: displayedLink || '', // Aggiungi questo campo solo se è stato inserito un link
            photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
            video: capturedVideo || '', // Aggiungi questo campo solo se è stato caricato un video
            position: position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
          },
          category: null,
          date: new Date().toISOString(),
          hour: new Date().getHours(),
          impressions: 0,
          neg_reactions: 0,
          photoprofile: actualUser.photoProfile,
          pos_reactions: 0,
          receivers: [`@${actualUser.nickname}`],
          seconds: new Date().getSeconds(),
          sender: actualUser.nickname,
          typesender: 'keywords',
          usersReactions: [],
          usersViewed: [],
        }
      ],
      userSilenced: [],
      description: "",
      popularity: "",
    };
    try {
      const result = await addChannel(channelData);
      console.log('Canale creato con successo:', result);
    } catch (error) {
      console.error('Errore nella creazione del canale:', error);
    }
  };

  const handleUpdateHashTagChannel = async (channelToUpdate) => {
    const channelDataUpdatePost = {
      answers: [],
      body: {
        text: squealChatTextareaValue, // Assumi che questo sia il testo del tuo messaggio
        link: displayedLink || '', // Aggiungi questo campo solo se è stato inserito un link
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
        video: capturedVideo || '', // Aggiungi questo campo solo se è stato caricato un video
        position: position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
      },
      category: null,
      date: new Date().toISOString(),
      hour: new Date().getHours(),
      impressions: 0,
      neg_reactions: 0,
      photoprofile: actualUser.photoProfile,
      pos_reactions: 0,
      receivers: channelToUpdate.list_users.map(user => `@${user.nickname}`),
      seconds: new Date().getSeconds(),
      sender: actualUser.nickname,
      typesender: 'keywords',
      usersReactions: [],
      usersViewed: [],
    }

    const updatedListPosts = [...channelToUpdate.list_posts, channelDataUpdatePost];

    try {
      const result = await updateChannel(channelToUpdate._id,  channelDataUpdatePost);
      console.log('Canale aggiornato con successo:', result);
    } catch (error) {
      console.error('Errore nell\'aggiornamento del canale:', error);
    }
  };

  const handleSendSqueal = async (channelToUpdate, flag) => {
    const squealData = {
      sender: actualUser.nickname, // Assumi che `actualUser` contenga il nickname del mittente
      typesender: 'keywords', // Modifica come necessario
      body: {
        text: squealChatTextareaValue, // Assumi che questo sia il testo del tuo messaggio
        link: displayedLink || '', // Aggiungi questo campo solo se è stato inserito un link
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
        video: capturedVideo || '', // Aggiungi questo campo solo se è stato caricato un video
        position: position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
      },
      photoprofile: actualUser.photoProfile, // Assumi che `actualUser` contenga l'URL della foto profilo
      date: new Date().toISOString(),
      hour: new Date().getHours(),
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', // Aggiungi logica per determinare la categoria se necessario
      receivers: [listOfUsers], // Aggiungi logica se ci sono destinatari specifici
      channel: text.replace(/#/g, ''), // Aggiungi logica se il squeal è associato a un canale
      impressions: 0,
    };
  
    try {
      const result = await addSqueal(squealData);
      if (flag === true) {
        console.log("Aggiornamento del canale esistente");
        await handleUpdateHashTagChannel(channelToUpdate);
      } else {
        console.log("Creazione di un nuovo canale");
        await handleCreateHashtagChannel();
      }
      console.log('Squeal inviato con successo:', result);
      const textChars = squealData.body.text.length; // caratteri nel testo del messaggio
      let imageChars = 0;
      let videoChars = 0;
      let linkChars = 0;
      let positionChars = 0;
      if (squealData.body.photo !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
        imageChars = squealData.body.photo ? 125 : 0; // aggiungi 125 caratteri se c'è un'immagine
      } else {
        imageChars = 0;
      }
      if (squealData.body.video !== '') {
        videoChars = squealData.body.video ? 125 : 0; // aggiungi 125 caratteri se c'è un video
      } else {
        videoChars = 0;
      }
      if (squealData.body.link !== '') {
        linkChars = squealData.body.link ? 125 : 0; // aggiungi 125 caratteri se c'è un link
      } else {
        linkChars = 0;
      }
      if (squealData.body.position !== '') {
        positionChars = squealData.body.position ? 125 : 0; // aggiungi 125 caratteri se c'è una posizione
      } else {
        positionChars = 0;
      }
      const usedChars = textChars + imageChars + videoChars + linkChars + positionChars; // somma tutti i caratteri

      await handleUpdateUser(usedChars); // Aggiorna il numero di caratteri disponibili per l'utente

    } catch (error) {
      console.error('Errore nell\'invio del Squeal:', error);
      // ...gestione dell'errore...
    }
  };


  /*--------------------------------------------------------------------Squeal Private------------------------------------------------------------------------------*/
  const handleUserSelection = (user, user_id) => {
    if (selectedUsers.includes(user)) {
        // Se l'utente è già selezionato, rimuovilo dalla lista
        setSelectedUsers(prevUsers => prevUsers.filter(u => u !== user));
        setSelectedUserIds(prevIds => prevIds.filter(id => id !== user_id));
    } else {
        // Altrimenti, aggiungilo alla lista se non si sono già raggiunti i 3 utenti
        if (messageType === 'Squeal' && squealOrChannelOption === 'Privato') {
          if (selectedUsers.length < 3) {
              setSelectedUsers(prevUsers => [...prevUsers, user]);
          } else {
              alert('Puoi selezionare al massimo 3 utenti.');
          }
        } else if (messageType === 'Canale' && squealOrChannelOption === 'Crea')  {
          setSelectedUsers(prevUsers => [...prevUsers, user]);
          setSelectedUserIds(prevIds => [...prevIds, user_id]);
        }
    }
    setSearchInput(''); // Pulisci l'input di ricerca dopo la selezione
    setSuggestedUsers([]); // Nascondi i suggerimenti dopo la selezione
  }

  const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestedUsers([]); // Resetta i suggerimenti se il termine di ricerca è vuoto
      return;
    }
  
    try {
      const users = await getUsers(searchTerm); // Assumi che getUsers accetti un termine di ricerca
      setSuggestedUsers(users.filter(user => user.nickname.toLowerCase().includes(searchTerm.toLowerCase())));
    } catch (error) {
      console.error('Errore durante la ricerca degli utenti:', error);
    }
  };
  
  const debouncedSearchUsers = debounce(searchUsers, 300);

  useEffect(() => {
    if (searchInput) {
      debouncedSearchUsers(searchInput);
    } else {
      setSuggestedUsers([]); // Pulisci i suggerimenti se l'input è vuoto
    }
  }, [searchInput]);

  const handlePrivateSquealChatTextareaChange = (e) => {
    const inputValue = e.target.value;

      // Calculate the total available length for text considering the attachments
      const availableTextLength = maxCharsPrivate - (capturedImage ? 125 : 0) - (displayedLink ? 125 : 0) - (position ? 125 : 0) - (capturedVideo ? 125 : 0);
    
      // Update the character count remaining considering the length of attachments
      if (inputValue.length <= availableTextLength) {
        setPrivateSquealChatTextareaValue(inputValue);
        const remainingPrivate = calculatePrivateCharCount();
        setPrivateWordsRemaining(remainingPrivate);
      } else {
        // If you exceed the limit, you might want to show a message to the user or prevent further input.
        console.log(`You cannot enter more than ${availableTextLength} characters.`);
        // Optionally, you might want to restore the textarea's value to the last valid value
        e.preventDefault();
      }
  };

  const calculatePrivateCharCount = () => {
   
    const attachmentsLength = (capturedImage ? 125 : 0) + (displayedLink ? 125 : 0) + (position ? 125 : 0) + (capturedVideo ? 125 : 0);
    const totalLength = maxCharsPrivate - privateSquealChatTextareaValue.length - attachmentsLength;
    
    return totalLength;
  };

  const handleSendPrivateSqueal = async () => {
    const squealData = {
      sender: actualUser.nickname, // Assumi che `actualUser` contenga il nickname del mittente
      typesender: 'Users', // Modifica come necessario
      body: {
        text: squealChatTextareaValue, // Assumi che questo sia il testo del tuo messaggio
        link: displayedLink || '', // Aggiungi questo campo solo se è stato inserito un link
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
        video: capturedVideo || '', // Aggiungi questo campo solo se è stato caricato un video
        position: position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
      },
      photoprofile: actualUser.photoProfile, // Assumi che `actualUser` contenga l'URL della foto profilo
      date: new Date().toISOString(),
      hour: new Date().getHours(),
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
      console.log('Squeal inviato con successo:', result);
      window.location.href = "http://localhost:8080/squealer-app/profile";
    } catch (error) {
      console.error('Errore nell\'invio del Squeal:', error);
      // ...gestione dell'errore...
    }
  }; 
  
  


  /*--------------------------------------------------------------------Scrivi canale------------------------------------------------------------------------------*/
  const fakeChannels = ['Canale1', 'Canale2', 'Canale3', 'Canale4', 'Canale5']; // Elenco finto di canali per test 

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
  
  const handleChannelSelection = (channel) => {
    setChannelSearch(channel.name); // Imposta l'input di ricerca sul canale selezionato
    setSuggestedChannels([]); // Svuota i canali suggeriti
  };

  const hanleUpdateChannelPosts = async (channelSelectedToUpdate) => {
    const channelDataUpdatePost = {
      answers: [],
      body: {
        text: squealChatTextareaValue, // Assumi che questo sia il testo del tuo messaggio
        link: displayedLink || '', // Aggiungi questo campo solo se è stato inserito un link
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
        video: capturedVideo || '', // Aggiungi questo campo solo se è stato caricato un video
        position: position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
      },
      category: null,
      date: new Date().toISOString(),
      hour: new Date().getHours(),
      impressions: 0,
      neg_reactions: 0,
      pos_reactions: 0,
      photoprofile: actualUser.photoProfile || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      receivers: channelSelected.list_users.map(user => `@${user.nickname}`),
      seconds: new Date().getSeconds(),
      sender: actualUser.nickname,
      typesender: 'channels',
      usersReactions: [],
      usersViewed: [],
    }

    if (!channelSelected || !channelSelected._id) {
      console.error("Nessun canale selezionato o ID canale mancante.");
      return;
  }

    const updatedListPosts = [...channelSelected.list_posts, channelDataUpdatePost];
    try {
      console.log("Canale selezionato id: ", channelSelected._id);
      console.log("Cose da aggiornare: ", channelDataUpdatePost);
      const resultChannel = await updateChannel(channelSelected._id, channelDataUpdatePost);
      console.log('Canale aggiornato con successo:', resultChannel);
    } catch (error) {
      console.error('Errore nell\'aggiornamento del canale:', error);
    }
  };

  const handleSendChannelSqueal = async () => {
    const squealData = {
      sender: actualUser.nickname, // Assumi che `actualUser` contenga il nickname del mittente
      typesender: 'channels', // Modifica come necessario
      body: {
        text: squealChatTextareaValue, // Assumi che questo sia il testo del tuo messaggio
        link: displayedLink || '', // Aggiungi questo campo solo se è stato inserito un link
        photo: capturedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
        video: capturedVideo || '', // Aggiungi questo campo solo se è stato caricato un video
        position: position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
      },
      photoprofile: actualUser.photoProfile || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Assumi che `actualUser` contenga l'URL della foto profilo
      date: new Date().toISOString(),
      hour: new Date().getHours(),
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', // Aggiungi logica per determinare la categoria se necessario
      receivers: channelSelected.list_users.map(user => `@${user.nickname}`), 
      channel: channelSelected.name, // Aggiungi logica se il squeal è associato a un canale
      impressions: 0,
    };
  
    console.log("Canale selezionato: ", channelSelected)
    console.log("Squeal data: ", squealData);
    try {
      const resultAddSqueal = await addSqueal(squealData);
      if (true){
        await hanleUpdateChannelPosts(channelSelected);
      } else {
        console.log("Non ci entra")
      }
      console.log('Squeal inviato con successo:', resultAddSqueal);
      const textChars = squealData.body.text.length; // caratteri nel testo del messaggio
      let imageChars = 0;
      let videoChars = 0;
      let linkChars = 0;
      let positionChars = 0;
      if (squealData.body.photo !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
        imageChars = squealData.body.photo ? 125 : 0; // aggiungi 125 caratteri se c'è un'immagine
      } else {
        imageChars = 0;
      }
      if (squealData.body.video !== '') {
        videoChars = squealData.body.video ? 125 : 0; // aggiungi 125 caratteri se c'è un video
      } else {
        videoChars = 0;
      }
      if (squealData.body.link !== '') {
        linkChars = squealData.body.link ? 125 : 0; // aggiungi 125 caratteri se c'è un link
      } else {
        linkChars = 0;
      }
      if (squealData.body.position !== '') {
        positionChars = squealData.body.position ? 125 : 0; // aggiungi 125 caratteri se c'è una posizione
      } else {
        positionChars = 0;
      }
      const usedChars = textChars + imageChars + videoChars + linkChars + positionChars; // somma tutti i caratteri

      handleUpdateUser(usedChars); // Aggiorna il numero di caratteri disponibili per l'utente
      // goToProfile();

    } catch (error) {
      console.error('Errore nell\'invio dello squeal nel canale:', error);
    }
  };
  

  useEffect(() => {
    if (defaultMessageSearch) {
      // Filtra i messaggi di default per quelli che includono il termine di ricerca dopo "/"
      const searchPattern = new RegExp(`${defaultMessageSearch}`, 'i'); // Case-insensitive search
      const filteredMessages = channelSelected?.list_mess.filter(message => 
        message.request.split('/').pop().match(searchPattern)
      );
      setSuggestedDefaultMessages(filteredMessages);
    } else {
      setSuggestedDefaultMessages([]);
    }
  }, [defaultMessageSearch, channelSelected]);

  const handleDefaultMessageSelection = (message) => {
    // Imposta il valore di defaultMessageSearch sul campo request del messaggio selezionato
    setDefaultMessageSearch(message);
    setIsDefaultMessageValid(true);
    console.log("Deafault message: ", defaultMessageSearch);
  };

  const cleanDefaultMessageSelection = () => {
    setDefaultMessageSearch('');
    setIsDefaultMessageValid(false);
    console.log("Deafault message cancellato: ", defaultMessageSearch);
  };
  
  const processDefaultMessageType = () => {
    console.log("Deafault message inviato: ", defaultMessageSearch);
    switch (defaultMessageSearch.type) {
      case 'Answer':
        handleSendChannelDefaultSqueal(defaultMessageSearch.body);
        break;
      case 'Casual Image':
        break;
      case 'News':
        break;
      case 'Twitter':
        break;
      case 'Wiki info':
        break;
      case 'Repeat':
        break;
      default:
    }
  }

  const handleSendChannelDefaultSqueal = async (defaultCamp) => {
    const squealData = {
      sender: actualUser.nickname, // Assumi che `actualUser` contenga il nickname del mittente
      typesender: channelSearch.typesender, // Modifica come necessario
      body: {
        text: defaultCamp.text, // Assumi che questo sia il testo del tuo messaggio
        link: defaultCamp.link || '', // Aggiungi questo campo solo se è stato inserito un link
        photo: defaultCamp.photo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
        video: defaultCamp.video || '', // Aggiungi questo campo solo se è stato caricato un video
        position: defaultCamp.position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
      },
      photoprofile: actualUser.photoProfile, // Assumi che `actualUser` contenga l'URL della foto profilo
      date: new Date().toISOString(),
      hour: new Date().getHours(),
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', // Aggiungi logica per determinare la categoria se necessario
      receivers: channelSelected.list_users.map(user => `@${user.nickname}`), 
      channel: channelSearch, // Aggiungi logica se il squeal è associato a un canale
      impressions: 0,
    };
  
    console.log("Squeal data: ", squealData);
    try {
      const resultAddSqueal = await addSqueal(squealData);
      console.log ("Canale selezionato: ", channelSelected);
      await hanleUpdateChannelDefaultMessage(channelSelected, defaultCamp);
      console.log('Squeal inviato con successo:', resultAddSqueal);
      const textChars = squealData.body.text.length; // caratteri nel testo del messaggio
      let imageChars = 0;
      let videoChars = 0;
      let linkChars = 0;
      let positionChars = 0;
      if (squealData.body.photo !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
        imageChars = squealData.body.photo ? 125 : 0; // aggiungi 125 caratteri se c'è un'immagine
      } else {
        imageChars = 0;
      }
      if (squealData.body.video !== '') {
        videoChars = squealData.body.video ? 125 : 0; // aggiungi 125 caratteri se c'è un video
      } else {
        videoChars = 0;
      }
      if (squealData.body.link !== '') {
        linkChars = squealData.body.link ? 125 : 0; // aggiungi 125 caratteri se c'è un link
      } else {
        linkChars = 0;
      }
      if (squealData.body.position !== '') {
        positionChars = squealData.body.position ? 125 : 0; // aggiungi 125 caratteri se c'è una posizione
      } else {
        positionChars = 0;
      }
      const usedChars = textChars + imageChars + videoChars + linkChars + positionChars; // somma tutti i caratteri

      handleUpdateUser(usedChars); // Aggiorna il numero di caratteri disponibili per l'utente
      // goToProfile();

    } catch (error) {
      console.error('Errore nell\'aggiornamento del canale:', error);
    }
  };

  const hanleUpdateChannelDefaultMessage = async (channelToUpdate, defaultCamp) => {
    const channelDataUpdatePost = {
      answers: [],
      body: {
        text: defaultCamp.text, // Assumi che questo sia il testo del tuo messaggio
        link: defaultCamp.link || '', // Aggiungi questo campo solo se è stato inserito un link
        photo: defaultCamp.photo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Aggiungi questo campo solo se è stata scattata una foto
        video: defaultCamp.video || '', // Aggiungi questo campo solo se è stato caricato un video
        position: defaultCamp.position  || '', // Aggiungi questo campo solo se è stata inserita una posizione
      },
      category: null,
      date: new Date().toISOString(),
      hour: new Date().getHours(),
      impressions: 0,
      neg_reactions: 0,
      photoprofile: actualUser.photoProfile,
      pos_reactions: 0,
      receivers: channelToUpdate.list_users.map(user => `@${user.nickname}`),
      seconds: new Date().getSeconds(),
      sender: actualUser.nickname,
      typesender: 'channels',
      usersReactions: [],
      usersViewed: [],
    }
    try {
      
      const resultChannel = await updateChannel(channelSelected._id, channelDataUpdatePost);
      console.log('Canale aggiornato con successo:', resultChannel);
    } catch (error) {
      console.error('Errore nell\'aggiornamento del canale:', error);
    }
  };


  /*--------------------------------------------------------------------Crea canale------------------------------------------------------------------------------*/
  const handleSelectUser = user => {
    // Controlla se l'utente esiste già in base alla proprietà "name"
    const userExists = selectedUsers2.some(u => u.name === user);

    if (!userExists) {
      // Se non esiste, aggiungi un nuovo oggetto con le proprietà "name" e "isAdmin"
      setSelectedUsers2(prevSelected => [...prevSelected, { name: user, isAdmin: false }]);
    }
  };

  const handleRemoveSelectedUser = userName => {
    setSelectedUsers2(prevSelected => prevSelected.filter(u => u.name !== userName));
  };

  const toggleAdminStatus = (userName) => {
    setSelectedUsers2(prevUsers => {
      return prevUsers.map(user => {
        if (user.name === userName) {
          return { ...user, isAdmin: !user.isAdmin };
        }
        return user;
      });
    });
  };

  // Funzione per gestire il cambiamento del testo nel textarea del reminder
  const handleReminderTextareaChange = (e) => {
    setReminderTextareaValue(e.target.value);
  };

  // Funzione per gestire l'invio del reminder
  const handleSendReminder = () => {
    // Qui puoi aggiungere la logica per inviare il reminder.
    console.log("Reminder inviato:", reminderTextareaValue);
  };

  // Funzione per gestire il click sull'icona della fotocamera del reminder
  const handleReminderLogoClick = () => {
    // Qui puoi aggiungere la logica per aprire la fotocamera e catturare un'immagine
    // per il momento, ho aggiunto una console log come placeholder
    console.log("Icona della fotocamera del reminder cliccata");
  };

  // Funzione per gestire il click sull'icona dell'URL del reminder
  const handleShowReminderLinkModal = () => {
    setShowReminderLinkModal(true);
  };

  // Funzione per gestire il click sull'icona della posizione del reminder
  const handleReminderLocationButtonClick = () => {
      // Qui puoi aggiungere la logica per ottenere e mostrare la posizione corrente
      // per il momento, ho aggiunto una console log come placeholder
      console.log("Icona della posizione del reminder cliccata");
  };

  const handleRemoveUser = (userToRemove) => {
    // Aggiorna lo stato rimuovendo l'utente
    setSelectedUsers(prevUsers => prevUsers.filter(user => user !== userToRemove));
  };

  const fetchUserDetails = async () => {
    try {
      // Resetta i dettagli degli utenti prima di caricarne di nuovi
      setUserDetails([]);
  
      // Ottieni i dettagli per ogni ID utente selezionato
      for (const userId of selectedUserIds) {
        const userData = await getUserById(userId);
        const userDetails = {
          blocked: false, // Puoi impostare i valori predefiniti o usarli da userData se disponibili
          cell: userData.cell || "",
          char_d: userData.char_d || 300,
          char_m: userData.char_m || 7000,
          char_w: userData.char_w || 2000,
          email: userData.email,
          fullname: userData.fullname,
          nickname: userData.nickname,
          notification: userData.notification || [true, true, true, true, true],
          password: userData.password,
          photoprofile: userData.photoprofile || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…tZ+iIV1ophfMy+kSgUDTiGsvF0SRUaR9xSPkVSB6jUSmv0f/Z",
          photoprofileX: userData.photoprofileX || 0,
          photoprofileY: userData.photoprofileY || 0,
          popularity: userData.popularity || 0,
          type: userData.type || "User",
          version: userData.version || "user",
          _id: userData._id,
        };
        setUserDetails(prevDetails => [...prevDetails, userDetails]);
        console.log('Dettagli dell\'utente:', userDetails);
      }
    } catch (error) {
      console.error('Errore durante il recupero dei dettagli dell\'utente:', error);
    }
  };
  
  const handleUserSelection2 = (nickname, userId) => {
    const newUser = { nickname, _id: userId };
    // Aggiungi questo oggetto all'array degli utenti selezionati
    setSelectedUsers(prevUsers => {
        // Verifica se l'utente è già presente nell'array per evitare duplicati
        const isUserAlreadySelected = prevUsers.some(user => user._id === userId);
        if (!isUserAlreadySelected) {
            return [...prevUsers, newUser];
        }
        return prevUsers;
    });
  };

  const processSelectedUsers = async () => {
    // Assicurati che userDetails sia vuoto o resettato prima di aggiungere nuovi dettagli degli utenti
    setUserDetails([]);
  
    // Recupera i dettagli di tutti gli utenti selezionati basandoti sugli ID in selectedUsers
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
          photoprofile: userData.photoprofile || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…tZ+iIV1ophfMy+kSgUDTiGsvF0SRUaR9xSPkVSB6jUSmv0f/Z",
          photoprofileX: userData.photoprofileX || 0,
          photoprofileY: userData.photoprofileY || 0,
          popularity: userData.popularity || 0,
          type: userData.type || "User",
          version: userData.version || "user",
          _id: userData._id,
        };
  
        // Aggiungi i dettagli dell'utente recuperato allo stato userDetails
        setUserDetails(prevDetails => [...prevDetails, userDetails]);
        console.log('Dettagli dell\'utente:', userDetails);
      } catch (error) {
        console.error('Errore durante il recupero dei dettagli dell\'utente:', error);
      }
    }
  
    // A questo punto userDetails contiene i dettagli di tutti gli utenti selezionati
    // Qui puoi procedere con ulteriori operazioni, come la creazione del canale con gli utenti selezionati
  };
  
  const handleRemoveUser2 = (userIdToRemove) => {
    setSelectedUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToRemove));
  };

  const handleCreateChannel = async () => {
    const channelData = {
      creator: actualUser.nickname, 
      photoProfile: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      photoprofilex: 0,
      photoprofiley: 0,
      name: channelName,
      type: '&', 
      list_mess: [],
      isSilenceable: isSilenceable,
      list_users: [creatorDetails, ...userDetails],
      list_posts: [],
      userSilenced: [],
      description: channelDescription,
      popularity: "",
    };
    
    try {
      const result = await addChannel(channelData);
      console.log('Canale creato con successo:', result);
  
      // Resetta lo stato o esegui altre azioni dopo la creazione del canale
      setChannelName('');
      setChannelDescription('');
      setChannelUsers([]);
      setUserDetails([]);
      setSelectedUserIds([]);
      setCreatorDetails({});
      setIsSilenceable(false);
      setShowChannelModal(true);
      // ... altre azioni se necessario ...
    } catch (error) {
      console.error('Errore nella creazione del canale:', error);
    }
  };

  const handleChannelModalClose = () => {
    setShowChannelModal(false);
  };

  const goToProfile = () => {
    navigate('/squealer-app/profile');
  };

  
  

    return (
      <>
        {/*Crea messaggio*/}
        <Container 
          style={{
            margin: '0',
            padding: '0',
            paddingTop: '2%',
            width: '80%',
            position:'absolute',
            left:'20%'
          }}
          className="mx-auto"
        >

          {/*Modali per fotocamera e URL*/}
          <>
            <Modal show={showCameraModal} onHide={() => setShowCameraModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Scatta una foto</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                />
                <Button className="mt-2" onClick={capture}>Scatta</Button>
                <div className="mt-2">
                    <label className="btn btn-primary">
                        Carica immagine
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

            <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Inserisci Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <FormControl
                            placeholder="Inserisci il tuo link qui"
                            value={inputLIink}
                            onChange={handleInputChange}
                        />
                        <InputGroup.Text>
                            <Button variant="primary" onClick={handleSubmitLink}>Invia</Button>
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
                                    Rimuovi
                                </Button>
                            )}
                        </InputGroup.Text>
                    </InputGroup>
                </Modal.Body>
            </Modal>

            <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)}>
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

          </>
    
          {/*Card per creazione messaggio*/}
          <div className="d-flex align-items-start">
            <Card className={isDropdownActive ? 'blurred mx-auto' : 'mx-auto'} id="create-messagge-card" style = {{overflowY: "scroll", maxHeight: "90vh", WebkitOverflowScrolling: "touch"}}>
              <Card.Body>
                
                {/*Parte comune*/}
                <Row>
                  {/*Icona profilo utente che scrive*/}
                  <Col className="col-1">
                    {/* <div class = "userProfilePicture">
                      <img src={actualUser.photoprofile} alt="Profile" style={{width: '40px', height: '40px', borderRadius: '50%'}}/>
                    </div> */}
                    <PersonCircle alt="Person-circle" size="30"/>
                  </Col>

                  {/*Selezione tipo messaggio*/}
                  <Col className='col-5'>
                    <Row>

                      {/*Squeal vs Canale*/}
                      <Col style ={{margin: '0px', padding: '0px'}}>
                        <Form.Select 
                          size="sm" 
                          className='Form-create-messagge-home' 
                          style={{ fontSize: '12px', width: '100px', backgroundColor: 'transparent', borderRadius: '18px', color: 'white', textAlign:'center'}}
                          value={messageType}
                          onChange={handleMessageTypeChange}
                          >
                            <option value="Squeal">Squeal</option>
                            <option value="Canale">Canale</option>
                        </Form.Select>
                      </Col>

                      {/*Pubblico vs Privato / Scrivi vs Crea*/}
                      <Col style ={{margin: '0px', padding: '0px'}}>
                        <Form.Select size="sm" 
                          className='Form-create-messagge-home' 
                          style={{
                            fontSize: '12px', 
                            width: '100px', 
                            backgroundColor: 'transparent', 
                            borderRadius: '18px', 
                            color: 'white', 
                            textAlign:'center',
                            borderColor: '#555', // Aggiunge un colore al bordo
                            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', // Aggiunge un'ombra sottile intorno al selettore
                            appearance: 'none', // Rimuove l'aspetto predefinito in alcuni browser
                          }}
                          svalue={squealOrChannelOption}
                          onChange={handleSquealOrChannelOptionChange}
                          >
                            {messageType === 'Squeal' ? (
                              <>
                                <option value="Pubblico" style={{color: 'white', backgroundColor: 'transparent', appearance: 'none'}}>Pubblico</option>
                                <option value="Privato" style={{color: 'white', backgroundColor: 'transparent', appearance: 'none'}}>Privato</option>
                              </>
                            ) : (
                              <>
                                <option value="Scrivi" style={{ backgroundColor: '#333', color: 'white' }}>Scrivi</option>
                                <option value="Crea" style={{ backgroundColor: '#333', color: 'white' }}>Crea</option>
                              </>
                            )}
                        </Form.Select>
                      </Col>

                    </Row>
                  </Col>
                </Row>

                {/*Messaggio pubblico*/}
                {(messageType === 'Squeal' && squealOrChannelOption === 'Pubblico') && (
                  <>
                    {/*Hashtag*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}}>
                      <Col xs={12} md={6}>
                        <textarea
                          value={text}
                          onChange={handleInputChangeHashtag}
                          maxLength={51}
                          style={{
                            width: '100%',
                            lineHeight: '1.5', // Imposta il valore di lineHeight
                            resize: 'none', // Impedisce il ridimensionamento verticale
                            height: '1.5em', // Imposta l'altezza fissa a una riga di testo
                            overflowX: 'hidden', // Nasconde lo scorrimento orizzontale
                            overflowY: 'hidden', // Nasconde lo scorrimento orizzontale
                            border: 'none', // Rimuove il bordo
                            scrollbarWidth: 'none', // Nasconde le frecce verticali
                            backgroundColor: 'transparent',
                            color: 'white',
                            fontSize: '20px',
                            outline: 'none',
                          }}
                          rows={1} // Imposta il numero di righe iniziali a 1
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                              e.preventDefault(); // Impedisce lo spostamento orizzontale con le frecce
                            }
                          }}
                        />
                      </Col>
                    </Row>
                    
                    {/*Textarea + logica allegati*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}}>
                      {/*Textarea*/}
                      <Col>
                        <Row>
                        <Col xs={12} md={10}>
                          <textarea
                            placeholder='A cosa stai pensando????'
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
                              resize: 'none', // Impedisce il ridimensionamento verticale
                              height: '100px', // Imposta l'altezza fissa a una riga di testo
                              overflowX: 'hidden', // Nasconde lo scorrimento orizzontale
                              border: 'none', // Rimuove il bordo
                              scrollbarWidth: 'none', // Nasconde le frecce verticali
                              backgroundColor: 'transparent',
                              color: 'white',
                              fontSize: '16px',
                              outline: 'none',
                            }}
                            rows={1} // Imposta il numero di righe iniziali a 1
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
                          <Col>
                          <div
                          style={{
                            textAlign: 'left', // Allinea il testo a destra all'interno del contatore
                            color: counterColor,
                            marginTop: '90%',
                          }}
                        >
                          {wordsRemaining}
                        </div>
                        </Col>
                        </Row>
                      </Col>

                        {/*Logica allegati*/}
                        <Row>
                          <Col xs={12} md={10}>
                            {position && isMapVisible &&(
                              <Card style={{  width: '200px', height: '100px', position: 'relative' }}>
                                <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                  <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  />
                                  <Marker position={position} icon={markerIcon}>
                                    <Popup>Sei qui!</Popup>
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
                              <div style={{ position: 'relative',  width: '200px', height: '100px', overflow: 'hidden' }}>
                              <img src={capturedImage} alt="Scattata"  />
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
                                    Il tuo browser non supporta il tag video.
                                  </video>
                                  <button 
                                    onClick={() => {
                                      setCapturedVideo(null);
                                      // Aggiorna il conteggio dei caratteri qui
                                      const remaining = calculateCharCount();
                                      setWordsRemaining(remaining);
                                      setPrivateWordsRemaining(calculatePrivateCharCount());
                                    }} 
                                    className="btn btn-sm btn-danger" 
                                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }} // Assicurati che lo z-index sia sufficiente per renderlo sopra il video
                                  >
                                    X
                                  </button>
                                </div>
                            )}
                            {displayedLink && (
                                <div style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                    <button 
                                        onClick={() => {
                                            setDisplayedLink('');
                                            setinputLIink('');
                                            // Aggiorna il conteggio dei caratteri qui
                                            const remaining = calculateCharCount();
                                            setWordsRemaining(remaining);
                                            setPrivateWordsRemaining(calculatePrivateCharCount());
                                        }} 
                                        className="btn btn-sm btn-danger" 
                                        style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }} // Assicurati che lo z-index sia sufficiente per renderlo sopra il link
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                          </Col>
                        </Row>
                    </Row>

                    {/*Allegati*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}}> 

                      {/*Fotocamera*/}
                      <Col className='col-1'>
                          {/* Icona della fotocamera cliccabile */}
                          <div 
                              id="cameraLogo" 
                              onClick={handleLogoClick}
                              style={{ cursor: 'pointer' }}
                          >
                              <Camera color="white" size={25} />
                          </div>
                      </Col>

                      {/* Icona per il caricamento del video */}
                      <Col className='col-1'>
                        <div 
                          id="videoLogo" 
                          onClick={() => setShowVideoModal(true)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Sostituisci con l'icona appropriata per il video */}
                          <Camera color="white" size={25} />
                        </div>
                      </Col>

                      {/*URL*/}
                      <Col className="col-1">
                        <button
                            onClick={() => setShowLinkModal(true)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                        <LinkLogo size={25} color="white" />
                        </button>
                      </Col>
                      
                      {/*Posizione*/}
                      <Col className="col-1">
                        {/* Pulsante per inviare la posizione */}
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
                          }}
                        >
                          <Globe size={25} color="white" />
                        </button>
                      </Col>

                      {/*Invio*/}
                      <Col className="col-1">
                        <Button onClick={controlChannel}>Invia</Button>
                      </Col>

                      
                    </Row>
                  </>
                )}

                {/*Messaggio privato*/}
                {(messageType === 'Squeal' && squealOrChannelOption === 'Privato') && (
                  <>
                    {/*Corpo messaggio*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}}>

                      {/*Barra ricerca utenti + corpo messaggio*/}
                      <Col>
                        <Row>
                          {/*Barra ricerca utenti + corpo messaggio*/}
                          <Col xs={12} md={10}>

                            {/*Barra ricerca utenti*/}
                            <FormControl
                                placeholder="Cerca utenti..."
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
                                  color: 'white'
                                }}
                            />

                            {/* Lista a tendina dei suggerimenti utenti*/}
                            {searchInput && suggestedUsers.length > 0 && (
                                <ul style={{border: '1px solid gray', maxHeight: '150px', overflowY: 'auto', color: 'white'}}>
                                    {suggestedUsers.map(user => (
                                        <li 
                                        key={user._id} 
                                        style={{padding: '10px', cursor: 'pointer', color: 'white'}}
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
                              placeholder='A cosa stai pensando????'
                              onChange={(e) => {
                                handlePrivateSquealChatTextareaChange(e); // Modificato qui
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
                                resize: 'none', // Impedisce il ridimensionamento verticale
                                height: '100px', // Imposta l'altezza fissa a una riga di testo
                                overflowX: 'hidden', // Nasconde lo scorrimento orizzontale
                                border: 'none', // Rimuove il bordo
                                scrollbarWidth: 'none', // Nasconde le frecce verticali
                                backgroundColor: 'transparent',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none',
                              }}
                              rows={1} // Imposta il numero di righe iniziali a 1
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

                          {/*Logica search + corpo*/}
                          <Col>
                            {/*Logica textarea*/}
                            <div
                              style={{
                                textAlign: 'left', // Allinea il testo a destra all'interno del contatore
                                color: privateWordsRemaining <= 10 ? 'red' : 'white',
                                marginTop: '90%',
                              }}
                            >
                            {privateWordsRemaining}
                            </div>
                          </Col>
                        </Row>
                      </Col>

                      {/*Allegati visibili*/}
                      <Row>
                          <Col xs={12} md={10}>
                            {position && isMapVisible &&(
                              <Card style={{ width: '100%', height: '200px', position: 'relative' }}>
                                <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                  <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  />
                                  <Marker position={position} icon={markerIcon}>
                                    <Popup>Sei qui!</Popup>
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
                              <div style={{ position: 'relative', width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
                              <img src={capturedImage} alt="Scattata" width="100%" />
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
                                      // Aggiorna il conteggio dei caratteri qui
                                      const remaining = calculateCharCount();
                                      setWordsRemaining(remaining);
                                      setPrivateWordsRemaining(calculatePrivateCharCount());
                                    }} 
                                    className="btn btn-sm btn-danger" 
                                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }} // Assicurati che lo z-index sia sufficiente per renderlo sopra il video
                                  >
                                    X
                                  </button>
                                </div>
                            )}
                            {displayedLink && (
                                <div style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                    <button 
                                        onClick={() => {
                                            setDisplayedLink('');
                                            setinputLIink('');
                                            // Aggiorna il conteggio dei caratteri qui
                                            const remaining = calculateCharCount();
                                            setWordsRemaining(remaining);
                                            setPrivateWordsRemaining(calculatePrivateCharCount());
                                        }} 
                                        className="btn btn-sm btn-danger" 
                                        style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }} // Assicurati che lo z-index sia sufficiente per renderlo sopra il link
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                          </Col>
                      </Row>

                    </Row>

                   {/*Loghi allegati / utenti selezionati*/}
                    <Row className="mt-2" style = {{marginLeft: '6%'}}> 

                        {/*Icona fotocamera*/}
                        <Col className='col-1'>
                            {/* Icona della fotocamera cliccabile */}
                            <div 
                                id="cameraLogo" 
                                onClick={handleLogoClick}
                                style={{ cursor: 'pointer' }}
                            >
                                <Camera color="white" size={25} />
                            </div>
                        </Col>

                        {/*Icona video*/}
                        <Col className='col-1'>
                          <div 
                            id="videoLogo" 
                            onClick={() => setShowVideoModal(true)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Sostituisci con l'icona appropriata per il video */}
                            <Camera color="white" size={25} />
                          </div>
                        </Col>

                        {/*Icona url*/}
                        <Col className="col-1">
                          <button
                              onClick={() => setShowLinkModal(true)}
                              style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'white'
                              }}
                          >
                          <LinkLogo size={25} color="white" />
                          </button>
                        </Col>

                        {/*Icona posizione*/}
                        <Col className="col-1">
                          {/* Pulsante per inviare la posizione */}
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
                            }}
                          >
                            <Globe size={25} color="white" />
                          </button>
                        </Col>

                        {/*Invio*/}
                        <Col className="col-1">
                          <Button onClick={handleSendPrivateSqueal}>Invia</Button>
                        </Col>

                        {/* Nome dell'utente selezionato accanto alle icone */}
                        {selectedUsers.map(user => (
                            <Col className="col-1" key={user} style={{color: 'white', padding: '0px'}}>
                                {user}
                            </Col>
                        ))}
                        
                    </Row> 
                  </>
                )}

                {/*Scrivi canale*/}
                {(messageType === 'Canale' && squealOrChannelOption === 'Scrivi') && (
                    <>
                        {/*Textarea + seleziona canale*/}
                        <Row className="mt-2" style = {{marginLeft: '6%'}}>
                          {/*Seleziona canale*/}
                          <>
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Cerca canali..."
                                    value={channelSearch}
                                    onChange={handleChannelSearchChange}
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
                                      color: 'white'
                                    }}
                                />
                            </InputGroup>

                            {/* Lista a tendina dei suggerimenti dei canali */}
                            {suggestedChannels.length > 0 && (
                                <ul style={{border: '1px solid gray', maxHeight: '150px', overflowY: 'auto'}}>
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
                            {channelSelected && (
                              <>
                              <div style={{display: "flex", flexDirection: "row"}}>
                                <input
                                  type="text"
                                  placeholder="Cerca messaggi di default..."
                                  value={defaultMessageSearch.request}
                                  disabled={isDefaultMessageValid}
                                  onChange={(e) => setDefaultMessageSearch(e.target.value)}
                                  style={{
                                    backgroundColor: 'transparent',
                                    borderColor: 'gray',
                                    color: 'white',
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
                                      color: 'white',
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
                              </>
                            )}


                          </>

                          {/*Textarea*/}
                          {(!isDefaultMessageValid) &&
                            <Col>
                              <Row>
                              <Col xs={12} md={10}>
                                <textarea
                                  placeholder='A cosa stai pensando????'
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
                                    resize: 'none', // Impedisce il ridimensionamento verticale
                                    height: '100px', // Imposta l'altezza fissa a una riga di testo
                                    overflowX: 'hidden', // Nasconde lo scorrimento orizzontale
                                    border: 'none', // Rimuove il bordo
                                    scrollbarWidth: 'none', // Nasconde le frecce verticali
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    fontSize: '16px',
                                    outline: 'none',
                                  }}
                                  rows={1} // Imposta il numero di righe iniziali a 1
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
                                <Col>
                                <div
                                style={{
                                  textAlign: 'left', // Allinea il testo a destra all'interno del contatore
                                  color: counterColor,
                                  marginTop: '90%',
                                }}
                              >
                                {wordsRemaining}
                              </div>
                              </Col>
                              </Row>
                            </Col>
                          }

                          {/*Logica allegati*/}
                          <Row>
                            <Col xs={12} md={10}>
                              {position && isMapVisible &&(
                                <Card style={{ width: '100%', height: '200px', position: 'relative' }}>
                                  <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                    <TileLayer
                                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={position} icon={markerIcon}>
                                      <Popup>Sei qui!</Popup>
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
                                <div style={{ position: 'relative', width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
                                <img src={capturedImage} alt="Scattata" width="100%" />
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
                                <div style={{ position: 'relative', width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
                                  <video width="100%" controls>
                                    <source src={capturedVideo} type="video/mp4" />
                                    Il tuo browser non supporta il tag video.
                                  </video>
                                  <button 
                                    onClick={() => {
                                      setCapturedVideo(null);
                                      // Aggiungi qui qualsiasi altra logica necessaria quando il video viene rimosso
                                    }} 
                                    className="btn btn-sm btn-danger" 
                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                  >
                                    X
                                  </button>
                                </div>
                              )}
                              {displayedLink && (
                                <div style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                    <button 
                                        onClick={() => {
                                            setDisplayedLink('');
                                            setinputLIink('');
                                            // Aggiorna il conteggio dei caratteri qui
                                            const remaining = calculateCharCount();
                                            setWordsRemaining(remaining);
                                            setPrivateWordsRemaining(calculatePrivateCharCount());
                                        }} 
                                        className="btn btn-sm btn-danger" 
                                        style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }} // Assicurati che lo z-index sia sufficiente per renderlo sopra il link
                                    >
                                        X
                                    </button>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </Row>

                        
                        {/*Allegati*/}
                        {(!isDefaultMessageValid) &&
                          <Row className="mt-2" style = {{marginLeft: '6%'}}> 
                          
                            {/*Fotocamera*/}
                              <Col className='col-1'>
                                  <div 
                                      id="cameraLogo" 
                                      onClick={handleLogoClick}
                                      style={{ cursor: 'pointer' }}
                                  >
                                      <Camera color="white" size={25} />
                                  </div>
                              </Col>
                            

                            {/*Icona video*/}
                            <Col className='col-1'>
                              <div 
                                id="videoLogo" 
                                onClick={() => setShowVideoModal(true)}
                                style={{ cursor: 'pointer' }}
                              >
                                {/* Sostituisci con l'icona appropriata per il video */}
                                <Camera color="white" size={25} />
                              </div>
                            </Col>

                            {/*URL*/}
                            <Col className="col-1">
                              <button
                                  onClick={() => setShowLinkModal(true)}
                                  style={{
                                      backgroundColor: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: 'white'
                                  }}
                              >
                              <LinkLogo size={25} color="white" />
                              </button>
                            </Col>
                            
                            {/*Posizione*/}
                            <Col className="col-1">
                              {/* Pulsante per inviare la posizione */}
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
                                }}
                              >
                                <Globe size={25} color="white" />
                              </button>
                            </Col>  

                            {/*Invio*/}
                            <Col className="col-1">
                              <Button onClick={handleSendChannelSqueal}>Invia</Button>
                            </Col> 
                          </Row>
                        }
                        {isDefaultMessageValid &&
                          <Col className="col-1">
                            <Button onClick={processDefaultMessageType}>Crea</Button>
                          </Col> 
                        }
                    </>
                )}

                {/*Crea canale*/}
                {(messageType === 'Canale' && squealOrChannelOption === 'Crea') && (
                  <Form style = {{marginTop:'4%', marginLeft: '8%'}}>
                    <Form.Group>
                      <Col>
                        {/*Nome canale + silenziabile*/}
                        <Row>
                          <Form.Control type="name" placeholder="Nome canale" value={channelName} onChange={e => setChannelName(e.target.value)}style = {{width: '50%'}}/>
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
                        <Row style = {{marginTop:'4%'}}>
                          <Form.Control type="description" placeholder="Descrizione" value={channelDescription} onChange={e => setChannelDescription(e.target.value)} style = {{width: '80%'}}/>
                        </Row>

                        {/*Aggiungi persone*/}
                        <Row style = {{marginTop:'4%'}}>
                          <input
                            type="text"
                            placeholder="Cerca Persone"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            style={{ width: '60%', border: '0px', margin: '0px'}}
                          />
                          {showDropdown && (
                            <>
                              <div style={{ marginTop: '4%' }}>
                                <strong>Utenti già inseriti</strong>
                                {selectedUsers.map(user => (
                                    <div key={user._id} style={{ position: 'relative', marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                        <a>{user.nickname}</a>
                                        <button 
                                          onClick={() => {
                                            handleRemoveUser2(user._id);
                                          }} 
                                          className="btn btn-sm btn-danger" 
                                          style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 10 }} // Assicurati che lo z-index sia sufficiente per renderlo sopra il link
                                        >
                                          X
                                        </button>
                                    </div>
                                ))}
                              </div>
                              {/* Aggiunta del modale per mostrare tutti gli utenti */}
                              <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Tutti gli utenti inseriti</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  {selectedUsers.map(user => (
                                      <Row key={user._id} style={{color: 'white', padding: '0px'}}>
                                          {user.nickname}
                                      </Row>
                                  ))}
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Chiudi
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                              <div style={{ marginTop: '4%' }}>
                                <strong>Utenti</strong>
                                {suggestedUsers.map(user => (
                                  <div key={user._id} style={{marginTop: '2%', cursor: 'pointer', color: 'white'}}
                                      onClick={() => {
                                        handleUserSelection2(user.nickname, user._id);
                                      }}>
                                    {user.nickname}
                                  </div>
                                ))}
                              </div>
                              <button style={{ display: 'block', margin: '10px auto' }} onClick={() => setShowDropdown(false)}>Chiudi</button>
                            </>
                          )}
                        </Row>
                        
                        {/*Invio*/}
                        <Row style = {{marginTop:'4%'}}>
                          <Button onClick={() =>{
                            processSelectedUsers();
                            setShowAreYouSure(true);
                          }
                          }>Crea</Button>
                        </Row>

                        {/*Are you sure*/}
                        <Row style = {{marginTop:'4%'}}>
                          {showAreYouSure && (
                            <div style={{ color: 'white' }}>
                              <p>Sei sicuro di voler creare il canale?</p>
                              <Button onClick={handleCreateChannel}>Sì</Button>
                              <Button onClick={() => setShowAreYouSure(false)}>No</Button>
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
              <Button variant="secondary" onClick={handleChannelModalClose}>
                Close
              </Button>
              <Button variant="primary" onClick={goToProfile}>
                Go to edit channel
              </Button>
            </Modal.Footer>
          </Modal>
        
        </Container>
      </>
    );
}

export default CreateMessage;
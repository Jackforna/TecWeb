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
import {getUsers, getListChannels, getUserById, getListSqueals, getActualUser, updateUsers, updateChannels, updateSqueals, addUser, addSqueal, addChannel} from './serverRequests.js';

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
  const maxChar = 150;
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  /*Private Messagge*/
  const [privateSquealChatTextareaValue, setPrivateSquealChatTextareaValue] = useState('');
  const [privateWordsRemaining, setPrivateWordsRemaining] = useState(200);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState(''); // Stato per l'input di ricerca
  const [suggestedUsers, setSuggestedUsers] = useState([]); // Stato per gli utenti suggeriti
  const [selectedUsers, setSelectedUsers] = useState([]); // Stato per gli utenti selezionati

  /*Scrivi canale*/
  const [channelSearch, setChannelSearch] = useState(''); // Per tenere traccia dell'input di ricerca
  const [suggestedChannels, setSuggestedChannels] = useState([]); // Canali suggeriti in base alla ricerca

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
    /*Crea canale - Reminder*/
    const [showReminderTextarea, setShowReminderTextarea] = useState(false);
    const [isReminderTextModified, setIsReminderTextModified] = useState(false);
    const [reminderTextareaValue, setReminderTextareaValue] = useState('');
    const [reminderPosition, setReminderPosition] = useState(null);
    const [isReminderMapVisible, setIsReminderMapVisible] = useState(false);
    const [reminderImage, setReminderImage] = useState(null);
    const [reminderLink, setReminderLink] = useState(null);
    const [showReminderLinkModal, setShowReminderLinkModal] = useState(false);


  useEffect(() => {
      const remaining = calculateCharCount();
      setWordsRemaining(remaining);
      setPrivateWordsRemaining(calculatePrivateCharCount());
      if (searchInput) {
        const results = allUsers.filter(user => user.toLowerCase().includes(searchInput.toLowerCase()));
        setSuggestedUsers(results);
      } else {
          setSuggestedUsers([]); // Rimuove i suggerimenti se l'input è vuoto
      }
    }, [squealChatTextareaValue, capturedImage, displayedLink, position, searchInput]);
  
  const handleFocus = () => {
    setShowIcon(false);
    setSuggestedProfiles(["Profilo 1", "Profilo 2", "Profilo 3"]);
    setIsSuggestionsVisible(true);
  };

  const handleBlur = () => {
    setShowIcon(true);
  };

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

  const handleInputChangeHashtag = (e) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/\s+/g, '_');
    const prefix = (messageType === 'Squeal' && squealOrChannelOption === 'Privato') ? '@' : '#';

    if (sanitizedValue.length <= 50 || inputValue === prefix) {
      setText(sanitizedValue.startsWith(prefix) ? sanitizedValue : prefix + sanitizedValue);
      setCharCount(sanitizedValue.startsWith(prefix) ? sanitizedValue.length : sanitizedValue.length + 1);
    }
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
  
  const handleSquealChatTextareaChange = (e) => {
    const inputValue = e.target.value;
    const remaining = calculateCharCount();

    if (inputValue.length < squealChatTextareaValue.length || remaining > 0) {
      setSquealChatSecondTextareaValue(inputValue);
      setWordsRemaining(remaining);
      if (remaining <= 10) {
        setCounterColor('red');
      } else {
        setCounterColor('purple');
      }
    } else {
      alert(`Hai superato il limite di ${maxChar} caratteri.`);
    }
  };

  const handlePrivateSquealChatTextareaChange = (e) => {
    const inputValue = e.target.value;
    setPrivateSquealChatTextareaValue(inputValue);
    const remaining = 200 - inputValue.length;
    setPrivateWordsRemaining(remaining);
  };

  const handleSendMessage = () => {
    if (squealChatTextareaValue.trim() !== '') {
      setSquealChatSecondTextareaValue('');
      setIsTextModified(false);
    }
  };

  const handleLogoClick = () => {
    setShowFileSelectionModal(true);
    setShowCameraModal(true);
  };
  
  const handleLocationButtonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        const remaining = calculateCharCount();
        setWordsRemaining(remaining);
        setPrivateWordsRemaining(calculatePrivateCharCount());
      }, (error) => {
        console.error(error);
      });
    } else {
      alert('La geolocalizzazione non è supportata dal tuo browser.');
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
  });

  const handleFileChange = (e) => {
    if (wordsRemaining >= 125) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCapturedImage(event.target.result);
          const remaining = calculateCharCount();
          setWordsRemaining(remaining);
          setPrivateWordsRemaining(calculatePrivateCharCount());
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
    if (wordsRemaining >= 125) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCameraModal(false);
      const remaining = calculateCharCount();
      setWordsRemaining(remaining);
      setPrivateWordsRemaining(calculatePrivateCharCount());
    } else {
      alert("Non hai abbastanza caratteri disponibili per aggiungere una foto.");
    }
  };
  
  const handleInputChange = (e) => {
    setinputLIink(e.target.value);
  };

  const handleSubmitLink = () => {
    if (wordsRemaining >= 125) {
      if (isLink(inputLIink)) {
        setDisplayedLink(inputLIink);
        setShowLinkModal(false);
        const remaining = calculateCharCount();
        setWordsRemaining(remaining);
        setPrivateWordsRemaining(calculatePrivateCharCount());
      } else {
        alert("Per favore inserisci un link che inizi con 'http://' o 'https://'.");
      }
    } else {
      alert("Non hai abbastanza caratteri disponibili per aggiungere un link.");
    }
  };     
  
  const isLink = (string) => {
    const regex = /^(http:\/\/|https:\/\/)/;
    return regex.test(string);
  }

  const calculateCharCount = () => {
    let count = maxChar - squealChatTextareaValue.length;
  
    if (capturedImage) count -= 125;
    if (displayedLink) count -= 125;
    if (position) count -= 125; // Assumendo che vuoi anche ridurre il conteggio quando inserisci una posizione
  
    return count;
  };
  
  const calculatePrivateCharCount = () => {
    let totalLength = squealChatTextareaValue.length;
    
    if (displayedLink) totalLength += 100;
    if (position) totalLength += 100; 
    if (capturedImage) totalLength += 100; 
    
    return 200 - totalLength;
  };

  /*Selezione tipo messaggio*/
  const handleDropdownOpen = () => {
    setIsDropdownActive(true);
    // il resto della logica per aprire il dropdown
  };
  const handleDropdownClose = () => {
    setIsDropdownActive(false);
    // il resto della logica per chiudere il dropdown
  };

  /*Squeal privato*/
  const handleUserSelection = (user) => {
    if (selectedUsers.includes(user)) {
        // Se l'utente è già selezionato, rimuovilo dalla lista
        setSelectedUsers(prevUsers => prevUsers.filter(u => u !== user));
    } else {
        // Altrimenti, aggiungilo alla lista se non si sono già raggiunti i 3 utenti
        if (selectedUsers.length < 3) {
            setSelectedUsers(prevUsers => [...prevUsers, user]);
        } else {
            alert('Puoi selezionare al massimo 3 utenti.');
        }
    }
    setSearchInput(''); // Pulisci l'input di ricerca dopo la selezione
    setSuggestedUsers([]); // Nascondi i suggerimenti dopo la selezione
  }
  const allUsers = [
    "Mario",
    "Marco",
    "Maria",
    "Marta",
    "Martina"
  ]; // Lista fittizia di utenti (in una situazione reale, questi dati potrebbero provenire da un database o da un'API)


  /*Scrivi canale*/
  const fakeChannels = ['Canale1', 'Canale2', 'Canale3', 'Canale4', 'Canale5']; // Elenco finto di canali
  const handleChannelSearchChange = (e) => {
      const searchValue = e.target.value;
      setChannelSearch(searchValue);

      // Filtra i canali fittizi in base all'input di ricerca e aggiorna i canali suggeriti
      const filteredChannels = fakeChannels.filter(channel => channel.toLowerCase().includes(searchValue.toLowerCase()));
      setSuggestedChannels(filteredChannels);
  };    
  const handleChannelSelection = (channel) => {
      setChannelSearch(channel); // Imposta l'input di ricerca sul canale selezionato
      setSuggestedChannels([]); // Svuota i canali suggeriti
  };

  /*Crea canale*/

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

    /*Crea canale - Reminder*/
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
          </>
    
          {/*Card per creazione messaggio*/}
          <div className="d-flex align-items-start">
            <Card className={isDropdownActive ? 'blurred mx-auto' : 'mx-auto'} id="create-messagge-card">
              <Card.Body>
                
                {/*Parte comune*/}
                <Row>
                  {/*Icona profilo utente che scrive*/}
                  <Col className="col-1">
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
                            {displayedLink && (
                                <div style={{ marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
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
                            {suggestedUsers.length > 0 && (
                                <ul style={{border: '1px solid gray', maxHeight: '150px', overflowY: 'auto'}}>
                                    {suggestedUsers.map(user => (
                                        <li 
                                        key={user} 
                                        style={{padding: '10px', cursor: 'pointer'}}
                                        onClick={() => handleUserSelection(user)}
                                        >
                                            {user}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Risultati della ricerca utenti*/}
                            {searchResults.map(user => (
                                <div key={user.id}>
                                    {user.name}
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
                                color: privateWordsRemaining <= 20 ? 'red' : 'white',
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
                            {displayedLink && (
                                <div style={{ marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
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

                        {/*Colonna vuota*/}
                        <Col className="col-1">

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
                                            key={channel} 
                                            style={{padding: '10px', cursor: 'pointer'}}
                                            onClick={() => handleChannelSelection(channel)}
                                        >
                                            {channel}
                                        </li>
                                    ))}
                                </ul>
                            )}
                          </>

                          {/*Textarea*/}
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
                              {displayedLink && (
                                  <div style={{ marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                      <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
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
                        </Row>
                    </>
                )}

                {/*Crea canale*/}
                {(messageType === 'Canale' && squealOrChannelOption === 'Crea') && (
                  <Form style = {{marginTop:'4%', marginLeft: '8%'}}>
                    <Form.Group>
                      <Col>
                        {/*Nome canale + silenziabile*/}
                        <Row>
                          <Form.Control type="name" placeholder="Nome canale" style = {{width: '50%'}}/>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Silenziabile"
                            style = {{width: 'fit-content', marginLeft: '4%'}}
                          />
                        </Row>

                        {/*Aggiungi persone*/}
                        <Row style = {{marginTop:'4%'}}>
                          <input
                            type="text"
                            placeholder="Cerca Persone"
                            value={searchTerm2}
                            onChange={e => setSearchTerm2(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            style={{ width: '60%', border: '0px', margin: '0px'}}
                          />
                          {showDropdown && (
                            <>
                              <div style={{ marginTop: '4%' }}>
                                <strong>Utenti già inseriti</strong>
                                {selectedUsers2.slice(0, 3).map(userObj => (
                                  <Row key={userObj.name} style={{ marginTop: '2%' }}>
                                    <Col>{userObj.name}</Col>
                                    <Col>
                                      <Form.Check 
                                        type="checkbox" 
                                        label="Amministratore" 
                                        checked={userObj.isAdmin}
                                        onChange={() => toggleAdminStatus(userObj.name)}
                                      />
                                    </Col>
                                    <Col><Button variant="primary" onClick={() => handleRemoveSelectedUser(userObj.name)}>Remove</Button></Col>
                                </Row>
                                ))}
                                {selectedUsers2.length > 3 && (
                                  <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setShowModal(true)}>
                                    Vedi tutti gli utenti
                                  </div>
                                )}
                              </div>
                              {/* Aggiunta del modale per mostrare tutti gli utenti */}
                              <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Tutti gli utenti inseriti</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  {selectedUsers2.map(userObj => (
                                    <Row key={userObj.name} style={{ marginTop: '2%' }}>
                                      <Col>{userObj.name}</Col>
                                      <Col>
                                        <Form.Check 
                                          type="checkbox" 
                                          label="Amministratore"
                                          checked={userObj.isAdmin}
                                          onChange={() => toggleAdminStatus(userObj.name)}
                                        />
                                      </Col>
                                      <Col><Button variant="primary" onClick={() => handleRemoveSelectedUser(userObj.name)}>Remove</Button></Col>
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
                                {filteredUsers2.map(user => (
                                  <div key={user} style={{marginTop: '2%' }}>
                                    <span onClick={() => handleSelectUser(user)} style={{ cursor: 'pointer' }}>{user}</span>
                                  </div>
                                ))}
                              </div>
                              <button style={{ display: 'block', margin: '10px auto' }} onClick={() => setShowDropdown(false)}>Chiudi</button>
                            </>
                          )}
                        </Row>

                        <Row style = {{marginTop:'4%'}}>
                          <div 
                            style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', backgroundColor: 'transparent', color: 'white', width: '60%', borderRadius: '18px'}} 
                            onClick={() => setShowDeafaultMessagge(!showDeafaultMessagge)}
                          >
                            Deafult messagge
                          </div>
                          {showDeafaultMessagge && (
                            <>
                              {/*Messaggio Welcome*/}
                              <Row style = {{marginTop:'4%'}}>
                              <div 
                                style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', backgroundColor: 'white', width: '80%'}} 
                                onClick={() => setShowTextarea(!showTextarea)}
                              >
                                Welcome message
                              </div>
                              {showTextarea && (
                                <>
                                <div className="d-flex align-items-start" style = {{padding: '0px', marginTop: '2%'}}>
                                  <Card className={isDropdownActive ? 'blurred' : ''} id="create-messagge-card" style = {{width: '80%'}}>
                                    <Card.Body>
                                      <Row className="mt-2">
                                        {/*Testo messaggio*/}
                                        <textarea
                                          placeholder='A cosa stai pensando????'
                                          onChange={(e) => {
                                            handlePrivateSquealChatTextareaChange(e); // Se questa funzione non ha più nulla a che fare con il conteggio dei caratteri, puoi mantenerla. Altrimenti, considera di rimuoverla.
                                            setIsTextModified(true);
                                          }}
                                          value={privateSquealChatTextareaValue}
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
                                            color: 'white',
                                            fontSize: '16px',
                                            outline: 'none',
                                          }}
                                          rows={1}
                                          onKeyDown={(e) => {
                                            // Questa è la logica per inviare il messaggio quando si preme "Enter".
                                            // Ho rimosso le condizioni relative al conteggio dei caratteri.
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
                                                }} 
                                                className="btn btn-sm btn-danger" 
                                                style={{ position: 'absolute', top: '10px', right: '10px' }}
                                              >
                                                X
                                              </button>
                                            </div>
                                            )}
                                            {displayedLink && (
                                                <div style={{ marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                                    <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                                </div>
                                            )}
                                          </Col>
                                        </Row>
                                      </Row>
                                      {/*Loghi allegati*/}
                                      <Row className="mt-2"> 

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

                                        {/*Colonna vuota*/}
                                        <Col className="col-1">

                                        </Col>
                                      </Row>
                                    </Card.Body>
                                  </Card>
                                </div>

                                </>
                              )}
                              </Row>

                              {/*Messaggio Answer*/}

                              {/*Messaggio Reminder*/}
                              <Row style = {{marginTop:'4%'}}>
                                <div 
                                  style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', backgroundColor: 'white', width: '80%'}} 
                                  onClick={() => setShowReminderTextarea(!showReminderTextarea)}
                                >
                                  Reminder message
                                </div>
                                {showReminderTextarea && (
                                  <>
                                  <Form.Select aria-label="Default select example" style = {{width: '60%', marginTop: '2%'}}>
                                    <option>Ogni quanto lo vuoi mettere</option>
                                    <option value="1">Ogni giorno</option>
                                    <option value="2">Ogni settimana</option>
                                    <option value="3">Ogni mese</option>
                                  </Form.Select>
                                  <div className="d-flex align-items-start" style = {{padding: '0px', marginTop: '2%'}}>
                                    <Card id="create-reminder-card" style = {{width: '80%', backgroundColor: 'transparent'}}>
                                      <Card.Body>
                                        <Row className="mt-2">
                                          {/*Testo messaggio*/}
                                          <textarea
                                            placeholder='Cosa desideri ricordare?'
                                            onChange={(e) => {
                                              handleReminderTextareaChange(e);
                                              setIsReminderTextModified(true);
                                            }}
                                            value={reminderTextareaValue}
                                            onBlur={() => {
                                              if (reminderTextareaValue.trim() === '') {
                                                setIsReminderTextModified(false);
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
                                              color: 'white',
                                              fontSize: '16px',
                                              outline: 'none',
                                            }}
                                            rows={1}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                if (reminderTextareaValue.trim() === '') {
                                                  setIsReminderTextModified(false);
                                                } else {
                                                  handleSendReminder();
                                                }
                                              }
                                            }}
                                            onFocus={() => {
                                              if (!isReminderTextModified) {
                                                setIsReminderTextModified(true);
                                              }
                                            }}
                                          />
                                          
                                          {/*Allegati visibili*/}
                                          <Row>
                                            <Col xs={12} md={10}>
                                              {reminderPosition && isReminderMapVisible &&(
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
                                              {reminderImage && (
                                                <div style={{ position: 'relative', width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
                                                  <img src={capturedImage} alt="Scattata" width="100%" />
                                                  <button 
                                                    onClick={() => {
                                                      setCapturedImage(null)
                                                    }} 
                                                    className="btn btn-sm btn-danger" 
                                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                                  >
                                                    X
                                                  </button>
                                                </div>
                                              )}
                                              {reminderLink && (
                                                <div style={{ marginTop: '10px', wordBreak: 'break-all', color: 'white' }}>
                                                  <a href={displayedLink} target="_blank" rel="noreferrer">{displayedLink}</a>
                                                </div>
                                              )}
                                            </Col>
                                          </Row>
                                        </Row>
                                        {/*Loghi allegati*/}
                                        <Row className="mt-2"> 
                                          {/*Icona fotocamera*/}
                                          <Col className='col-1'>
                                              <div 
                                                  id="reminderCameraLogo" 
                                                  onClick={handleReminderLogoClick}
                                                  style={{ cursor: 'pointer' }}
                                              >
                                                  <Camera color="white" size={25} />
                                              </div>
                                          </Col>

                                          {/*Icona url*/}
                                          <Col className="col-1">
                                            <button
                                                onClick={() => setShowReminderLinkModal(true)}
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
                                            <button
                                              onClick={() => {
                                                if (!isReminderMapVisible) {
                                                  setIsReminderMapVisible(true);
                                                } else {
                                                  handleReminderLocationButtonClick();
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

                                          {/*Colonna vuota*/}
                                          <Col className="col-1">
                                          </Col>
                                        </Row>
                                      </Card.Body>
                                    </Card>
                                  </div>
                                  </>
                                )}
                              </Row>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Form.Group>
                  </Form>
                )}

                
              </Card.Body>
            </Card>
          </div>
        
        </Container>
      </>
    );
}

export default CreateMessage;
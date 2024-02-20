import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';;
import { User, Channel } from 'src/app/models/user.moduls';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateMessageComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  videoWidth = 300;
  videoHeight = 300;
  streaming = false;


  profilePictureUrl: string | null = '';
  charLeftUser: number = 0;
  charLeftUserWeekly: number = 0;
  charLeftUserMonthly: number = 0;
  remainingChars: number = 0;
  userText: string = '';
  private maxLengthPrivate = 200; // Lunghezza massima per i messaggi privati
  originalCharLeftUser: number = 0; //Backup numero caratteri per il privato

  userDati = localStorage.getItem('Dati utente amministrato');
  datiUtente = this.userDati ? JSON.parse(this.userDati) : null;

  /*Modale fotocamera*/
  showCameraModal: boolean = false;
  imageDataUrl: string | null = null; // Variabile per tenere l'immagine
  sentImageUrl: string | null = null; // URL dell'immagine inviata

  /*Modale video*/
  showVideoModal: boolean = false;
  sentVideoUrl: string | null = null; 
  videoDataUrl: string | null = null; // Variabile per tenere il video
  videoPreviewUrl: string | null = null; // Variabile per tenere l'immagine del video

  /*Modale link*/
  showLinkModal: boolean = false;
  linkInput: string = '';
  sentLink: string | null = null; // Variabile per tenere il link inviato

  // Variabili per gestire la mappa
  userLocation: { lat: number, lng: number } | null = null;
  mapImageUrl: string | null = null;
  map: any;
  isMapActive: boolean = false;
  showMapModal: boolean = false;
  selectedLocation: L.Marker | null = null;
  tempMap: any;

  //Inserimento #hashtag
  myControl = new FormControl('');
  isPrivate: boolean = false;
  userControl = new FormControl(''); // Controllo per l'input utente

  //Invio squeal
  hashtag: string = '';

  //Gestione caso private
  isImageAttachmentEnabled = true;
  isLinkAttachmentEnabled = true;
  isLocationAttachmentEnabled = true;

  //Gestione canali
  isChannel: boolean = false;
  accessType: string = 'write';  // Opzione di default per Canale
  channelControl = new FormControl('');  // Controllo per l'input del nome del canale
  channelHaveDeafault: boolean = false;
  channelHaveRepeat: boolean = false;
  channelType: string = ''; // 
  selectedDefaultMessage: any = null;
  intervalId: number | null = null;
  showDeafaultMessage: boolean = false;

  //Inserimento utenti
  allUsers: User[] = []; // Questo ora conterrà un array di oggetti User
  filteredUsers: Observable<string[]> | undefined;
  userControl2 = new FormControl();
  selectedUser: string | null = null;
  selectedUsers: { nickname: string, photoprofile: string }[] = [];
  isSubmitting: boolean | undefined;
  isValidChannel: boolean | undefined;
;

  //Gestione crea canali
  newChannelName: string = ''; // Il nome per il nuovo canale
  muteChannel: boolean = false; // Lo stato del toggle per silenziare il canale
  allChannels: any[] = []; // Questo ora conterrà un array di oggetti Channel
  suggestedChannels: Channel[] = [];
  channelName: string = '';
  isChannelNameValid: boolean = false;
  allchannels: any[] = [];
  allCHANNELS: any[] = [];
  allkeywords: any[] = [];
  allChannelsprint: any[] = [];
  allkeywordsprint: any[] = [];
  listOfUsers: any[] = []; // Sostituisci any con un tipo appropriato
  existedChannel: boolean = false;
  channelSelected: any = null;

  //Gestione pop up caratteri
  showPurchasePopup = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private databaseService: DatabaseService, 
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
    ) { }

  ngOnInit() {
    console.clear();
    this.profilePictureUrl = this.datiUtente ? this.datiUtente.photoprofile : '';
    this.charLeftUser = this.datiUtente ? this.datiUtente.char_d : 0; 
    this.charLeftUserWeekly = this.datiUtente ? this.datiUtente.char_w : 0;
    this.charLeftUserMonthly = this.datiUtente ? this.datiUtente.char_m : 0;  
    this.remainingChars = this.charLeftUser; 

    // Recupera tutti gli utenti dal backend
    this.databaseService.getAllUsers2().subscribe((users: User[]) => {
      this.allUsers = users;
    });

    /* Logica crea canali
    this.databaseService.createChannel("Canale1", "Jacob").subscribe(
      response => {
        console.log('Canale creato:', response);
      },
      error => {
        console.error('Errore durante la creazione del canale:', error);
      }
    );

    this.databaseService.createChannel("Canale2", "Frank").subscribe(
      response => {
        console.log('Canale creato:', response);
      },
      error => {
        console.error('Errore durante la creazione del canale:', error);
      }
    );

    this.databaseService.createChannel("Canale3", "Giulia").subscribe(
      response => {
        console.log('Canale creato:', response);
      },
      error => {
        console.error('Errore durante la creazione del canale:', error);
      }
    );
    */

    this.databaseService.getAllChannels().subscribe(
      data => {
        this.allChannels = data; // Assumi che i dati siano l'elenco dei canali
        console.log('Canali:', this.allChannels);
      },
      error => {
        console.error('Si è verificato un errore:', error);
      }
    );

    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      filter(value => value !== null),
      map(value => value ? this._filter(value) : [])
    );

    this.loadChannels();

    this.updateInterval();

    // Aggiungi l'event listener per l'evento 'storage'
    window.addEventListener('storage', this.updateInterval);

    /*Test only*/
    // this.updateSquealPositive();
    // this.updateSquealNegative();
    // this.deleteAllSqueals();
    // this.deleteAllChannels();
    // this.deleteUser('6586c8e5b2ca7d845782751f')
    // this.deleteUser('6586c9c3733a4e33a55d91b7')
    // this.deleteUser('6596f39d4414dae1dd472cb0')
    // this.addChannel();
    // this.addChannel2();
    // this.getAllChannels();
  }

  ngOnDestroy() {
    // Rimuovi l'event listener quando il componente viene smontato
    window.removeEventListener('storage', this.updateInterval);

    // Ferma l'intervallo se attivo
    this.stopInterval();
  }

  
  ngAfterViewInit() {

  }

/*********************************************************************************COMUNI******************************************************************************/
  /*Ottieni canali per tipo*/
  loadChannels(): void {
    this.databaseService.getAllChannels().subscribe({
      next: (channels) => {
        channels.forEach((channel: any) => {
          switch (channel.type) {
            case '&':
              this.allchannels.push(channel);
              break;
            case '$':
              this.allCHANNELS.push(channel);
              break;
            case '#':
              this.allkeywords.push(channel);
              break;
            default:
              // gestire eventuali altri casi o errori
              break;
          }
        });
        this.updatePrintLists();
      },
      error: (error) => {
        console.error('Errore durante il recupero dei canali:', error);
      }
    });
  }

  updatePrintLists(): void {
    this.allChannelsprint = [];
    this.allkeywordsprint = [];

    this.allchannels.forEach(channel => {
      if (channel.list_users.some((user: { nickname: any; }) => user.nickname === this.datiUtente.nickname)) {
        this.allChannelsprint.push(channel);
        console.log('Canale:', channel);
      }
    });

    this.allCHANNELS.forEach(channel => {
      if (channel.list_users.some((user: { nickname: any; type: string; }) => user.nickname === this.datiUtente.nickname && (user.type === 'Modifier' || user.type === 'Creator'))) {
        this.allChannelsprint.push(channel);
        console.log('Canale:', channel);
      }
    });

    this.allkeywords.forEach(keyword => {
      if (keyword.list_users.some((user: { nickname: any; }) => user.nickname === this.datiUtente.nickname)) {
        this.allkeywordsprint.push(keyword);
        console.log('Keyword:', keyword);
      }
    });
  }

  /*Aggiornamnto caratteri rimanenti*/
  updateCharLeftUser(event: Event) {
    // Controlla se l'evento o il target dell'evento sono definiti
    if (!event || !(event.target instanceof HTMLTextAreaElement)) {
      // Se non lo sono, non eseguire la logica e termina la funzione
      return;
    }
  
    const textarea = event.target as HTMLTextAreaElement;
    let textLength = textarea.value.length;
  
    const attachmentChars = this.calculateAttachmentChars();
  
    if (this.isPrivate) { 
      let remainingCharsPrivate = this.maxLengthPrivate - textLength - attachmentChars;
  
      // Se i caratteri rimanenti sono sotto zero, tronca il testo
      if (remainingCharsPrivate < 0) {
        textLength = this.maxLengthPrivate - attachmentChars;
        textarea.value = textarea.value.substring(0, textLength);
        remainingCharsPrivate = 0;
      }
      this.remainingChars = remainingCharsPrivate;
    } else {
      // Calcola i caratteri rimanenti
      let remainingChars = this.charLeftUser - textLength - attachmentChars;
  
      // Se i caratteri rimanenti sono sotto zero, tronca il testo
      if (remainingChars < 0) {
        textLength += remainingChars;
        textarea.value = textarea.value.substring(0, textLength);
        remainingChars = 0;
      }

      if (remainingChars === 10) {
        this.showPurchasePopup = true;
      }
  
      this.remainingChars = remainingChars;
    }
  }

  updateRemainingChars() {
    const attachmentChars = this.calculateAttachmentChars();
    const textLength = this.userText.length;
    this.remainingChars = this.charLeftUser - textLength - attachmentChars;
  }
  
  calculateAttachmentChars() {
    let chars = 0;
    if (this.sentImageUrl) chars += 150; // Costo per l'immagine
    if (this.sentVideoUrl) chars += 150; // Costo per il video
    if (this.sentLink) chars += 150; // Costo per il link
    if (this.userLocation) chars += 150; // Costo per la posizione
    this.checkForCharacterLimit();
    return chars;
  }
  
  setCursorAtStart(event: any) {
    const target = event.target;

    // Controlla se il clic è avvenuto su una parte vuota della textarea
    if (target.selectionStart === target.selectionEnd && target.selectionStart >= this.userText.length) {
      target.selectionStart = this.userText.length;
      target.selectionEnd = this.userText.length;
    }
  }


  /*Modale fotocamera*/
  openCameraDialog(): void {
    this.showCameraModal = true;
    this.startCamera(); // Sposta qui l'avvio della webcam
  }

  openVideoDialog(): void {
    this.showVideoModal = true;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const fileType = file.type;
      const reader = new FileReader();
  
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileSrc = (e.target as FileReader).result as string;
        // this.videoDataUrl = fileSrc;
  
        if (fileType.startsWith('image/')) {
          // Gestione dell'immagine come prima
          this.handleImage(fileSrc);
        } else if (fileType.startsWith('video/')) {
          // Gestione del video
          // this.handleVideo(this.videoDataUrl);
          this.videoDataUrl = fileSrc; // Imposta l'URL del video
          this.videoPreviewUrl = fileSrc; // Utilizzato per l'anteprima nel modale
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  handleImage(imgSrc: string): void {
    this.imageDataUrl = imgSrc;
    const image = new Image();
    image.onload = () => {
      const canvasElement = this.canvasElement.nativeElement;
      const context = canvasElement.getContext('2d');
      const maxWidth = 300;
      const maxHeight = 300;
  
      let width = image.width;
      let height = image.height;
  
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
  
      if (context) {
        context.drawImage(image, 0, 0, width, height);
        canvasElement.style.display = 'block';
        this.videoElement.nativeElement.style.display = 'none';
      }
    };
    image.src = imgSrc;
  }
  
  handleVideo(videoSrc: string): void {
    // Salva l'URL del video per l'uso successivo
    this.videoDataUrl = videoSrc;
  
    // Crea un elemento video temporaneo per estrarre un frame
    const videoElement = document.createElement('video');
    videoElement.src = videoSrc;
  
    // Aspetta che il metadato del video sia caricato per assicurarsi che le dimensioni siano disponibili
    videoElement.addEventListener('loadedmetadata', () => {
      // Crea un canvas per disegnare il frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
  
      const context = canvas.getContext('2d');
      if (context) {
        // Disegna un frame del video sul canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
        // Converti il canvas in un'immagine per l'anteprima
        this.videoPreviewUrl = canvas.toDataURL('image/png');
      }
    });
    
    // Carica il video (è necessario per alcuni browser per attivare l'evento loadedmetadata)
    videoElement.load();
  }

  /*Foto modale*/
  closeCameraModal(): void {
    // Ferma la webcam
    if (this.videoElement && this.videoElement.nativeElement.srcObject) {
      const tracks = (this.videoElement.nativeElement.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    // Nasconde il modale della fotocamera
    this.showCameraModal = false;
    // Imposta lo streaming a false
    this.streaming = false;
  }  

  startCamera(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const videoElement = this.videoElement.nativeElement;
          if (videoElement) {
            videoElement.srcObject = stream;
            videoElement.addEventListener('loadedmetadata', () => {
              this.videoWidth = videoElement.videoWidth;
              this.videoHeight = videoElement.videoHeight;
              videoElement.play();
              this.streaming = true;
            });
          }
        })
        .catch(err => {
          console.error("Error starting video stream: ", err);
        });
    } else {
      alert('Sorry, your browser does not support getUserMedia');
    }
  }
  
  capturePhoto(): void {
    const videoElement = this.videoElement.nativeElement;
    const canvasElement = this.canvasElement.nativeElement;
    const context = canvasElement.getContext('2d');
  
    if (context && videoElement) {
      // Imposta le dimensioni del canvas identiche a quelle del video
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
  
      // Disegna l'immagine corrente del video sul canvas
      context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
  
      // Salva l'immagine come Data URL
      this.imageDataUrl = canvasElement.toDataURL('image/png');
  
      // Mostra il canvas e nascondi il video
      canvasElement.style.display = 'block';
      videoElement.style.display = 'none';
  
      // Ferma la webcam
      if (videoElement.srcObject instanceof MediaStream) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
  
      this.streaming = false; // Imposta streaming a false poiché la webcam è stata fermata
    }
  }
  // Funzione per ridisegnare l'immagine sul canvas se necessario
  redrawCanvas(): void {
    if (this.imageDataUrl) {
      const canvasElement = this.canvasElement.nativeElement;
      const context = canvasElement.getContext('2d');
      if (context) {
        // Crea una nuova immagine e disegnala sul canvas
        const image = new Image();
        image.onload = () => {
          context.drawImage(image, 0, 0, this.videoWidth, this.videoHeight);
        };
        image.src = this.imageDataUrl;
      }
    }
  }
  
  sendImage(): void {
    if (this.remainingChars >= 150) {
      if (!this.imageDataUrl) {
        this.capturePhoto();
      }
  
      // Chiudi il modale della fotocamera se è aperto
      this.closeCameraModal();
  
      if (this.imageDataUrl) {
        this.sentImageUrl = this.imageDataUrl;
        //this.remainingChars -= 150; // Sottrai il costo dell'immagine
        this.updateCharLeftUser({ target: { value: this.userText } } as unknown as Event);
        this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
      }
    } else {
      alert("Caratteri rimanenti insufficienti per allegare un'immagine.");
      this.showPurchasePopup = true;

    }
    this.disableOtherAttachments('image'); // Disabilita gli altri pulsanti di allegato
  }
  
  removeSentImage(): void {
    this.sentImageUrl = null; // Rimuove l'URL dell'immagine, quindi non sarà più visualizzata
    this.imageDataUrl = null; // Rimuove l'URL dell'immagine, quindi non sarà più visualizzata
    this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
    this.enableOtherAttachments(); // Riabilita gli altri pulsanti di allegato
  }


  /*Video modale*/
  removeSentVideo(): void {
    this.videoDataUrl = null;
    this.sentVideoUrl = null;
    this.videoPreviewUrl = null; // Utilizzato per l'anteprima nel modale
    this.showVideoModal = false;
    this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
    this.enableOtherAttachments(); // Riabilita gli altri pulsanti di allegato
  }
  
  sendVideo(): void {
    if (this.remainingChars >= 150) { // Assumi che il costo di un video sia 150 caratteri
      if (!this.videoDataUrl) {
        alert("Nessun video selezionato.");
        return;
      }
  
      // Chiudi il modale del video se è aperto
      this.closeVideoModal();
  
      // Imposta l'URL del video inviato
      this.sentVideoUrl = this.videoDataUrl;
  
      // Aggiorna il conteggio dei caratteri rimanenti
      this.updateCharLeftUser({ target: { value: this.userText } } as unknown as Event);
      this.updateRemainingChars();
  
      // Resetta l'URL del video per evitare riutilizzi
      this.videoDataUrl = null;
    } else {
      alert("Caratteri rimanenti insufficienti per allegare un video.");
      this.showPurchasePopup = true;
    }
  
    // Disabilita gli altri pulsanti di allegato se necessario
    this.disableOtherAttachments('video');
  }
  
  closeVideoModal(): void {
    this.showVideoModal = false;
  }


  /*Modale link*/
  openLinkDialog(): void {
    this.showLinkModal = true;
  }

  closeLinkModal(): void {
    this.showLinkModal = false;
    this.linkInput = ''; // Resetta l'input quando il modale si chiude
  }

  isValidUrl(url: string): boolean {
    // Qui puoi inserire una semplice validazione dell'URL o qualcosa di più sofisticato
    const pattern = /^(http|https):\/\/[^ "]+$/;
    return pattern.test(url);
  }

  validateAndSendLink(): void {
    if (this.remainingChars >= 150) {
      if (this.isValidUrl(this.linkInput)) {
        // Salva il link e chiudi il modale
        this.sentLink = this.linkInput;
        this.closeLinkModal();
  
        // Aggiorna il conteggio dei caratteri rimanenti
        //this.remainingChars -= 150;  // O usa la lunghezza del link se preferisci
        this.updateCharLeftUser({ target: { value: this.userText } } as unknown as Event);
        this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
      } else {
        alert('Il link inserito non è valido.');
      }
    } else {
      alert('Caratteri insufficienti per allegare un link.');
      this.showPurchasePopup = true;
    }
    this.disableOtherAttachments('link'); // Disabilita gli altri pulsanti di allegato
  }

  removeSentLink(): void {
    this.sentLink = null; // Rimuove il link, quindi non sarà più visualizzato
    this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
    this.enableOtherAttachments(); // Riabilita gli altri pulsanti di allegato
  }


/*Posizione*/
  /*Posizione reale*/
  // Metodo per ottenere la posizione dell'utente e generare la mappa
  
  getUserLocation(): void {
    if (this.remainingChars >= 150) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.isMapActive = true; // Imposta la mappa come attiva
            setTimeout(() => { // Aggiunge un breve ritardo
              this.generateMap();
              this.addMarkerToMap();
            }, 0);
            if (this.map) {
              this.map.setView([this.userLocation.lat, this.userLocation.lng], 15);
              setTimeout(() => {
                this.map.invalidateSize();
              }, 0);
            }
            //this.remainingChars -= 150; // Sottrai il costo della posizione
            this.updateCharLeftUser({ target: { value: this.userText } } as unknown as Event);
            this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
          },
          error => {
            console.error("Errore nell'ottenere la posizione: ", error);
            alert("Non è stato possibile ottenere la tua posizione. Errore: " + error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        alert("La geolocalizzazione non è supportata dal tuo browser.");
      }
    } else {
      alert('Caratteri rimanenti insufficienti per aggiungere la posizione.');
      this.showPurchasePopup = true;
    }
    this.disableOtherAttachments('location'); // Disabilita gli altri pulsanti di allegato
  }
  
  addMarkerToMap(): void {
    if (this.userLocation && this.map) {
      var iconElement = L.divIcon({
        className: 'my-custom-pin',
        html: '<i class="material-icons" style="color: red; font-size: 30px;">push_pin</i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
  
      const marker = L.marker([this.userLocation.lat, this.userLocation.lng], { icon: iconElement });
      marker.addTo(this.map).bindPopup('Sei qui!');
    }
  }
  
  // Metodo per generare l'URL dell'immagine della mappa (esempio con Google Maps Static API)
  generateMap(): void {
    if (this.userLocation) {
      // Create the map element if it doesn't exist
      if (!this.map) {
        this.map = L.map('leaflet-map').setView([this.userLocation.lat, this.userLocation.lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      } else {
        // Update the map's position
        this.map.setView([this.userLocation.lat, this.userLocation.lng], 15);
      }
    }
  }


  /*Mappa custom*/
  openMapModal(): void {
    this.showMapModal = true;
    setTimeout(() => {
      this.initTempMap();
    }, 0);
  }

  initMap(): void {
    if (!this.map) {
      this.map = L.map('leaflet-map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }
  
  confirmLocation(): void {
    if (this.remainingChars >= 150) {
      if (this.selectedLocation) {
        const latLng = this.selectedLocation.getLatLng();
        this.userLocation = { lat: latLng.lat, lng: latLng.lng };
        this.isMapActive = true;
        setTimeout(() => {
          this.generateMap();
          this.addMarkerToMap();
        }, 0);
        //this.remainingChars -= 150; // Sottrai il costo della posizione
        this.updateCharLeftUser({ target: { value: this.userText } } as unknown as Event);
        this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
      }
      this.closeMapModal();
    } else {
      alert('Caratteri rimanenti insufficienti per selezionare una posizione.');
      this.showPurchasePopup = true;
    }
  }
  
  removeMap(): void {
    this.isMapActive = false;
    // Potresti anche voler rimuovere il marker o resettare la userLocation
    this.userLocation = null;
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
    }
    this.enableOtherAttachments(); // Riabilita gli altri pulsanti di allegato
  }
  
  initTempMap(): void {
    this.tempMap = L.map('map-container').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.tempMap);
  
    this.tempMap.on('click', (e: { latlng: L.LatLngExpression; }) => {
      if (this.selectedLocation) {
        this.tempMap.removeLayer(this.selectedLocation);
      }
      // Crea e aggiunge direttamente il marker sulla mappa temporanea
      var iconElement = L.divIcon({
        className: 'my-custom-pin',
        html: '<i class="material-icons" style="color: red; font-size: 30px;">push_pin</i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
  
      this.selectedLocation = L.marker(e.latlng, { icon: iconElement }).addTo(this.tempMap);
      this.selectedLocation.bindPopup('Sei qui!');
    });
  }
  
  closeMapModal(): void {
    this.showMapModal = false;
    if (this.tempMap) {
      this.tempMap.remove();
      this.tempMap = null;
    }
  }

  
  /*Hashtag vs Private*/
  onSelectChange(event: any) {
    this.isPrivate = event.target.value === 'private';
    if (this.isPrivate) {
      // Salva il valore originale e imposta il limite a 200 in modalità privata
      this.originalCharLeftUser = this.charLeftUser;
      this.charLeftUser = 200;
    } else {
      // Ripristina il valore originale in modalità pubblica
      this.charLeftUser = this.originalCharLeftUser;
    }
    // Aggiorna i caratteri rimanenti
    this.updateCharLeftUser({} as Event);
  }
  
  onHashtagInput(event: any) {
    let value = event.target.value;
    if (value.length > 25) {
      // Tronca la stringa a 25 caratteri
      value = value.substr(0, 25);
    }
    // Sostituisce ogni spazio con "_"
    value = value.replace(/\s+/g, '_');
    // Aggiorna il valore dell'input con la stringa modificata
    event.target.value = value;
  }

  onUserInput(event: any) {
    let value = event.target.value;
    if (value.length > 25) {
      // Tronca la stringa a 25 caratteri
      value = value.substr(0, 25);
    }
    // Sostituisce ogni spazio con "_"
    value = value.replace(/\s+/g, '_');
    // Aggiorna il valore dell'input con la stringa modificata
    event.target.value = value;
  }

  controlHashtagExist() {
    const foundChannel = this.allkeywordsprint.find(channel => channel.name === this.hashtag);

    if (foundChannel) {
      console.log('Hashtag esistente:', foundChannel);
      this.listOfUsers = foundChannel.list_users;
      this.handleSendPublicSqueal(foundChannel, true);
    } else {
      console.log('Hashtag non esistente.');
      this.listOfUsers = [this.datiUtente.nickname];
      this.handleSendPublicSqueal(foundChannel, false);
    }
  }

  handleSendPublicSqueal(channelToUpdate: any, flag: boolean): void {
    // Assumi che questi dati vengano recuperati dal contesto dell'utente o generati automaticamente
    const sender = this.datiUtente ? this.datiUtente.nickname : 'Unknown';
    const typeSender = 'keywords'; // O altro valore a seconda della logica
    const photoProfile = this.datiUtente ? this.datiUtente.photoprofile : '';
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const hour = currentDate.getHours();
    const seconds = currentDate.getSeconds();
    const hashtag = this.hashtag;
  
    // Creazione dell'oggetto squeal
    const squealData = {
      sender: sender,
      typeSender: typeSender,
      body: {
        text: this.userText,
        link: this.sentLink || '',
        photo: this.sentImageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        position: this.userLocation ? [this.userLocation.lat, this.userLocation.lng] : [],
        video: this.sentVideoUrl || '',
      },
      photoprofile: photoProfile,
      date: date,
      hour: hour,
      seconds: seconds,
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', // Aggiungi logica per determinare la categoria se necessario
      receivers: [this.listOfUsers], // Aggiungi logica se ci sono destinatari specifici
      channel: hashtag, // Aggiungi logica se il squeal è associato a un canale
      impressions: 0
    };
  
    // Chiamata al servizio per aggiungere il squeal
    this.databaseService.addSqueal(squealData).subscribe({
      next: (response) => {
        if (flag == true) {
          console.log("Aggiornamento del canale esistente");
          this.handleUpdateHashtagChannel(channelToUpdate);
        } else {
          console.log("Creazione del canale");
          this.handleCreateHashtagChannel(channelToUpdate);
        }
        console.log('Squeal added successfully', response);
        // Calcola i caratteri utilizzati (inclusi gli allegati)
        const charsUsed = this.userText.length + this.calculateAttachmentChars();
        const userId = this.datiUtente ? this.datiUtente._id : null;
        console.log('Caratteri utilizzati:', charsUsed);
        console.log('ID utente:', userId);

        // Assicurati che userId sia valido
        if (userId) {
          const newCharLeftDaily = Math.max(0, this.charLeftUser - charsUsed);
          const newCharLeftWeekly = Math.max(0, this.charLeftUserWeekly - charsUsed);
          const newCharLeftMonthly = Math.max(0, this.charLeftUserMonthly - charsUsed);

          const updateData = {
            char_d: newCharLeftDaily,
            char_w: newCharLeftWeekly,
            char_m: newCharLeftMonthly
          };
    
          // Aggiorna i dati dell'utente nel backend
          this.databaseService.updateUserProfile(userId, updateData).subscribe({
            next: (updateResponse) => {
              console.log('Risposta del server:', updateResponse);
    
              // Aggiorna i valori locali
              this.charLeftUser = newCharLeftDaily;
              this.charLeftUserWeekly = newCharLeftWeekly;
              this.charLeftUserMonthly = newCharLeftMonthly;
    
              // Aggiorna il localStorage
              const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
              userData.char_d = newCharLeftDaily;
              userData.char_w = newCharLeftWeekly;
              userData.char_m = newCharLeftMonthly;
              localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
            },
            error: (updateError) => {
              console.error("Errore durante l'aggiornamento dei dati utente:", updateError);
            }
          });
        }
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding squeal', error);
      }
    });
  };

  handleUpdateHashtagChannel(channelToUpdate: any): void {
    const channelDataUpdatePost = {
      answer: [],
      body: {
        text: this.userText,
        link: this.sentLink || '',
        photo: this.sentImageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        position: this.userLocation ? [this.userLocation.lat, this.userLocation.lng] : [],
        video: this.sentVideoUrl || '',
      },
      category: null,
      date: new Date(),
      hour: new Date().getHours(),
      seconds: new Date().getSeconds(),
      impressions: 0,
      neg_reactions: 0,
      pos_reactions: 0,
      photoprofile: this.datiUtente.photoprofile,
      receivers: channelToUpdate.list_users.map((user: { nickname: any; }) => `@${user.nickname}`),
      sender: this.datiUtente.nickname,
      typeSender: 'keywords',
      usersReactions: [],
      usersViewed: [],
    };
    this.databaseService.updateChannel(channelToUpdate._id, channelDataUpdatePost).subscribe({
      next: (response) => {
        console.log('Canale aggiornato con successo:', response);

      },
      error: (error) => {
        console.error('Errore durante l\'aggiornamento del canale:', error);
      }
    });
  };

  handleCreateHashtagChannel(channelToUpdate: any): void {
    const channelDataCreatePost = {
      creator: this.datiUtente.nickname,
      photoprofile: this.datiUtente.photoprofile,
      photoprofilex: 0,
      photoprofiley: 0,
      name: this.hashtag,
      type: '#',
      list_mess: [],
      list_users: [{
        blocked: false,
        cell: this.datiUtente.cell,
        char_d: this.datiUtente.char_d,
        char_m: this.datiUtente.char_m,
        char_w: this.datiUtente.char_w,
        email: this.datiUtente.email,
        fullname: this.datiUtente.fullname,
        nickname: this.datiUtente.nickname,
        notification: this.datiUtente.notification || [true, true, true, true, true],
        password: this.datiUtente.password,
        photoprofile: this.datiUtente.photoprofile,
        photoprofileX: this.datiUtente.photoprofileX || 0,
        photoprofileY: this.datiUtente.photoprofileX || 0,
        popularity: this.datiUtente.popularity,
        type: this.datiUtente.type || 'User',
        version: this.datiUtente.version || "user",
        _id: this.datiUtente._id
      }],
      list_posts: [{
        answer: [],
        body: {
          text: this.userText,
          link: this.sentLink || '',
          photo: this.sentImageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          position: this.userLocation ? [this.userLocation.lat, this.userLocation.lng] : [],
          video: this.sentVideoUrl || '',
        },
        category: null,
        date: new Date(),
        hour: new Date().getHours(),
        seconds: new Date().getSeconds(),
        impressions: 0,
        neg_reactions: 0,
        pos_reactions: 0,
        photoprofile: this.datiUtente.photoprofile,
        receivers: [`@${this.datiUtente.nickname}`],
        sender: this.datiUtente.nickname,
        typeSender: 'keywords',
        usersReactions: [],
        usersViewed: [],
      }],
      userSilenced: [],
      description: "",
      popularity: "",
    };
    this.databaseService.addChannel(channelDataCreatePost).subscribe({
      next: (response) => {
        console.log('Canale creato con successo:', response);
      },
      error: (error) => {
        console.error('Errore nella creazione del canale:', error);
      }
    });
  };


  disableOtherAttachments(selectedAttachment: string) {
    if (this.isPrivate) {
      this.isImageAttachmentEnabled = selectedAttachment === 'image';
      this.isLinkAttachmentEnabled = selectedAttachment === 'link';
      this.isLocationAttachmentEnabled = selectedAttachment === 'location';
    }
  }

  enableOtherAttachments() {
    this.isImageAttachmentEnabled = true;
    this.isLinkAttachmentEnabled = true;
    this.isLocationAttachmentEnabled = true;
  }

  /*Funzioni default*/
  randomUnsplashImage(width: any, height: any) {
    return(`https://source.unsplash.com/random/${width}x${height}`);
  }

  fetchRandomNews = async () => {
    try {
      const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/general/us.json');
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.articles.length);
      const article = data.articles[randomIndex];
      console.log("Articolo ", article);
      console.log("Articolo autore", article.author);
      return article;
    } catch (error) {
      console.error('Error fetching news:', error);
      return null;
    }
  };

  fetchRandomWikiArticle = async () => {
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

  updateInterval = () => {
    const secToRepeat = localStorage.getItem("secToRepeat");
    if (secToRepeat) {
      this.startInterval(parseInt(secToRepeat));
    } else {
      this.stopInterval();
    }
  };

  startInterval(n: number) {
    // Assicurati che non ci siano intervalli già in esecuzione
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    // Imposta un nuovo intervallo
    this.intervalId = window.setInterval(() => {
      let counter = parseInt(localStorage.getItem("Counter") || "0");
      counter++;
      localStorage.setItem("Counter", counter.toString());
      const tempBodyInterval =  {
        text: 'Questo è il messaggio numero : ' + counter,
        link: '',
        photo: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        video: '',
        position: '',
      }
      this.handleSendChannelDefaultSqueal(tempBodyInterval);
      alert("Messaggio inviato: " + counter);
      // Qui puoi chiamare altre funzioni, ad esempio per inviare un messaggio
    }, n * 1000); // n * 1000 per convertire i secondi in millisecondi
  }

  stopInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }


  /*Canale vs Squeal*/
  onTypeChange(event: any) {
    const newType = event.target.value;
    this.isChannel = newType === 'channel';
    
    this.resetForm();
    // Se stavi in "Squeal Privato" e passi a un'altra modalità, ripristina il conteggio dei caratteri
    if (this.isPrivate && newType !== 'private') {
      this.charLeftUser = this.originalCharLeftUser;
    }
  
    // Aggiorna lo stato "isPrivate" in base alla nuova selezione
    this.isPrivate = newType === 'private';
  
    // Resetta i controlli se cambia la selezione
    this.myControl.reset();
    this.userControl.reset();
    this.channelControl.reset();
  
    // Prima di aggiornare i caratteri rimanenti, verifica se il controllo esiste
    if (this.myControl && this.userControl && this.channelControl) {
      this.updateCharLeftUser({} as Event); // Aggiorna solo se i controlli esistono
    }
  }
  
  onAccessChange(event: any) {
    this.accessType = event.target.value;
  }

  onChannelInput(event: any) {
    const inputValue = event.target.value;
    this.isChannelNameValid = this.allChannelsprint.some(channel => channel.name === inputValue);
    this.suggestedChannels = this.allChannelsprint
      .filter(channel => channel.name.includes(inputValue))
      .slice(0, 3); // Prende solo i primi 3 canali corrispondenti
  }

  /*
  selectSuggestedChannel(channel: Channel): void {
    this.channelControl.setValue(channel.name);
    this.suggestedChannels = []; // Pulisce i suggerimenti dopo la selezione
    this.isChannelValid();
  }
  */

  selectSuggestedChannel(channel: Channel): void {
    this.channelControl.setValue(channel.name);
    this.channelSelected = channel;
    this.suggestedChannels = [];
    this.validateChannelName(); // Convalida il nome del canale
    if ( channel.list_mess.length > 0 ) {
      this.channelHaveDeafault = true;
      if (channel.list_mess.map(message => message.type === 'Repeat')) {
        this.channelHaveRepeat = true;
      }
    } 
    if (channel.type === '&'){
      this.channelType = 'channels';
    } else if (channel.type === '$'){
      this.channelType = 'CHANNELS';
    }
    this.changeDetectorRef.markForCheck(); // Forza il rilevamento dei cambiamenti
  }

  selectDefaultMessage(message: any): void {
    this.selectedDefaultMessage = message;
    console.log("Messaggio selezionato: ", message);
    // Puoi anche eseguire altre azioni qui, come preparare il messaggio per l'invio
  }
  
  validateChannelName(): void {
    this.isChannelNameValid = this.allChannels.some(ch => ch.name === this.channelControl.value);
    this.isSubmitting = !this.isChannelNameValid;
  }

  isChannelValid(): void {
    // Controlla se il nome del canale è nella lista dei canali esistenti
    this.isValidChannel = this.allChannels.some(ch => ch.name === this.channelControl.value);
    // Abilita o disabilita il bottone di invio in base alla validità del canale
    this.isSubmitting = !this.isValidChannel;
    this.changeDetectorRef.detectChanges(); // Forza il rilevamento dei cambiamenti
  }

  processDefaultMessage(): void {
    switch (this.selectedDefaultMessage.type) {
      case 'Answer':
        console.log('Risposta selezionata:', this.selectedDefaultMessage.body);
        this.handleSendChannelDefaultSqueal(this.selectedDefaultMessage.body);
        break;
      case 'Casual Images':
        const tempImageBody = {
          text: '',
          link: '',
          photo: this.randomUnsplashImage(300, 300),
          video: '',
          position: '',
        }
        this.handleSendChannelDefaultSqueal(tempImageBody);
        break;
      case 'News':
        this.fetchRandomNews().then((article) => {
          if (article) {
            if (article.author === null) {
              article.author = 'Unknown';
            }
            const tempNewsBody = {
              text: "Author: " + article.author + "\n" + article.content + "\nPublished at: " + article.publishedAt,
              link: article.url || '',
              photo: article.urlToImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
              video: '',
              position: '',
            }
            this.handleSendChannelDefaultSqueal(tempNewsBody);
          }
        }
        );
        break;
      case 'WikiInfo':
        this.fetchRandomWikiArticle().then((url) => {
          if (url) {
            const tempBodyWiki =  {
              text: 'Lo sapevi che: ',
              link: url || '',
              photo: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
              video: '',
              position: '',
            }
            this.handleSendChannelDefaultSqueal(tempBodyWiki);
          }
        });
        break;
      default:
        break;
    }
  };  

  processRepeatMessage(): void {
    if (!this.channelSelected || !this.channelSelected.list_mess) {
      console.error('channelSelected o list_mess non definiti');
      return;
    }
    const repeat = this.channelSelected.list_mess.find((message: { type: any; }) => message.type === 'Repeat');
    if (!repeat) {
      console.error('Nessun messaggio di tipo Repeat trovato');
      return;
    }
    if (localStorage.getItem('Interval active')) {
      alert('Intervallo già attivo');
      return;
    }
    const inputString = repeat.repetition;
    const numbers = inputString.match(/\d+/g).map(Number);
    localStorage.setItem('Interval active', 'true');
    localStorage.setItem('secToRepeat', numbers.toString());
    localStorage.setItem('Counter', "0");
    localStorage.setItem('ChannelSelectedListUsers', JSON.stringify(this.channelSelected.list_users.map((user: { nickname: any; }) => `@${user.nickname}`)));
    console.log("Utenti in list users ", localStorage.getItem('ChannelSelectedListUsers'));
    localStorage.setItem('ChannelSelectedName', this.channelSelected.name);
    localStorage.setItem('PhotoProfile', this.datiUtente.photoprofile);
    localStorage.setItem('Nickname', this.datiUtente.nickname);
    localStorage.setItem('Channel_id', this.channelSelected._id);
    if ( this.channelSelected.type === '&') {
      localStorage.setItem('ChannelTypeSender', "channels");
    } else {
      localStorage.setItem('ChannelTypeSender', "CHANNELS");
    }
    window.location.reload();
  }

  stopProcessRepeatMessage = async () => {
    if (localStorage.getItem('Interval active')) {
      localStorage.removeItem('Interval active');
      localStorage.removeItem('secToRepeat');
      localStorage.removeItem('Counter');
      localStorage.removeItem('ChannelSelectedListUsers');
      localStorage.removeItem('ChannelSelectedName');
      localStorage.removeItem('ChannelTypeSender');
      localStorage.removeItem('PhotoProfile');
      localStorage.removeItem('Nickname');
      localStorage.removeItem('Channel_id');
      this.updateInterval();
    } else {
      alert('Nessun intervallo attivo');
    }
  };

  handleSendChannelDefaultSqueal(defaultCamp: any): void {
    const squealData = {
      sender: localStorage.getItem("Interval active") ? localStorage.getItem('Nickname') : this.datiUtente.nickname,
      typeSender: localStorage.getItem("Interval active") ? localStorage.getItem('ChannelTypeSender') : this.channelType, //Da modificare
      body: {
        text: defaultCamp.text,
        link: defaultCamp.link || '',
        photo: defaultCamp.photo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        position: defaultCamp.position || [],
        video: defaultCamp.video || '',
      },
      photoprofile: localStorage.getItem("Interval active") ? localStorage.getItem('PhotoProfile') : this.datiUtente.photoprofile,
      date: new Date(),
      hour: new Date().getHours(),
      seconds: new Date().getSeconds(),
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '',
      receivers: localStorage.getItem("Interval active") ? localStorage.getItem('ChannelSelectedListUsers') :  this.channelSelected.list_users.map((user: { nickname: any; }) => `@${user.nickname}`),
      channel: localStorage.getItem("Interval active") ?  localStorage.getItem('ChannelSelectedName') : this.channelControl.value,
      impressions: 0
    };
    this.databaseService.addSqueal(squealData).subscribe({
      next: (response) => {
        if (this.charLeftUser >= 125 && localStorage.getItem('Interval active') === null) {
          this.updateChannelDeafaultPost(defaultCamp);
          console.log('Squeal added successfully', response);
          const charsUsed = this.userText.length + this.calculateAttachmentChars();
          const userId = this.datiUtente ? this.datiUtente._id : null;
          console.log('Caratteri utilizzati:', charsUsed);
          console.log('ID utente:', userId);
        } else if (localStorage.getItem('Interval active') === 'true') {
          this.updateChannelDeafaultPost(defaultCamp);
        } else {
          alert('Caratteri insufficienti per inviare il messaggio.');
          this.showPurchasePopup = true;
        }
        /*
        if (userId) {
          const newCharLeftDaily = Math.max(0, this.charLeftUser - charsUsed);
          const newCharLeftWeekly = Math.max(0, this.charLeftUserWeekly - charsUsed);
          const newCharLeftMonthly = Math.max(0, this.charLeftUserMonthly - charsUsed);

          const updateData = {
            char_d: newCharLeftDaily,
            char_w: newCharLeftWeekly,
            char_m: newCharLeftMonthly
          };
    
          // Aggiorna i dati dell'utente nel backend
          this.databaseService.updateUserProfile(userId, updateData).subscribe({
            next: (updateResponse) => {
              console.log('Risposta del server:', updateResponse);
    
              // Aggiorna i valori locali
              this.charLeftUser = newCharLeftDaily;
              this.charLeftUserWeekly = newCharLeftWeekly;
              this.charLeftUserMonthly = newCharLeftMonthly;
    
              // Aggiorna il localStorage
              const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
              userData.char_d = newCharLeftDaily;
              userData.char_w = newCharLeftWeekly;
              userData.char_m = newCharLeftMonthly;
              localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
            },
            error: (updateError) => {
              console.error("Errore durante l'aggiornamento dei dati utente:", updateError);
            }
          });
        }
        */
        // this.resetForm();
        window.location.reload();
        // this.isSubmitting = false; // Riattiva il pulsante dopo l'invio
      },
      error: (error) => {
        console.error('Error adding squeal', error);
        this.isSubmitting = false; // Riattiva il pulsante dopo l'invio
      }
    });
  }

  updateChannelDeafaultPost(defaultCamp: any): void {
    const channelDataUpdatePost = {
      answer: [],
      body: {
        text: defaultCamp.text,
        link: defaultCamp.link || '',
        photo: defaultCamp.photo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        position: defaultCamp.position || [],
        video: defaultCamp.video || '',
      },
      category: null,
      date: new Date(),
      hour: new Date().getHours(),
      seconds: new Date().getSeconds(),
      impressions: 0,
      neg_reactions: 0,
      pos_reactions: 0,
      photoprofile: localStorage.getItem("Interval active") ? localStorage.getItem('PhotoProfile') : this.datiUtente.photoprofile,
      receivers: localStorage.getItem("Interval active") ? localStorage.getItem('ChannelSelectedListUsers') :  this.channelSelected.list_users.map((user: { nickname: any; }) => `@${user.nickname}`),
      sender: localStorage.getItem("Interval active") ? localStorage.getItem('Nickname') : this.datiUtente.nickname,
      typeSender: localStorage.getItem("Interval active") ? localStorage.getItem('ChannelTypeSender') : this.channelType, //Da modificare
      usersReactions: [],
      usersViewed: [],
    };
    const channelIdToUse = localStorage.getItem("Interval active") ? localStorage.getItem('Channel_id') : this.channelSelected._id;
    this.databaseService.updateChannel(channelIdToUse, channelDataUpdatePost).subscribe({
      next: (response) => {
        console.log('Canale aggiornato con successo:', response);
      },
      error: (error) => {
        console.error('Errore durante l\'aggiornamento del canale:', error);
      }
    });
  }



  /*
  isChannelNameValid(): boolean {
    return this.allChannels.some(channel => channel.name === this.channelName);
  }
  */
  
  /*Inserimento user*/
  onSelectUser(user: string): void {
    this.selectedUser = user;
    console.log("Selezionato: ", user);
    this.userControl.setValue(user);  // Imposta il valore del campo input su quello selezionato
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // Mappa allUsers per estrarre solo i nickname
    return this.allUsers
      .filter(user => user.nickname.toLowerCase().includes(filterValue))
      .map(user => user.nickname);
  }

  onUserSelected(event: any) {
    // Trova l'oggetto utente selezionato basato sul nickname
    const selectedUser = this.allUsers.find(user => user.nickname === event.option.value);
    if (selectedUser 
        && this.selectedUsers.length < 3 
        && !this.selectedUsers.map(u => u.nickname).includes(selectedUser.nickname)
        && selectedUser.photoprofile) { // Assicurati che selectedUser abbia la proprietà photoprofile
      this.selectedUsers.push(selectedUser);
    }
    // Resetta il campo input dopo la selezione
    this.userControl.reset();
  }

  removeSelectedUser(index: number): void {
    // Rimuove l'utente dall'array degli utenti selezionati
    this.selectedUsers.splice(index, 1);
  }
  
  /*Crea canale*/
  createChannel(): void {
    const channelData = {
      name: this.newChannelName,
      isMuted: this.muteChannel
    };

    /*
    this.channelService.createChannel(channelData).subscribe(
      response => {
        console.log('Canale creato con successo:', response);
        // Qui puoi implementare la logica dopo la creazione del canale, come reindirizzare o aggiornare la lista dei canali
      },
      error => {
        console.error('Errore nella creazione del canale:', error);
      }
    );
    */
  }

  /*Vecchia funzione mantenere per test
  createPublicSqueal(): void {
    // Assumi che questi dati vengano recuperati dal contesto dell'utente o generati automaticamente
    const sender = this.datiUtente ? this.datiUtente.nickname : 'Unknown';
    const typeSender = 'keywords'; // O altro valore a seconda della logica
    const photoProfile = this.datiUtente ? this.datiUtente.photoprofile : '';
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const hour = currentDate.getHours();
    const seconds = currentDate.getSeconds();
    const hashtag = this.hashtag;
  
    // Creazione dell'oggetto squeal
    const squealData = {
      sender: sender,
      typeSender: typeSender,
      body: {
        text: this.userText,
        link: this.sentLink || '',
        photo: this.sentImageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        position: this.userLocation ? [this.userLocation.lat, this.userLocation.lng] : [],
        video: this.sentVideoUrl || '',
      },
      photoprofile: photoProfile,
      date: date,
      hour: hour,
      seconds: seconds,
      pos_reactions: 0,
      neg_reactions: 0,
      usersReactions: [],
      answers: [],
      usersViewed: [],
      category: '', // Aggiungi logica per determinare la categoria se necessario
      receivers: [], // Aggiungi logica se ci sono destinatari specifici
      channel: hashtag, // Aggiungi logica se il squeal è associato a un canale
      impressions: 0
    };
  
    // Chiamata al servizio per aggiungere il squeal
    this.databaseService.addSqueal(squealData).subscribe({
      next: (response) => {
        console.log('Squeal added successfully', response);
        // Calcola i caratteri utilizzati (inclusi gli allegati)
        const charsUsed = this.userText.length + this.calculateAttachmentChars();
        const userId = this.datiUtente ? this.datiUtente._id : null;
        console.log('Caratteri utilizzati:', charsUsed);
        console.log('ID utente:', userId);

        // Assicurati che userId sia valido
        if (userId) {
          const newCharLeftDaily = Math.max(0, this.charLeftUser - charsUsed);
          const newCharLeftWeekly = Math.max(0, this.charLeftUserWeekly - charsUsed);
          const newCharLeftMonthly = Math.max(0, this.charLeftUserMonthly - charsUsed);

          const updateData = {
            char_d: newCharLeftDaily,
            char_w: newCharLeftWeekly,
            char_m: newCharLeftMonthly
          };
    
          // Aggiorna i dati dell'utente nel backend
          this.databaseService.updateUserProfile(userId, updateData).subscribe({
            next: (updateResponse) => {
              console.log('Risposta del server:', updateResponse);
    
              // Aggiorna i valori locali
              this.charLeftUser = newCharLeftDaily;
              this.charLeftUserWeekly = newCharLeftWeekly;
              this.charLeftUserMonthly = newCharLeftMonthly;
    
              // Aggiorna il localStorage
              const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
              userData.char_d = newCharLeftDaily;
              userData.char_w = newCharLeftWeekly;
              userData.char_m = newCharLeftMonthly;
              localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
            },
            error: (updateError) => {
              console.error("Errore durante l'aggiornamento dei dati utente:", updateError);
            }
          });
        }
        this.resetForm();
        window.location.reload();
      },
      error: (error) => {
        console.error('Error adding squeal', error);
      }
    });
  }
  */




  /*Reset della card*/
  resetForm() {
    this.userText = '';
    this.hashtag = '';
    this.sentImageUrl = null;
    this.sentVideoUrl = null;
    this.sentLink = null;
    this.userLocation = null;
    this.mapImageUrl = null;
    this.isMapActive = false;
    this.showMapModal = false;
    this.selectedLocation = null;
    this.tempMap = null

    this.isPrivate = false;
    this.channelName = '';
    this.newChannelName = '';
    this.muteChannel = false;
    this.selectedDefaultMessage = null;

    this.channelHaveDeafault = false;
    
    this.myControl.reset();
    this.channelControl.reset();
  
    // Rimuove la posizione e resetta la mappa
    this.userLocation = null;
    this.isMapActive = false;
    if (this.map) {
      this.map.remove(); // Rimuove la mappa per resettarla
      this.map = null;
    }
    if (this.selectedLocation) {
      this.selectedLocation = null; // Rimuove il marker selezionato
    }
  
    // Resetta la selezione degli utenti (per i messaggi privati)
    this.selectedUsers = [];
  
    // Aggiorna i caratteri rimanenti
    this.remainingChars = this.charLeftUser;
  
    // Se necessario, reimposta ulteriori campi o variabili qui
  }
  
  /*Aggiornamento squeal SOLO TEST*/
  updateSquealPositive() {
    const squealId = '65acec75253112144f1557d8'; // Sostituisci con l'ID effettivo dello Squeal
    const updateData = {
      answers:
      [
        {sender: "UserProva2@gmail.com", body: {text:"Messaggio 1"}, date: "07/05/2023",hour: "22",seconds:"12"},
        {sender: "UserProva3@gmail.com",body: {text:"Messaggio 2"}, date: "07/05/2023",hour: "12",seconds:"12"},
        {sender: "UserProva2@gmail.com",body: {text:"Messaggio 3"}, date: "07/07/2023",hour: "21",seconds:"12"},
        {sender: "UserProva3@gmail.com",body: {text:"Messaggio 4"}, date: "07/07/2023",hour: "23",seconds:"12"}
      ]
      // answers:[{sender,body:{text:'',photo:'',video:'',link:'',position:[]},photoprofile:'',photoprofileX,photoprofileY,date,hour,seconds}], category, receivers:[], channel, impressions

    };
    this.databaseService.updateSqueal(squealId, updateData).subscribe({
      next: (response) => {
        console.log('Squeal aggiornato con successo:', response);
      },
      error: (error) => {
        console.error('Errore durante l\'aggiornamento dello Squeal:', error);
      }
    });
  }

  updateSquealNegative() {
    const squealId = '65ac2cbdd4b368afff663bd0'; // Sostituisci con l'ID effettivo dello Squeal
    const updateData = {
      answers:
        [
          {sender: "UserProva2@gmail.com", body: {text:"Messaggio 5"}, date: "07/05/2023",hour: "22",seconds:"12"},
          {sender: "UserProva3@gmail.com",body: {text:"Messaggio 6"}, date: "07/05/2023",hour: "12",seconds:"12"},
          {sender: "UserProva2@gmail.com",body: {text:"Messaggio 7"}, date: "07/10/2023",hour: "21",seconds:"12"},
          {sender: "UserProva3@gmail.com",body: {text:"Messaggio 8"}, date: "07/10/2023",hour: "23",seconds:"12"}
        ]
    };

    this.databaseService.updateSqueal(squealId, updateData).subscribe({
      next: (response) => {
        console.log('Squeal aggiornato con successo:', response);
      },
      error: (error) => {
        console.error('Errore durante l\'aggiornamento dello Squeal:', error);
      }
    });
  }

  updateChannlePosts = () => {
    const channelDataUpdatePost = {
      answer: [],
      body: {
        text: this.userText,
        link: this.sentLink || '',
        photo: this.sentImageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        position: this.userLocation ? [this.userLocation.lat, this.userLocation.lng] : [],
        video: this.sentVideoUrl || '', 
      },
      category: null,
      date: new Date(),
      hour: new Date().getHours(),
      seconds: new Date().getSeconds(),
      impressions: 0,
      neg_reactions: 0,
      pos_reactions: 0,
      photoprofile: this.datiUtente.photoprofile || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      receivers: this.channelSelected.list_users.map((user: { nickname: any; }) => `@${user.nickname}`),
      sender: this.datiUtente.nickname,
      typeSender: this.channelType, //Modificare se CHANNELS
      usersReactions: [],
      usersViewed: [],
    };
    this.databaseService.updateChannel(this.channelSelected._id, channelDataUpdatePost).subscribe({
      next: (response) => {
        console.log('Canale aggiornato con successo:', response);
      },
      error: (error) => {
        console.error('Errore durante l\'aggiornamento del canale:', error);
      }
    });
  };

  createChannelSqueal(): void {
    if (this.channelSelected) {
      // Assumi che questi dati vengano recuperati dal contesto dell'utente o generati automaticamente
      this.isSubmitting = true;
      const sender = this.datiUtente ? this.datiUtente.nickname : 'Unknown';
      const typeSender = this.channelType; // O altro valore a seconda della logica
      const photoProfile = this.datiUtente ? this.datiUtente.photoprofile : '';
      const currentDate = new Date();
      const date = currentDate.toLocaleDateString();
      const hour = currentDate.getHours();
      const seconds = currentDate.getSeconds();
      const hashtag = this.hashtag;
      const channel = this.channelControl.value;
      const receivers = this.channelSelected.list_users.map((user: { nickname: any; }) => `@${user.nickname}`);
    
      // Creazione dell'oggetto squeal
      const squealData = {
        sender: sender,
        typeSender: typeSender,
        body: {
          text: this.userText,
          link: this.sentLink || '',
          photo: this.sentImageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          position: this.userLocation ? [this.userLocation.lat, this.userLocation.lng] : [],
          video: this.sentVideoUrl || '', 
        },
        photoprofile: photoProfile  || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        date: date,
        hour: hour,
        seconds: seconds,
        pos_reactions: 0,
        neg_reactions: 0,
        usersReactions: [],
        answers: [],
        usersViewed: [],
        category: '', // Aggiungi logica per determinare la categoria se necessario
        receivers: receivers, // Aggiungi logica se ci sono destinatari specifici
        channel: channel, // Aggiungi logica se il squeal è associato a un canale
        impressions: 0
      };
    
      // Chiamata al servizio per aggiungere il squeal
      this.databaseService.addSqueal(squealData).subscribe({
        next: (response) => {
          this.updateChannlePosts();
          console.log('Squeal added successfully', response);
          const charsUsed = this.userText.length + this.calculateAttachmentChars();
          const userId = this.datiUtente ? this.datiUtente._id : null;
          console.log('Caratteri utilizzati:', charsUsed);
          console.log('ID utente:', userId);

          // Assicurati che userId sia valido
          if (userId) {
            const newCharLeftDaily = Math.max(0, this.charLeftUser - charsUsed);
            const newCharLeftWeekly = Math.max(0, this.charLeftUserWeekly - charsUsed);
            const newCharLeftMonthly = Math.max(0, this.charLeftUserMonthly - charsUsed);

            const updateData = {
              char_d: newCharLeftDaily,
              char_w: newCharLeftWeekly,
              char_m: newCharLeftMonthly
            };
      
            // Aggiorna i dati dell'utente nel backend
            this.databaseService.updateUserProfile(userId, updateData).subscribe({
              next: (updateResponse) => {
                console.log('Risposta del server:', updateResponse);
      
                // Aggiorna i valori locali
                this.charLeftUser = newCharLeftDaily;
                this.charLeftUserWeekly = newCharLeftWeekly;
                this.charLeftUserMonthly = newCharLeftMonthly;
      
                // Aggiorna il localStorage
                const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
                userData.char_d = newCharLeftDaily;
                userData.char_w = newCharLeftWeekly;
                userData.char_m = newCharLeftMonthly;
                localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
              },
              error: (updateError) => {
                console.error("Errore durante l'aggiornamento dei dati utente:", updateError);
              }
            });
          }
          this.resetForm();
          // window.location.reload();
          // this.isSubmitting = false; // Riattiva il pulsante dopo l'invio
        },
        error: (error) => {
          console.error('Error adding squeal', error);
          this.isSubmitting = false; // Riattiva il pulsante dopo l'invio
        }
      });
    } else {
      alert("Seleziona un canale per inviare il tuo messaggio.");
    }
  }

  /*Gestione pop up caratteri rimanenti*/
  redirectToEditProfile() {
    this.router.navigate(['/edit-profile']);
    this.showPurchasePopup = false;
  }

  closePopup() {
    this.showPurchasePopup = false;
  }

  checkForCharacterLimit() {
    const sogliaMinima = 1;
    if (this.remainingChars < sogliaMinima) {
      this.showPurchasePopup = true;
    } else {
      this.showPurchasePopup = false;
    }
  }


  /*Delete all Squeals just for test*/
  deleteAllSqueals() {
    this.databaseService.deleteAllSqueals().subscribe({
      next: (response) => {
        console.log('Squeals deleted successfully', response);
      },
      error: (error) => {
        console.error('Error deleting squeals', error);
      }
    });
  }

  deleteAllChannels() {
    this.databaseService.deleteAllChannels().subscribe({
      next: (response) => {
        console.log('Channels deleted successfully', response);
      },
      error: (error) => {
        console.error('Error deleting channels', error);
      }
    });
  }

  deleteUser(userIdToDelete: any){
    this.databaseService.deleteUser(userIdToDelete).subscribe({
      next: (response) => {
        console.log('User deleted successfully', response);
      },
      error: (error) => {
        console.error('Error deleting user', error);
      }
    });
  }

  addChannel(){
    const channel = {
      creator: 'UserProva2@gmail.com', 
      photoprofile: "", 
      photoprofileX: 0, 
      photoprofileY: 0, 
      name: "Canale2", 
      type: "&", 
      list_mess: [], 
      silenceable: false, 
      list_users: [{
        blocked: false,
        cell: "",
        char_d: 300,
        char_m: 7000,
        char_w: 2000,
        email: "UserProva1@gmail.com",
        fullname: "UserProva1@gmail.com",
        nickname: "UserProva1@gmail.com",
        notification:[true, true, true, true, true],
        password: "UserProva1@gmail.com",
        photoprofile: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…tZ+iIV1ophfMy+kSgUDTiGsvF0SRUaR9xSPkVSB6jUSmv0f/Z",
        photoprofileX: 0,
        photoprofileY: 0,
        popularity: 0,
        type: "User",
        version: "user",
        _id: "65b79216d5997e7ede8b49ed"
      },
      {
        blocked: false,
        cell: "",
        char_d: 300,
        char_m: 7000,
        char_w: 2000,
        email: "UserProva2@gmail.com",
        fullname: "UserProva2@gmail.com",
        nickname: "UserProva2@gmail.com",
        notification:[true, true, true, true, true],
        password: "UserProva2@gmail.com",
        photoprofile: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…tZ+iIV1ophfMy+kSgUDTiGsvF0SRUaR9xSPkVSB6jUSmv0f/Z",
        photoprofileX: 0,
        photoprofileY: 0,
        popularity: 0,
        type: "Creator",
        version: "user",
        _id: "65b79216d5997e7ede8b49ed"
      },
      ], 
      usersSilenced: [], 
      list_posts: [], 
      // blocked(booleano, solo se è di tipo channel), 
      description: "Canale di prova",
      popularity: "",
    };
    this.databaseService.addChannel(channel).subscribe({
      next: (response) => {
        console.log('Channel added successfully', response);
      },
      error: (error) => {
        console.error('Error adding channel', error);
      }
    });
  }

  addChannel2(){
    const channel = {
      creator: 'UserProva2@gmail.com', 
      photoprofile: "", 
      photoprofileX: 0, 
      photoprofileY: 0, 
      name: "Canale1", 
      type: "public", 
      list_mess: [], 
      silenceable: false, 
      list_users: ["UserProva1@gmail.com", "UserProva3@gmail.com", "UserProva4SS@gmail.com"], 
      usersSilenced: [], 
      list_posts: [], 
      // blocked(booleano, solo se è di tipo channel), 
      description: "Canale di prova",
      popularity: "",
    };
    this.databaseService.addChannel(channel).subscribe({
      next: (response) => {
        console.log('Channel added successfully', response);
      },
      error: (error) => {
        console.error('Error adding channel', error);
      }
    });
  }

  getAllChannels(){
    this.databaseService.getAllChannels().subscribe({
      next: (response) => {
        console.log('Channels retrieved successfully', response);
      },
      error: (error) => {
        console.error('Error retrieving channels', error);
      }
    });
  }

}
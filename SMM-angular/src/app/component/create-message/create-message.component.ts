import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateMessageComponent implements OnInit, AfterViewInit{
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  videoWidth = 300;
  videoHeight = 300;
  streaming = false;


  profilePictureUrl: string | null = '';
  charLeftUser: number = 0;
  remainingChars: number = 0;
  userText: string = '';

  userDati = localStorage.getItem('Dati utente amministrato');
  datiUtente = this.userDati ? JSON.parse(this.userDati) : null;

  /*Modale fotocamera*/
  showCameraModal: boolean = false;
  imageDataUrl: string | null = null; // Variabile per tenere l'immagine
  sentImageUrl: string | null = null; // URL dell'immagine inviata

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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private databaseService: DatabaseService, 
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.profilePictureUrl = this.datiUtente ? this.datiUtente.photoprofile : '';
    this.charLeftUser = this.datiUtente ? this.datiUtente.char_d : 0;   
    this.remainingChars = this.charLeftUser; 
  }

  ngAfterViewInit() {

  }

  /* Da aggiornare
  updateCharLeftUser(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.remainingChars = this.charLeftUser - textarea.value.length; // Sostituisci 150 con il tuo valore massimo di caratteri se diverso
  }
  */
  updateCharLeftUser(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    let textLength = textarea.value.length;
  
    // Calcola i caratteri usati dagli allegati
    const attachmentChars = this.calculateAttachmentChars();
  
    // Calcola i caratteri rimanenti
    let remainingChars = this.charLeftUser - textLength - attachmentChars;
  
    // Se i caratteri rimanenti sono sotto zero, tronca il testo
    if (remainingChars < 0) {
      textLength += remainingChars; // Aumenta per portare a zero
      textarea.value = textarea.value.substring(0, textLength);
      remainingChars = 0; // Resetta a zero
    }
  
    this.remainingChars = remainingChars;
  }

  updateRemainingChars() {
    const attachmentChars = this.calculateAttachmentChars();
    const textLength = this.userText.length;
    this.remainingChars = this.charLeftUser - textLength - attachmentChars;
  }
  
  
  
  calculateAttachmentChars() {
    let chars = 0;
    if (this.sentImageUrl) chars += 150; // Costo per l'immagine
    if (this.sentLink) chars += 150; // Costo per il link
    if (this.userLocation) chars += 150; // Costo per la posizione
    // Aggiungi qui altri costi per altri tipi di allegati se necessario
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

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imgSrc = (e.target as FileReader).result as string;
  
        // Salva l'URL dell'immagine per l'utilizzo successivo
        this.imageDataUrl = imgSrc;
  
        const image = new Image();
        image.onload = () => {
          // Ottieni il riferimento al canvas e al suo contesto
          const canvasElement = this.canvasElement.nativeElement;
          const context = canvasElement.getContext('2d');
          const maxWidth = 300; // Larghezza massima del canvas
          const maxHeight = 300; // Altezza massima del canvas
          
          // Calcola le nuove dimensioni mantenendo le proporzioni
          let width = image.width;
          let height = image.height;
  
          if (width > height) {
            // Per immagini orizzontali
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            // Per immagini verticali
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          // Imposta le dimensioni del canvas
          if (context) {
            context.drawImage(image, 0, 0, width, height);
  
            // Mostra il canvas e nascondi il video
            canvasElement.style.display = 'block';
            this.videoElement.nativeElement.style.display = 'none';
          }
        };
        image.src = imgSrc;
      };
  
      reader.readAsDataURL(file);
    }
  }
    
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
    }
  }
  
  removeSentImage(): void {
    this.sentImageUrl = null; // Rimuove l'URL dell'immagine, quindi non sarà più visualizzata
    this.imageDataUrl = null; // Rimuove l'URL dell'immagine, quindi non sarà più visualizzata
    this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
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
      alert('Il link inserito non è valido.');
    }
  }

  removeSentLink(): void {
    this.sentLink = null; // Rimuove il link, quindi non sarà più visualizzato
    this.updateRemainingChars(); // Aggiorna dopo l'invio dell'immagine
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
    }
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

  
  
  
}
  
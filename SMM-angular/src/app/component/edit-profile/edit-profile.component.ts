import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{

  @ViewChild('selectPhotoDialog') selectPhotoDialogRef!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>;


  @ViewChild('selectVIPDialog') selectVIPDialogRef!: TemplateRef<any>;
  dialogVIPRef!: MatDialogRef<any, any>;

  @ViewChild('selectDescriptionDialog') selectDescriptionDialogRef!: TemplateRef<any>;
  dialogDescriptionRef!: MatDialogRef<any, any>;

  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;
  dialogPaymentRef!: MatDialogRef<any, any>;


  /*Dati utente*/
  nickname: string | null = '';
  profilePictureUrl: string | null = '';
  charLeftUserDaily: number = 0;
  charLeftUserWeekly: number = 0;
  charLeftUserMonthly: number = 0;
  profileDescription: string = '';

  

  /*Dati per il cambio vip*/
  selectedVIP: any; 
  vipList: any[] = []; // Lista per tenere traccia degli utenti (VIP) gestiti


  /*Dati per il pagamento e aumento caratteri*/
  charLeftDaily: number = 0;  //Caratteri rimanenti in percentuale su 150
  charLeftWeekly: number = 0; //Caratteri rimanenti in percentuale su 1000
  charLeftMonthly: number = 0; //Caratteri rimanenti in percentuale su 3000
  charMaximunDaily: number = 500; //Caratteri massimi
  charMaximunWeekly: number = 4000; //Caratteri massimi
  charMaximunMonthly: number = 10000; //Caratteri massimi
  selectedAmount: string | number = '';
  otherAmount: number | null = null;
  selectedPaymentMethod: string = '';


  /*Dati utente loggato */
  user = localStorage.getItem('Dati manager');
  datiUtente = this.user ? JSON.parse(this.user) : null;
  userLogged = localStorage.getItem('Dati utente amministrato')
  userId = this.userLogged ? JSON.parse(this.userLogged) : null;


  tempPhotoProfile: any = ''


  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private databaseService: DatabaseService, 
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() { 
    // console.clear();
    this.laodUserData(); // Carica i dati utente 
    this.loadManagedUsers(); // Carica gli utenti gestiti (VIP)
    // console.log(this.userId);
  }

  laodUserData(): void {
    this.nickname = this.userId ? this.userId.nickname : '';
    this.profilePictureUrl = this.userId ? this.userId.photoprofile : '';
    this.charLeftUserDaily = this.userId ? this.userId.char_d : 0;
    this.charLeftDaily = (this.charLeftUserDaily * 100) / this.charMaximunDaily;
    this.charLeftUserWeekly = this.userId ? this.userId.char_w : 0;
    this.charLeftWeekly = (this.charLeftUserWeekly * 100) / this.charMaximunWeekly;
    this.charLeftUserMonthly = this.userId ? this.userId.char_m : 0;
    this.charLeftMonthly = (this.charLeftUserMonthly * 100) / this.charMaximunMonthly;
    this.profileDescription = this.userId ? this.userId.bio : '';
  }

  /*Gestione cambio immagini*/
  openDialog(): void {
    this.dialogRef = this.dialog.open(this.selectPhotoDialogRef);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateProfilePicture(newImageUrl: any): void {
    this.profilePictureUrl = newImageUrl;
    const updateData = { photoprofile: newImageUrl };

    this.databaseService.updateUserProfile(this.userId._id, updateData)
      .subscribe(
        response => {
          // console.log('Foto profilo aggiornata con successo');
          // Aggiorna i dati dell'utente nel localStorage
          this.databaseService.getUserData(this.userId._id).subscribe((data: any) => {
            localStorage.removeItem('Dati utente amministrato');  
            // const userDataToSave = {...data, password: undefined};
            localStorage.setItem('Dati utente amministrato', JSON.stringify(data));
          }, error => {
            console.error('Errore nel caricamento dei dati dell\'utente:', error);
          });
          this.laodUserData(); // Ricarica i dati dell'utente
          window.location.reload();
          this.closeDialog();
        },
        error => console.error('Errore nell\'aggiornamento della foto del profilo', error)
      );
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Crea un URL temporaneo per il file selezionato
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const dataUrl = e.target.result;
        // console.log(dataUrl); 
        this.tempPhotoProfile = dataUrl;
      }
      reader.readAsDataURL(file);
    }
  }


  /*Gestione cambio vip funzionante*/
  loadManagedUsers(): void {
    const managerData = JSON.parse(localStorage.getItem('Dati manager') || '{}');  
    const managedAccounts = managerData.managedAccounts || [];

    managedAccounts.forEach((uid: string) => {
      this.databaseService.getUserData(uid).subscribe(user => {
        this.vipList.push(user); // Aggiungi l'utente alla lista vipList
      }, error => {
        console.error('Errore nel caricamento dei dati dell\'utente:', error);
      });
    });
  }

  openVIPSelectModule(): void {
    this.dialogVIPRef = this.dialog.open(this.selectVIPDialogRef);
  }

  closeVIPDialog(): void {
    this.dialogVIPRef.close();
  }

  selectVIP(): void {
    if (this.selectedVIP) {
      // console.log('VIP selezionato:', this.selectedVIP);
  
      const selectedVIPIndex = this.vipList.findIndex(vip => vip.nickname === this.selectedVIP.nickname);
  
      if (selectedVIPIndex !== -1) {
        // console.log('Indice dell\'utente selezionato:', selectedVIPIndex);
        this.userId = this.user ? JSON.parse(this.user).managedAccounts[selectedVIPIndex] : null;
        localStorage.removeItem('ActuallyUserId');  
        localStorage.setItem('actualUserId', JSON.stringify(this.userId));  
        this.databaseService.getUserData(this.userId).subscribe((data: any) => {
          localStorage.removeItem('Dati utente amministrato');  
          localStorage.setItem('Dati utente amministrato', JSON.stringify(data)); 
          this.laodUserData(); // Ricarica i dati dell'utente
  
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['edit-profile']);
        }, error => {
          console.error('Errore nel caricamento dei dati dell\'utente:', error);
        });
  
      } else {
        console.error('VIP selezionato non trovato nella lista');
      }
  
      this.closeVIPDialog();
    } else {
      console.error('Nessun VIP selezionato');
    }
  }

  /*Gestione cambio descrizione DA FARE*/
  openDescriptionModule(): void {
    this.dialogDescriptionRef = this.dialog.open(this.selectDescriptionDialogRef, {
      width: '80%', // Imposta la larghezza desiderata
      // marginLeft: '20%', // Imposta il margine sinistro
      maxWidth: '500px', // Imposta una larghezza massima
      panelClass: 'custom-dialog-margin'
    });
  }
  
  /*Problemi aggiornamento*/
  updateDescription(newDescription: string): void {
    // Assicurati di ottenere l'ID utente corretto dal localStorage
    const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
    const userId = userData._id;
  
    if (userId) {
      // console.log('Aggiornamento descrizione per ID:', userId);
      this.databaseService.updateUserProfile(userId, { bio: newDescription })
        .subscribe(response => {
          // console.log('Risposta del server:', response);
          // Aggiornamento dei dati dell'utente nel localStorage
          userData.bio = newDescription;
          localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
          this.profileDescription = newDescription; // Aggiorna la descrizione nel componente
          this.laodUserData(); // Ricarica i dati dell'utente
          // Force a refresh of the page
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([this.router.url]);
        }, error => {
          console.error('Errore nell\'aggiornamento della descrizione:', error);
        });
    } else {
      console.error('ID utente non trovato.');
    }
    this.closeDescriptionDialog(); // Chiudi il modale dopo il salvataggio
  } 
  
  closeDescriptionDialog(): void {
    this.dialogDescriptionRef.close();
  }

  /*Gestione cambio caratteri DA FARE*/
  openConfirmationModal(): void {
    if (this.selectedAmount) {
      this.dialogPaymentRef = this.dialog.open(this.confirmationDialog);
    } else {
      // console.log('Seleziona entrambe le opzioni prima di procedere');
      // Qui puoi mostrare un messaggio di errore all'utente
    }
  }

  // Si aggiorna solo dopo due volte che aggiorni tu
  confirmSelection(): void {
    let amountValue = this.selectedAmount === 'other' ? this.otherAmount : this.selectedAmount;
    let amountNumber = typeof amountValue === 'string' ? parseInt(amountValue, 10) : amountValue || 0;
  
    // console.log('Importo selezionato:', amountNumber, 'Metodo di pagamento:', this.selectedPaymentMethod);

    const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
    const userId = userData._id;

    // console.log('Aggiornamento caratteri per ID:', userId);
  
    // Assicurati che this.userId sia una stringa che rappresenta l'ID dell'utente
    if (typeof userId === 'string' && userId) {
      // Calcola i nuovi valori per charLeft
      const newCharLeftDaily = this.charLeftUserDaily + amountNumber;
      const newCharLeftWeekly = this.charLeftUserWeekly + amountNumber;
      const newCharLeftMonthly = this.charLeftUserMonthly + amountNumber;
  
      const updateData = {
        char_d: newCharLeftDaily,
        char_w: newCharLeftWeekly,
        char_m: newCharLeftMonthly
      };
  
      this.databaseService.updateUserProfile(userId, updateData)
        .subscribe({
          next: (response) => {
            console.log('Risposta del server:', response);
  
            // Aggiorna i valori locali e nel localStorage
            this.charLeftUserDaily = newCharLeftDaily;
            this.charLeftUserWeekly = newCharLeftWeekly;
            this.charLeftUserMonthly = newCharLeftMonthly;
            
            // Aggiorna i valori percentuali
            this.charLeftDaily = (this.charLeftUserDaily * 100) / this.charMaximunDaily;
            this.charLeftWeekly = (this.charLeftUserWeekly * 100) / this.charMaximunWeekly;
            this.charLeftMonthly = (this.charLeftUserMonthly * 100) / this.charMaximunMonthly;
  
            // Aggiorna il localStorage
            const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
            userData.char_d = newCharLeftDaily;
            userData.char_w = newCharLeftWeekly;
            userData.char_m = newCharLeftMonthly;
            localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
          },
          error: (error) => {
            console.error("Errore durante l'aggiornamento dei dati utente:", error);
          },
          complete: () => {
            // Chiudi il modale di conferma
            this.closeConfirmationDialog();
          }
        });
    } else {
      console.error('ID utente non valido o non trovato.');
    }
  }
  
  closeConfirmationDialog(): void {
    this.dialogPaymentRef.close();
  }
  

}
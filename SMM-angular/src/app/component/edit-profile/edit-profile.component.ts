import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


/*Cosa manca:
- Logica per cambiare la foto profilo (Problema nel caricamento dell'immagine, prende solo json, devo usare degli stroage del db)
- Logica per cambiare il vip 
- Logica gestione del pagamento (in forse)
*/

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
  username: string | null = '';
  profilePictureUrl: string | null = '';
  charLeftUser: number = 0;
  profileDescription: string = '';

  

  /*Dati per il cambio vip*/
  selectedVIP: any; // Sostituisci con il tipo appropriato
  vipList: any[] = []; // Lista per tenere traccia degli utenti (VIP) gestiti


  /*Dati per il pagamento e aumento caratteri*/
  charLeft: number = 0;  //Caratteri rimanenti in percentuale su 150
  charMaximun: number = 500; //Caratteri massimi
  selectedAmount: string | number = '';
  otherAmount: number | null = null;
  selectedPaymentMethod: string = '';


  //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
  /*Dati utente loggato */
  userDati = localStorage.getItem('Dati utente');
  datiUtente = this.userDati ? JSON.parse(this.userDati) : null;
  user = localStorage.getItem('Dati manager');
  userLogged = localStorage.getItem('ActuallyManagedAccount')
  userId = this.userLogged ? JSON.parse(this.userLogged) : null;


  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private databaseService: DatabaseService, 
    private dialog: MatDialog) { }

  ngOnInit() { 
    this.laodUserData(); // Carica i dati utente 
    this.loadManagedUsers(); // Carica gli utenti gestiti (VIP)
    console.log(this.userId);
  }

  laodUserData(): void {
    this.username = this.datiUtente ? this.datiUtente.username : '';
    this.profilePictureUrl = this.datiUtente ? this.datiUtente.profilePictureUrl : '';
    this.charLeftUser = this.datiUtente ? this.datiUtente.charLeft : 0;
    this.charLeft = (this.charLeftUser * 100) / this.charMaximun;
    this.profileDescription = this.datiUtente ? this.datiUtente.profileDescription : '';
  }

  /*Test gestione cambio immagini*/
  openDialog(): void {
    this.dialogRef = this.dialog.open(this.selectPhotoDialogRef);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  /*Non funziona, non riesco ad allegare il file perchè il database non prende le immagini, ma solo json
  e l'unico modo per farlo è creare un backend che gestisca le immagini e le salvi in un storage
  */
  modifiedImage(file?: File | null): void {
    if (file) {
      this.databaseService.uploadImage(file).subscribe(response => {
        const imageUrl = response['imageUrl'];

        this.databaseService.patchUserData(this.userId, { profilePictureUrl: imageUrl }).subscribe(() => {
          // Aggiorna il localStorage e ricarica i dati utente
          this.userDati = localStorage.getItem('Dati utente');  //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
          const updatedUserData = this.userDati ? JSON.parse(this.userDati) : {};
          updatedUserData.profilePictureUrl = imageUrl;
          localStorage.setItem('Dati utente', JSON.stringify(updatedUserData)); //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM

          this.laodUserData();
          this.router.navigate(['/path-to-user-profile-or-current-page']).then(() => {
            window.location.reload();
          });
        });
      }, error => {
        console.error("Errore durante l'invio del file al server:", error);
      });
    } else {
      console.log('Nessun file selezionato per il caricamento.');
    }
    this.dialogRef.close();
  }
  
  

  onFileSelected(event: Event): void { }


  /*Gestione cambio vip*/
  loadManagedUsers(): void {
    const managerData = JSON.parse(localStorage.getItem('Dati manager') || '{}');  //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
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
      console.log('VIP selezionato:', this.selectedVIP);
  
      const selectedVIPIndex = this.vipList.findIndex(vip => vip.username === this.selectedVIP.username);
  
      if (selectedVIPIndex !== -1) {
        console.log('Indice dell\'utente selezionato:', selectedVIPIndex);
        this.userId = this.user ? JSON.parse(this.user).managedAccounts[selectedVIPIndex] : null;
        localStorage.removeItem('ActuallyManagedAccount');  //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
        localStorage.setItem('ActuallyManagedAccount', JSON.stringify(this.userId));  //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
        
        this.databaseService.getUserData(this.userId).subscribe((data: any) => {
          localStorage.setItem('Dati utente', JSON.stringify(data));  //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
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
  



  /*Gestione cambio descrizione*/
  openDescriptionModule(): void {
    this.dialogDescriptionRef = this.dialog.open(this.selectDescriptionDialogRef);
  }

  updateDescription(newDescription: string): void {
    // Implementa qui la logica per salvare la nuova descrizione
    console.log('Nuova descrizione:', newDescription);
    console.log(this.userId);
    this.databaseService.patchUserData(this.userId, {profileDescription: newDescription})
    .subscribe(response => {
      console.log(response);
      console.log(this.userId);
      localStorage.removeItem('Dati utente'); //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
      localStorage.setItem('Dati utente', JSON.stringify({username: this.username, profilePictureUrl: this.profilePictureUrl, charLeft: this.charLeftUser, profileDescription: newDescription})); //CONTROLLARE CHIAMATA
      // Force a refresh of the page
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([this.router.url]);
    }, error => {
      console.error(error);
    });
    // Ad esempio, puoi chiamare un servizio per aggiornare la descrizione nel database
    this.closeDescriptionDialog(); // Chiudi il modale dopo aver salvato la descrizione
  }


  closeDescriptionDialog(): void {
    this.dialogDescriptionRef.close();
  }

  /*Gestione cambio caratteri*/
  openConfirmationModal(): void {
    if (this.selectedAmount && this.selectedPaymentMethod) {
      this.dialogPaymentRef = this.dialog.open(this.confirmationDialog);
    } else {
      console.log('Seleziona entrambe le opzioni prima di procedere');
      // Qui puoi mostrare un messaggio di errore all'utente
    }
  }

  confirmSelection(): void {
    let amountValue = this.selectedAmount === 'other' ? this.otherAmount : this.selectedAmount;

    // Assicurati che amountValue sia un numero
    let amountNumber = typeof amountValue === 'string' ? parseInt(amountValue, 10) : amountValue || 0;

    console.log('Importo selezionato:', amountNumber, 'Metodo di pagamento:', this.selectedPaymentMethod);
    this.databaseService.patchUserData(this.userId, {charLeft: this.charLeftUser + amountNumber}).subscribe(response => { //CONTROLLARE CHIAMATA
      console.log(response);
      localStorage.removeItem('Dati utente'); //CONTROLLARE I NOMINATIVI DEI CAMPI ITEM
      localStorage.setItem('Dati utente', JSON.stringify({username: this.username, profilePictureUrl: this.profilePictureUrl, charLeft: this.charLeftUser + amountNumber, profileDescription: this.profileDescription})); //CONTROLLARE CHIAMATA
      // Force a refresh of the page
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([this.router.url]);
    }, error => {
      console.error(error);
    });

    /*  // Qui implementa la logica per la combinazione di opzioni selezionate per il tipo di pagamento
      ?.subscribe(() => {

        this.dialogRef.close(); // Chiudi il modale di conferma
      });
  }
  */
    this.closeConfirmationDialog(); // Chiudi il modale di conferma
  }

  closeConfirmationDialog(): void {
    this.dialogPaymentRef.close();
  }

}
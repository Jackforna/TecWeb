import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  nickname: string | null = ''; // Definisce la variabile username a livello di classe
  profilePictureUrl: string | null = ''; // Definisce la variabile profileImage a livello di classe
  profileDescription: string = ''; // Definisce la variabile profileDescription a livello di classe

  
  id_manager = localStorage.getItem('actualUserId');
  id_user: string | null = '';


  constructor(private authService: AuthService, private databaseService: DatabaseService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getManagerDetails();
    this.setAccountData();
  }

  // Da mettere a posto
  onLogout(): void {
    localStorage.clear();
    //this.authService.logOut()
  } 

  getManagerDetails() {
    const actualUserId = JSON.parse(localStorage.getItem("actualUserId")!);

    this.databaseService.getUserData(actualUserId).subscribe(
      (managerData: any) => {

        // Se l'utente è un manager e ha almeno un account gestito
        if (managerData.version === 'social media manager' && managerData.managedAccounts.length > 0) {
          localStorage.setItem('Dati manager', JSON.stringify(managerData));
          this.databaseService.getUserData(managerData.managedAccounts[0]).subscribe((userData: any) => {  
            localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
            console.log("Dati user: ", userData);
          }, error => {
            console.error('Errore nella richiesta:', error);
          });
        }
      },
      error => {
        console.error('Errore nella richiesta:', error);
      }
    );
  }

  setAccountData(){
    const userDati = localStorage.getItem('Dati utente amministrato');
    const datiUtente = userDati ? JSON.parse(userDati) : null;
    this.nickname = datiUtente ? datiUtente.nickname : '';
    this.profilePictureUrl = datiUtente ? datiUtente.photoprofile : '';
    this.profileDescription = datiUtente ? datiUtente.profilebio : '';
  }

  /*Funzione per aggiornare gli account gestiti dall'utente
  updateUserManagedAccounts(userId: string, managedAccounts: string[]) {
    this.http.put(`http://localhost:8080/update-user/${userId}`, { managedAccounts })
      .subscribe(
        response => {
          console.log('Utente aggiornato con successo', response);
        },
        error => {
          console.error('Errore durante l\'aggiornamento dell\'utente:', error);
        }
      );
  }
  */
  

}

import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  nickname: string | null = ''; 
  profilePictureUrl: string | null = 'dat'; 
  profileDescription: string = ''; 
  logoUrl: string = 'assets/images/logo - Copia.png'; 

  
  id_manager = localStorage.getItem('actualUserId');
  id_user: string | null = '';


  constructor(private databaseService: DatabaseService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // console.clear();
    this.databaseService.getAllUsers().subscribe(
      (data: any) => {
        console.log('Tutti gli utenti:', data);
      },
      error => {
        console.error('Errore nella richiesta:', error);
      }
    );
    this.getManagerDetails();
    this.setAccountData();
    //this.updateUserManagedAccounts("65e093240bd4d94cf1d69356", ["65e093330bd4d94cf1d69357", "65e093c60bd4d94cf1d69358", "65e094300bd4d94cf1d69359"]);
    /* Test
    this.databaseService.getAllUsers().subscribe( 
      (data: any) => {
        console.log('Tutti gli utenti:', data);
      },
      error => {
        console.error('Errore nella richiesta:', error);
      }
    );
    */
    //this.updateUserManagedAccounts("65b791fcd5997e7ede8b49ec", ["fvPro","Nome Buffo1", "Nome Buffo2"]);
  }

  onLogout(): void {
    // localStorage.clear();
    localStorage.removeItem('Interval active');
    localStorage.removeItem('secToRepeat');
    localStorage.removeItem('Counter');
    localStorage.removeItem('ChannelSelectedListUsers');
    localStorage.removeItem('ChannelSelectedName');
    localStorage.removeItem('ChannelTypeSender');
    localStorage.removeItem('PhotoProfile');
    localStorage.removeItem('Nickname');
    localStorage.removeItem('Channel_id');
    window.location.href = 'http://localhost:8080';
  } 

  getManagerDetails() {
    const actualUserId = JSON.parse(localStorage.getItem("actualUserId")!);

    this.databaseService.getUserData(actualUserId).subscribe(
      (managerData: any) => {

        // Se l'utente è un manager e ha almeno un account gestito
        if (managerData.version === 'social media manager' && managerData.managedAccounts.length > 0) {
          localStorage.setItem('Dati manager', JSON.stringify(managerData));
          if (localStorage.getItem('Dati utente amministrato') === null) {
            this.databaseService.getUserData(managerData.managedAccounts[0]).subscribe((userData: any) => {  
              localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
              // window.location.reload();
            }, error => {
              console.error('Error in request:', error);
            });
          }
          // this.obtainUserIdFromName();
        }
      },
      error => {
        console.error('Error in request:', error);
      }
    );
  }

  obtainUserIdFromName() {
    this.databaseService.getAllUsers().subscribe(
      (data: any) => {
        data.forEach((user: any) => {
          if (user.nickname === this.nickname) {
            this.id_user = user._id;
            this.databaseService.getUserData(this.id_user ?? '').subscribe((userData: any) => {  
              localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
            }, error => {
              console.error('Error in request:', error);
            });
          }
        });
      },
      error => {
        console.error('Error in request:', error);
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
  /*Funzione per aggiornare gli account gestiti dall'utente Test
  */

}

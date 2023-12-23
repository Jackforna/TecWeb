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

  username: string | null = ''; // Definisce la variabile username a livello di classe
  profilePictureUrl: string | null = ''; // Definisce la variabile profileImage a livello di classe
  profileDescription: string = ''; // Definisce la variabile profileDescription a livello di classe

  /*Test*/
  //id: string | null= '';
  id = localStorage.getItem('actualUserId');

  constructor(private authService: AuthService, private databaseService: DatabaseService, private http: HttpClient) { }

  ngOnInit(): void {
    const userDati = localStorage.getItem('Dati utente');
    const datiUtente = userDati ? JSON.parse(userDati) : null;
    this.username = datiUtente ? datiUtente.username : '';
    this.profilePictureUrl = datiUtente ? datiUtente.profilePictureUrl : '';
    this.profileDescription = datiUtente ? datiUtente.profileDescription : '';
    console.log("Siamo qua side-menu.component.ts");
    this.getAllUsers().subscribe(users => {
      console.log('Utenti', users);
    });
    console.log("Utente :" + this.id + " Dovrebbe essere questo che è il vecchio: 65856ccddc1ca87a4d665acd ");
    this.getCurrentUser(this.id ?? '').subscribe(user => {
      console.log('Utente loggato', user);
    });
    this.getCurrentUser('65856ccddc1ca87a4d665acd').subscribe(user => {
      console.log('Utente loggato sbagliato attuale', user); 
    });
  }

  onLogout(): void {
    this.authService.logOut()
  } 


  getAllUsers() {
    return this.http.get('/get-users');
  }

  getCurrentUser(id: string) {
    return this.http.get(`/get-user/${id}`);
  }


}

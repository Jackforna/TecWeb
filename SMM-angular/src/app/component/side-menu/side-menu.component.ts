import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  username: string | null = ''; // Definisce la variabile username a livello di classe
  profilePictureUrl: string | null = ''; // Definisce la variabile profileImage a livello di classe
  profileDescription: string = ''; // Definisce la variabile profileDescription a livello di classe

  constructor(private authService: AuthService, private databaseService: DatabaseService) { }

  ngOnInit(): void {
    const userDati = localStorage.getItem('Dati utente');
    const datiUtente = userDati ? JSON.parse(userDati) : null;
    this.username = datiUtente ? datiUtente.username : '';
    this.profilePictureUrl = datiUtente ? datiUtente.profilePictureUrl : '';
    this.profileDescription = datiUtente ? datiUtente.profileDescription : '';
    console.log("Siamo qua side-menu.component.ts");
  }

  onLogout(): void {
    this.authService.logOut()
  } 
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'SMM-squealer';
  oggi = Date.now()

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    if(localStorage.getItem('user')){
      const user = JSON.parse(localStorage.getItem('user') ?? '')   //?? '' serve per dire che se non c'è niente metti ''
      this.authService.createUser(user.email, user.id, user._token, user._expirationDate)
    }
    console.log(this.authService.user, ' isLogged: ', this.authService.isLoggedIn) //Mi dice se è loggato o no, attenzione che devo aggiornare perchè funzioni
  }

}

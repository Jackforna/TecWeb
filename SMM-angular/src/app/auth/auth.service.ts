import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.moduls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  APIKey = `AIzaSyAbdH2-bx8I-r1UhFwCM2CcK_JOZx6ORbc`
  signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.APIKey}`
  signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.APIKey}`
  isLoggedIn = false //Per ora lo lasciamo sempre loggato
  user!: User;   //Mi dava errore e ho messo il negato
  username!: string;

  constructor(private http: HttpClient, private router: Router) { }

  /*
  createUser(email: string, id: string, token: string, expirationDate: Date){
    this.user = new User(email, id, token, expirationDate)
    this.isLoggedIn = true
  }
  */

  signUp(email: string, username: string, password: string) {
    return this.http.post(this.signUpUrl, {
      email: email,
      username: username,
      password: password,
      returnSecureToken: true
    })
  }

  signIn(email: string, password: string) {
    return this.http.post(this.signInUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    })
  }

  logOut(){
    this.isLoggedIn = false //Togli il log
    this.router.navigate(['login']) //Vai alla home
    localStorage.clear() //Pulisci il localStorage
    console.clear() //Pulisci la console
  }
  
}

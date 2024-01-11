import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

    constructor(private authService: AuthService, private router: Router, private databaseService: DatabaseService, private http: HttpClient) { }

    ngOnInit(): void {}

    
    onSubmit(form: NgForm) {
      const email = form.value.email;
      const password = form.value.password;
      const username = form.value.username;
      const role = form.value.role;
      const isManager = role === 'manager' ? true : false;
    
      this.authService.signUp(email, username, password).subscribe((signUpData: any) => {
        console.log('User signed up');
        console.log(signUpData);
    
        // Create user after successful sign-up
        const token = signUpData.idToken; // Replace with the actual property name
        const expirationDate = new Date(new Date().getTime() + +signUpData.expiresIn * 1000); // Replace with the actual property name
        const uid = signUpData.localId; // Ottieni l'UID dall'utente registrat
        //this.authService.createUser(email, uid, token, expirationDate);
        /*
        if (role === 'user') {
          this.databaseService.insertUser(uid, email, username).subscribe((insertUserData: any) => {
            console.log('User inserted in the database');
            console.log(insertUserData);
            localStorage.setItem('Dati Utente', JSON.stringify(insertUserData))
            //this.router.navigate(['/', username ,'edit-profile']);
            this.router.navigate(['edit-profile']);
          }, error => {
            console.error('Error occurred during user insertion:', error);
            // Handle the error here, e.g., display an error message to the user
          });
        } else if (role === 'manager') {
          this.databaseService.insertManager(uid, email, isManager).subscribe((insertManagerData: any) => {
            console.log('Manager inserted in the database');
            console.log(insertManagerData);
            localStorage.setItem('Dati Utente', JSON.stringify(insertManagerData))
            this.router.navigate(['edit-profile']);
          });
        }
      }, error => {
        console.error('Error occurred during sign-up:', error);
        // Handle the error here, e.g., display an error message to the user
      });
      */
    });
  }
    
    

    
}

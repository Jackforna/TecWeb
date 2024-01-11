import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

    constructor(private authService: AuthService, private router: Router, private databaseService: DatabaseService) { }

    ngOnInit(): void {
}

    onSubmit(form: NgForm): void {
      const email = form.value.email;
      const password = form.value.password;


      this.authService.signIn( email, password ).subscribe((data: any) => {
        console.log(data)
        const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)
        //this.authService.createUser(data.email, data.localId, data.idToken, data.expiresIn) //Creo User
        localStorage.setItem('manager', JSON.stringify(this.authService.user))
        //this.databaseService.getManagerData(data.localId).subscribe((data: any) => {
          console.log(data)
          localStorage.setItem('Dati manager', JSON.stringify(data))
          const managerData = localStorage.getItem('Dati manager');
          const firstManagedAccount = managerData ? JSON.parse(managerData).managedAccounts[0] : null;
          localStorage.setItem('ActtuallyManagedAccount', JSON.stringify(firstManagedAccount))
          this.databaseService.getUserData(firstManagedAccount).subscribe((dataUser: any) => {
            localStorage.setItem('Dati utente', JSON.stringify(dataUser))
            this.router.navigate(['edit-profile'])
          }, error => {
            console.log("Errore in getUserData")
            console.log(error)
          })
        }, error => {
          console.log("Errore in getManagerData")
          console.log(error)
        });       
      //}, error => {
        console.log("Errore in signIn")
       // console.log(error)
      //});
    }

}

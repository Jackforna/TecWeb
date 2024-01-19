// settings.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  emailForm: FormGroup;

  constructor(private databaseService: DatabaseService, private authService: AuthService) {
    this.emailForm = new FormGroup({
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      const username = "Paolo" // Assumendo che il servizio di autenticazione fornisca il nome utente
      this.databaseService.sendEmail(
        this.emailForm.value.subject, 
        this.emailForm.value.message, 
        username
      ).subscribe(
        response => {
          console.log('Email inviata con successo', response);
          this.emailForm.reset();
        },
        error => console.error('Errore durante l\'invio dell\'email', error)
      );
    }
  }
}

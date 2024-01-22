// settings.component.ts
import { Component, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private databaseService: DatabaseService, private cdr: ChangeDetectorRef, private authService: AuthService, private renderer: Renderer2) {
  }

  toggleDarkMode(): void {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const action = isDarkMode ? 'removeClass' : 'addClass';
    this.renderer[action](document.body, 'dark-mode');
    localStorage.setItem('darkMode', String(!isDarkMode));
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    console.clear();
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  
}

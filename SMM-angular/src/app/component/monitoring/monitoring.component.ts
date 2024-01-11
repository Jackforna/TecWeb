import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';;
import { User } from 'src/app/models/user.moduls';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit{

  //Informazioni utente
  userDati = localStorage.getItem('Dati utente amministrato');
  datiUtente = this.userDati ? JSON.parse(this.userDati) : null;
  userId = this.datiUtente ? this.datiUtente._id : null;
  userNickname = this.datiUtente ? this.datiUtente.nickname : null;

  //Dati sui Squeal
  mostReactedSqueals: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private databaseService: DatabaseService, 
  ) { }

  ngOnInit() {
    //this.printUserSqueals(this.userId);
    console.log('Id utente:', this.userId);
    this.printUserSqueals();
  }

  printUserSqueals() {
    this.databaseService.getAllSquealsByUser().subscribe(
      (squeals) => {
        const userSqueals = (squeals as Array<any>).filter(s => s.sender === this.userNickname);

        // Ordina gli squeal dell'utente in base al numero totale di reazioni e prendi i primi 3
        this.mostReactedSqueals = userSqueals
          .map(squeal => ({
            ...squeal,
            totalReactions: squeal.pos_reactions + squeal.neg_reactions
          }))
          .sort((a, b) => b.totalReactions - a.totalReactions)
          .slice(0, 3);

        console.log('Squeals dell\'utente:', userSqueals);
        console.log('Most Reacted User Squeals:', this.mostReactedSqueals);
      },
      (error) => {
        console.error('Errore durante il recupero degli Squeals:', error);
      }
    );
  }
  

}


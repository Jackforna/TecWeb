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
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { Layer } from 'leaflet';
import { TileLayer } from 'leaflet';




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
  lessReactedSqueals: any[] = [];
  controversialSqueals: any[] = [];
  mostPopularSqueals: any[] = [];
  inpopularSqueals: any[] = [];

  //Struttura per cambio squeal
  currentSquealIndex = 0;
  currentLessReactedSquealIndex = 0;
  currentControversialSquealIndex = 0;
  currentPopularSquealIndex = 0;
  currentInpopularSquealIndex = 0;


  constructor(
    private route: ActivatedRoute, 
    private databaseService: DatabaseService, 
  ) { }

  ngOnInit() {
    //this.printUserSqueals(this.userId);
    console.log('Id utente:', this.userId);
    this.printUserSqueals();
    // this.loadSqueals();
  }

  ngAfterViewInit() { }
  
  /*
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

          this.lessReactedSqueals = userSqueals
            .map(squeal => ({
              ...squeal,
              totalReactions: squeal.pos_reactions + squeal.neg_reactions
            }))
            .sort((a, b) => a.totalReactions - b.totalReactions)
            .slice(0, 3); // Modifica il numero se necessario
          
          this.controversialSqueals = userSqueals
            .filter(squeal => {
              const posNegDiff = Math.abs(squeal.pos_reactions - squeal.neg_reactions);
              return posNegDiff <= 10 && squeal.pos_reactions + squeal.neg_reactions >= 0.25 * squeal.impressions;
            })
            .slice(0, 3); // o qualsiasi altro numero desideri
          
            this.mostPopularSqueals = userSqueals
              .map(squeal => ({
                ...squeal,
                reactionDifference: squeal.pos_reactions - squeal.neg_reactions // Calcola la differenza
              }))
              .sort((a, b) => b.reactionDifference - a.reactionDifference) // Ordina per differenza
              .slice(0, 3); // Prendi i primi 3

        console.log('Squeals dell\'utente:', userSqueals);
        console.log('Most Reacted User Squeals:', this.mostReactedSqueals);
        console.log('Less Reacted User Squeals:', this.lessReactedSqueals);
        console.log('Controversial User Squeals:', this.controversialSqueals);
        console.log('Most Popular User Squeals:', this.mostPopularSqueals);
      },
      (error) => {
        console.error('Errore durante il recupero degli Squeals:', error);
      }
    );
  }
  */

  printUserSqueals() {
    this.databaseService.getAllSquealsByUser().subscribe(
      (squeals) => {
        const userSqueals = (squeals as Array<any>).filter(s => s.sender === this.userNickname);
  
        // La logica per mostReactedSqueals e lessReactedSqueals rimane invariata
        this.mostReactedSqueals = userSqueals
          .map(squeal => ({
            ...squeal,
            totalReactions: squeal.pos_reactions + squeal.neg_reactions
          }))
          .sort((a, b) => b.totalReactions - a.totalReactions)
          .slice(0, 3);
  
        this.lessReactedSqueals = userSqueals
          .map(squeal => ({
            ...squeal,
            totalReactions: squeal.pos_reactions + squeal.neg_reactions
          }))
          .sort((a, b) => a.totalReactions - b.totalReactions)
          .slice(0, 3);
  
        this.controversialSqueals = userSqueals
          .filter(squeal => {
            const criticalMass = 0.25 * squeal.impressions;
            //return squeal.pos_reactions > criticalMass && squeal.neg_reactions > criticalMass;       /*Caso in cui non siano etichettati*/
            return squeal.category === "Controversial"
          })
          .slice(0, 3);
  
        // Aggiornamento della logica per mostPopularSqueals
        this.mostPopularSqueals = userSqueals
          .filter(squeal => {
            const criticalMass = 0.25 * squeal.impressions;
            //return (squeal.pos_reactions > criticalMass)        /*Caso in cui non siano etichettati*/ 
            return squeal.category === "Popular"
          })
          .sort((a, b) => {
            return b.pos_reactions - a.pos_reactions; // Esempio di ordinamento basato su reazioni positive
          })
          .slice(0, 3);

        this.inpopularSqueals = userSqueals
          .filter(squeal => {
            const criticalMass = 0.25 * squeal.impressions;
            // return squeal.neg_reactions > criticalMass;      /*Caso in cui non siano etichettati*/       
            return squeal.category === "Inpopular"          
          })
          .sort((a, b) => b.neg_reactions - a.neg_reactions)
          .slice(0, 3);
  
        console.log('Squeals dell\'utente:', userSqueals);
        console.log('Most Reacted User Squeals:', this.mostReactedSqueals);
        console.log('Less Reacted User Squeals:', this.lessReactedSqueals);
        console.log('Controversial User Squeals:', this.controversialSqueals);
        console.log('Most Popular User Squeals:', this.mostPopularSqueals);
        console.log('Inpopular User Squeals:', this.inpopularSqueals);
      },
      (error) => {
        console.error('Errore durante il recupero degli Squeals:', error);
      }
    );
  }
  



  showNextSqueal() {
    if (this.currentSquealIndex < this.mostReactedSqueals.length - 1) {
        this.currentSquealIndex++;
    }
  }

  showPreviousSqueal() {
      if (this.currentSquealIndex > 0) {
          this.currentSquealIndex--;
      }
  }

  showNextLessReactedSqueal() {
    if (this.currentLessReactedSquealIndex < this.lessReactedSqueals.length - 1) {
        this.currentLessReactedSquealIndex++;
    }
  }
  
  showPreviousLessReactedSqueal() {
    if (this.currentLessReactedSquealIndex > 0) {
        this.currentLessReactedSquealIndex--;
    }
  }

  showPreviousControversialSqueal() {
    if (this.currentControversialSquealIndex > 0) {
      this.currentControversialSquealIndex--;
    }
  }

  showNextControversialSqueal() {
    if (this.currentControversialSquealIndex < this.controversialSqueals.length - 1) {
      this.currentControversialSquealIndex++;
    }
  }

  showPreviousPopularSqueal() {
    if (this.currentPopularSquealIndex > 0) {
      this.currentPopularSquealIndex--;
    }
  }

  showNextPopularSqueal() {
    if (this.currentPopularSquealIndex < this.mostPopularSqueals.length - 1) {
      this.currentPopularSquealIndex++;
    }
  }

  showNextInpopularSqueal() {
    if (this.currentInpopularSquealIndex < this.inpopularSqueals.length - 1) {
      this.currentInpopularSquealIndex++;
    }
  }

  showPreviousInpopularSqueal() {
    if (this.currentInpopularSquealIndex > 0) {
      this.currentInpopularSquealIndex--;
    }
  }

}


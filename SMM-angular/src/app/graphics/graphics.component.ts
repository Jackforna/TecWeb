import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import * as moment from 'moment';

Chart.register(...registerables);

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent {
  userSqueals: any[] = []; // Array per archiviare i squeal dell'utente

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    // Chiama this.databaseService.getAllSquealsByUser() per ottenere tutti i squeal dell'utente
    this.getAllUserSqueals();
  }

  getAllUserSqueals() {
    this.databaseService.getAllSquealsByUser().subscribe(
      (squeals) => {
        this.userSqueals = squeals as any[]; // Archivia tutti i squeal dell'utente

        // Ora puoi elaborare questi dati per ottenere le reazioni nel tempo
        this.processUserReactionsOverTime();
      },
      (error) => {
        console.error('Errore durante il recupero dei squeal dell\'utente:', error);
      }
    );
  }

  processUserReactionsOverTime() {
    // In questo metodo, puoi elaborare this.userSqueals per ottenere le reazioni nel tempo
    // Ad esempio, puoi scorrere this.userSqueals e raccogliere dati sulle reazioni nel tempo
    // Utilizza le informazioni desiderate dal formato dei squeal che hai fornito

    const reactionsOverTime: {
      date: any; // Puoi utilizzare data e ora per costruire un timestamp
      posReactions: any; negReactions: any;
    }[] = []; // Archivia qui le reazioni nel tempo

    // Esempio di come potresti raccogliere le reazioni nel tempo
    this.userSqueals.forEach((squeal) => {
      const reactionData = {
        date: squeal.date, // Puoi utilizzare data e ora per costruire un timestamp
        posReactions: squeal.pos_reactions,
        negReactions: squeal.neg_reactions
      };
      reactionsOverTime.push(reactionData);
    });

    // Ora hai le reazioni dell'utente nel tempo in reactionsOverTime
    console.log('Reazioni nel tempo:', reactionsOverTime);

    // Ora puoi utilizzare questi dati per creare il grafico
    this.createChart(); // Remove the argument from the method call
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [moment('2023-01-01'), moment('2023-01-02'), moment('2023-01-03')],
          datasets: [
            {
              label: 'Reazioni Pos/Neg',
              data: [10, 20, 15],
              borderColor: 'blue',
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'YYYY-MM-DD'
                }
              }
            },
            y: {
              // Altre opzioni per l'asse y se necessario
            }
          }
        }
        
  });
    }
  }
}

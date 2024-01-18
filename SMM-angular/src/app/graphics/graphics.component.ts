import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import * as moment from 'moment';

Chart.register(...registerables);

const chartOptions = {
  responsive: true, // Se impostato su true, il grafico si adatterà al contenitore
  maintainAspectRatio: false, // Se impostato su false, consente di impostare una dimensione fissa
  // Altre opzioni...
};

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent {
  userSqueals: any[] = []; // Array per archiviare i squeal dell'utente
  width = 400; // Larghezza in pixel
  height = 200; // Altezza in pixel
  postsChart: any;


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
        this.processUserPostsOverTime();
      },
      (error) => {
        console.error('Errore durante il recupero dei squeal dell\'utente:', error);
      }
    );
  }

  processUserReactionsOverTime() {
    const reactionsOverTime = this.userSqueals.map(squeal => {
      // Assicurati che la data sia nel formato corretto e valido prima di convertirla
      const formattedDate = moment(squeal.date, 'DD/MM/YYYY').isValid() 
        ? moment(squeal.date, 'DD/MM/YYYY').toDate() 
        : undefined;  // o gestisci la data non valida in altro modo
  
      return {
        date: formattedDate,
        posReactions: squeal.pos_reactions,
        negReactions: squeal.neg_reactions
      };
    });
  
    // Filtra eventuali record con date non valide prima di passarli al grafico
    const validReactionsOverTime = reactionsOverTime.filter(r => r.date !== undefined);
  
    // Ora hai le reazioni dell'utente nel tempo in validReactionsOverTime
    console.log('Reazioni nel tempo:', validReactionsOverTime);
  
    // Passa questo array alla funzione createChart
    this.createChart(validReactionsOverTime);
    this.createDifferenceChart(validReactionsOverTime);
  }
  
  
  createChart(reactionsOverTime: any[]) {
    // Trova il valore massimo tra tutte le reazioni positive e negative
    const maxReactions = Math.max(...reactionsOverTime.map(r => Math.max(r.posReactions, r.negReactions)));
  
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    ctx.width = this.width;
    ctx.height = this.height;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: reactionsOverTime.map((r: { date: any; }) => r.date),
          datasets: [{
            label: 'Reazioni Totali',
            data: reactionsOverTime.map((r: { posReactions: number; negReactions: number; }) => r.posReactions + r.negReactions),
            borderColor: 'blue',
            borderWidth: 2
          }]
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true, // Fai iniziare l'asse Y da 0
              min: 0, // Imposta il minimo dell'asse Y a 0 per evitare valori negativi
              suggestedMax: maxReactions // Usa il valore massimo calcolato come prima
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'LL',
                displayFormats: {
                  day: 'YYYY-MM-DD'
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label;
                },
                label: (context) => {
                  const reactionIndex = context.dataIndex;
                  const posReactions = reactionsOverTime[reactionIndex].posReactions;
                  const negReactions = reactionsOverTime[reactionIndex].negReactions;
                  return `Positive: ${posReactions}, Negative: ${negReactions}`;
                }
              }
            }
          }
        }  
      });
    } 
  }

  createDifferenceChart(reactionsOverTime: any[]) {
    const ctxDifference = document.getElementById('myChartDifference') as HTMLCanvasElement;
    ctxDifference.width = this.width;
    ctxDifference.height = this.height;
    if (ctxDifference) {
      const differenceChart = new Chart(ctxDifference, {
        type: 'line',
        data: {
          labels: reactionsOverTime.map((r: { date: any; }) => r.date),
          datasets: [{
            label: 'Differenza Reazioni Pos/Neg',
            data: reactionsOverTime.map((r: { posReactions: number; negReactions: number; }) => r.posReactions - r.negReactions),
            borderColor: 'red',
            borderWidth: 2
            }]
            },
            options: {
            responsive: false,
            scales: {
            y: {
            beginAtZero: true,
            // min: 0, // Potresti voler rimuovere questa linea se ti aspetti valori negativi
            // suggestedMax: maxReactions // Commentato se non vuoi un valore massimo suggerito
            },
            x: {
            type: 'time',
            time: {
            unit: 'day',
            tooltipFormat: 'LL',
            displayFormats: {
            day: 'YYYY-MM-DD'
            }
            }
            }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    return tooltipItems[0].label;
                  },
                  label: (context) => {
                    const reactionIndex = context.dataIndex;
                    const diffReactions = reactionsOverTime[reactionIndex].posReactions - reactionsOverTime[reactionIndex].negReactions;
                    return `Diff: ${diffReactions}`;
                  }
                }
              }
            }
            }
            });
            }
  }

  
  processUserPostsOverTime() {
    const countsByDate: { [date: string]: number } = {};

    // Assumendo che i tuoi squeal abbiano una proprietà 'date' in formato 'DD/MM/YYYY'
    this.userSqueals.forEach(squeal => {
      // Converti la data dello squeal in un formato consistente
      const date = moment(squeal.date, 'DD/MM/YYYY').isValid() 
        ? moment(squeal.date, 'DD/MM/YYYY').format('YYYY-MM-DD') 
        : 'Invalid date'; // Usa un segnaposto come 'Invalid date' per le date non valide

      if (date !== 'Invalid date' && date in countsByDate) {
        countsByDate[date]++;
      } else if (date !== 'Invalid date') {
        countsByDate[date] = 1;
      }
    });

    // Ora creiamo l'array dei dati per il grafico
    const postsData = Object.keys(countsByDate).map(date => {
      return { date, count: countsByDate[date] };
    });

    const validPostsData = postsData.filter(post => moment(post.date, 'YYYY-MM-DD').isValid());
    // Ordina i dati per data
    validPostsData.sort((a, b) => moment(a.date).diff(moment(b.date)));
    // Crea il grafico con i dati
    console.log('Posts nel tempo:', validPostsData);
    this.createPostChart(validPostsData);
  }

  createPostChart(postsData: { date: string; count: number }[]): void {
    // Find the maximum count value to set the y-axis range
    const maxCount = Math.max(...postsData.map(post => post.count));
  
    const currentDate = moment().format('YYYY-MM-DD');
    // Check if the current date exists in the postsData array
    const currentDateIndex = postsData.findIndex(post => post.date === currentDate);

    // If the current date does not exist, add it with a count of 0
    if (currentDateIndex === -1) {
      postsData.push({ date: currentDate, count: 0 });
    }

    postsData.sort((a, b) => moment(a.date).diff(moment(b.date)));


    const ctx = document.getElementById('myChartPosts') as HTMLCanvasElement;
    ctx.width = this.width;
    ctx.height = this.height;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: postsData.map(post => moment(post.date, 'YYYY-MM-DD').toDate()),
          datasets: [{
            label: 'Posts per day',
            data: postsData.map(post => post.count),
            borderColor: 'green',
            borderWidth: 2
          }]
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              suggestedMax: maxCount
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'LL',
                displayFormats: {
                  day: 'YYYY-MM-DD'
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label;
                },
                label: (context) => {
                  const postIndex = context.dataIndex;
                  const count = postsData[postIndex].count;
                  return `Count: ${count}`;
                }
              }
            }
          }
        }
      });
    }
  }
  
}
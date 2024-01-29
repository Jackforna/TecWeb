import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Channel } from 'src/app/models/user.moduls';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserData(userId: string) {
    return this.http.get(`http://localhost:8080/get-user/${userId}`).pipe(
      map((data: any) => {
        // Rimuovi la password dai dati dell'utente
        delete data.password;
        return data;
      })
    );
  }

  getAllUsers() {
    return this.http.get('/get-users');
  }

  updateUserProfile(userId: string, updateData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/update-user/${userId}`, updateData)
      .pipe(
        catchError(this.handleError),
        map(response => response as { message: string }) // Aggiungi questa mappatura
      );
  }
  

  private handleError(error: HttpErrorResponse) {
    // Qui puoi aggiungere la logica di gestione degli errori
    console.error('An error occurred:', error.error);
    return throwError('Something bad happened; please try again later.');
  }

  // Nuova funzione che restituisce un Observable di un array di User
  getAllUsers2(): Observable<User[]> {
    return this.http.get<User[]>('/get-users').pipe(
      map(response => response as User[])
    );
  }

  addSqueal(squealData: any): Observable<any> {
    const url = 'http://localhost:8080/add-squeal';
    return this.http.post(url, squealData);
  }

  updateSqueal(squealId: string, updateData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/update-squeal/${squealId}`, updateData);
  }

  getAllSquealsByUser() {
    return this.http.get(`http://localhost:8080/get-listSqueals`);
  }
  
  sendEmail(subject: string, message: string, username: string): Observable<any> {
    const emailData = {
      subject: subject,
      message: message,
      username: username
    };

    return this.http.post(`http://localhost:8080/send-email`, emailData);
  }

  addChannel(channelData: any): Observable<any> {
    const url = 'http://localhost:8080/add-channel';
    return this.http.post(url, channelData);
  }

  createChannel(channelName: string, sender: string): Observable<any> {
    const channelData = {
      name: channelName,
      sender: sender
    };
    return this.http.post('http://localhost:8080/add-channel', channelData);
  }

  getAllChannels(): Observable<any> {
    return this.http.get('/get-listChannels');
  }

  getAdressFromCoordinates(lat: number, lon: number): Observable<any> {
    // Usa l'API di geocoding scelta qui
    const url = `https://api.geocoding.com/reverse?lat=${lat}&lon=${lon}`;
    return this.http.get(url);
  }

  getMapLinkFromCoordinates(lat: number, lon: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
  
  /*
  async getAddressGeolocation(lat: number, lon: number): Promise<string> {
    if (lat === undefined || lon === undefined) {
      throw new Error("Latitudine o longitudine non definita");
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const response = await lastValueFrom(
        this.http.get<any>(url).pipe(
          map(data => {
            const via = data.address.road || data.address.name || '';
            const citta = data.address.town || data.address.city || data.address.village || '';
            const cap = data.address.postcode || '';
            const nazione = data.address.country || '';
            return `${via}, ${citta}, ${cap}, ${nazione}`;
          })
        )
      );
      return response;
    } catch (error) {
      console.error("Errore nella richiesta:", error);
      throw new Error("Errore nella richiesta di geocoding");
    }
  }
  */

  async getAddressGeolocation(lat: number, lon: number): Promise<string> {
    if (lat === undefined || lon === undefined) {
      throw new Error("Latitudine o longitudine non definita");
    }
  
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  
    try {
      const response = await this.http.get<any>(url).pipe(
        map(data => {
          const via = data.address.road || data.address.name || '';
          const citta = data.address.town || data.address.city || data.address.village || '';
          const cap = data.address.postcode || '';
          const nazione = data.address.country || '';
          return `${via}, ${citta}, ${cap}, ${nazione}`;
        })
      ).toPromise(); // Utilizzo .toPromise() per attendere la risposta HTTP
      return response || ''; // Add default value to handle undefined case
    } catch (error) {
      console.error("Errore nella richiesta:", error);
      throw new Error("Errore nella richiesta di geocoding");
    }
  }
  
}

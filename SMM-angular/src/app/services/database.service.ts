import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.moduls';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private http: HttpClient,) { }

  UrlSite = 'http://localhost:8080'; 
  UrlLocal = 'http://localhost:8080';

  getUserData(userId: string) {
    return this.http.get(this.UrlSite+`/get-user/${userId}`).pipe(
      map((data: any) => {
        delete data.password;
        return data;
      })
    );
  } 

  getAllUsers() {
    return this.http.get('/get-users');
  }

  updateUserProfile(userId: string, updateData: any): Observable<any> {
    return this.http.put(this.UrlSite+`/update-user/${userId}`, updateData)
      .pipe(
        catchError(this.handleError),
        map(response => response as { message: string }) 
      );
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    return throwError('Something bad happened; please try again later.');
  }

  getAllUsers2(): Observable<User[]> {
    return this.http.get<User[]>('/get-users').pipe(
      map(response => response as User[])
    );
  }

  addSqueal(squealData: any): Observable<any> {
    const url = this.UrlSite+'/add-squeal';
    return this.http.post(url, squealData);
  }

  updateSqueal(squealId: string, updateData: any): Observable<any> {
    return this.http.put(this.UrlSite+`/update-squeal/${squealId}`, updateData);
  }

  getAllSquealsByUser() {
    return this.http.get(this.UrlSite+`/get-listSqueals`);
  }
  
  sendEmail(subject: string, message: string, username: string): Observable<any> {
    const emailData = {
      subject: subject,
      message: message,
      username: username
    };

    return this.http.post(this.UrlSite+`/send-email`, emailData);
  }

  addChannel(channelData: any): Observable<any> {
    const url = this.UrlSite+'/add-channel';
    return this.http.post(url, channelData);
  }

  createChannel(channelName: string, sender: string): Observable<any> {
    const channelData = {
      name: channelName,
      sender: sender
    };
    return this.http.post(this.UrlSite+'/add-channel', channelData);
  }

  getAllChannels(): Observable<any> {
    return this.http.get('/get-listChannels');
  }

  getAdressFromCoordinates(lat: number, lon: number): Observable<any> {
    const url = `https://api.geocoding.com/reverse?lat=${lat}&lon=${lon}`;
    return this.http.get(url);
  }

  getMapLinkFromCoordinates(lat: number, lon: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
  
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
      ).toPromise();
      return response || '';
    } catch (error) {
      console.error("Errore nella richiesta:", error);
      throw new Error("Errore nella richiesta di geocoding");
    }
  }

  deleteAllSqueals(): Observable<any> {
    return this.http.delete(this.UrlSite+'/delete-all-squeals');
  };

  deleteAllChannels(): Observable<any> {
    const body = {
    };
    return this.http.put(this.UrlSite+'/update-channels', body);
  }

  deleteUser(squealId: string): Observable<any> {
    const body = {
    };
    return this.http.delete(this.UrlSite+`/delete-user/${squealId}`, body);
  }

  uploadVideo(video: any): Observable<any> {
    return this.http.post(this.UrlSite+`/upload-video`, video);
  }

  updateChannel(id: string, postToAdd: any): Observable<any> {
    const url = this.UrlSite+`/update-channel/${id}`; 
    return this.http.put(url, { postToAdd });
  }
  
}

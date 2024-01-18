import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.moduls';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserData(userId: string) {
    return this.http.get(`http://localhost:8080/get-user/${userId}`);
  }

  getAllUsers() {
    return this.http.get('/get-users');
  }

  updateUserProfile(userId: string, updateData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/update-user/${userId}`, updateData);
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
  
}

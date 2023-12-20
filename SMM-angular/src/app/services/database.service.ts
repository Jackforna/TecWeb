import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class DatabaseService {

  //url = `https://angular-social-network-2b1a0.firebaseio.com/user.json`

  constructor(private http: HttpClient, private authService: AuthService) { }

  
  insertUser(uid: string, email: string, username: string) {
    const signUpUrl = `https://squealer-b28ee-default-rtdb.europe-west1.firebasedatabase.app//persone/${uid}.json`; 
    const defaultProfilePictureUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg';
    const defaultProfileDescription = 'This is my profile description';
    const defaultCharLeft = 150;
    const body = { 
      email: email, 
      username: username, 
      //password: password,
      profilePictureUrl: defaultProfilePictureUrl,
      profileDescription: defaultProfileDescription,
      charLeft: defaultCharLeft,
    };
    return this.http.put(signUpUrl, body);
  }

  insertManager(uid: string, email: string, isManager: boolean) {
    const signUpUrl = `https://squealer-b28ee-default-rtdb.europe-west1.firebasedatabase.app/user/${uid}.json`; 
    const managedAccounts = ['0XpcGclLseWGmSQzDVCuMcZt5Js2','gcRnGsY5vGPo8rGzbeq3ZWyK07h1'];
    
    const body = { 
      email: email, 
      managedAccounts: managedAccounts,
      isManager: isManager
    };
    return this.http.put(signUpUrl, body);
  }
  
  getUserData(uid: string) {
    const url = `https://squealer-b28ee-default-rtdb.europe-west1.firebasedatabase.app//persone/${uid}.json`; 
    return this.http.get(url);
  }

  getManagerData(uid: string) {
    const url = `https://squealer-b28ee-default-rtdb.europe-west1.firebasedatabase.app/user/${uid}.json`; 
    return this.http.get(url);
  }
 
  patchUserData(uid: string, body: {}) {
    const url = `https://squealer-b28ee-default-rtdb.europe-west1.firebasedatabase.app//persone/${uid}.json`; 
    return this.http.patch(url, body);
  }

  /*Non funziona guarda spiegazione in edit-profile*/
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const uploadUrl = '';
    return this.http.post(uploadUrl, formData);
  }

  /*
  getUser(url: string){
    return this.http.get(`${url}?auth=${this.authService.user.token}`)
  }

  deleteUser(url: string, id: string){
    return this.http.delete(`${url}/${id}.json`)
  }

  patchUser(url: string, id: string, body: {}){
    return this.http.patch(`${url}/${id}.json`, body)
  }
  */
  
}

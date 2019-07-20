import { Injectable } from '@angular/core';

import { config } from './config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http:HttpClient,
    private router : Router
  ) { }

  checkJWT():Promise<boolean>{
    let userAuth: Promise<boolean>= <Promise<boolean>>this.http.get(`${config.apiUrl}/api/auth`)
    .toPromise()
    .then( res => { 
        return true;
      }
    ).catch((err) => { 
      this.logoutUser();
      return false; 
    })
    return userAuth;
  }

  getToken(){
    return localStorage.getItem('token');
  }

  loginUser(user) : Observable<any>{
    return this.http.post<any>(`${config.apiUrl}/login`,user);
  }

  logoutUser(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}

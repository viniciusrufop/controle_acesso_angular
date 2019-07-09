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

  isAuthenticated(){
    return this.http.get(`${config.apiUrl}/api/auth`);
  }

  loginUser(user) : Observable<any>{
    return this.http.post<any>(`${config.apiUrl}/login`,user);
  }

  loggedIn(){
    return !!localStorage.getItem('token');
  }

  logoutUser(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(){
    return localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';

import { config } from './config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private http:HttpClient,
    private router : Router
  ) { }

  checkJWT():Promise<boolean>{
    this.blockUI.start();
    let userAuth: Promise<boolean>= <Promise<boolean>>this.http.get(`${config.apiUrl}/api/auth`)
    .toPromise()
    .then( res => { 
        return true;
      }
    ).catch((err) => { 
      this.logoutUser();
      return false; 
    })
    this.blockUI.stop();
    return userAuth;
  }

  getToken(){
    return localStorage.getItem('token');
  }

  loginUser(obj) : Observable<any>{
    return this.http.post<any>(`${config.apiUrl}/login`,obj);
  }

  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('dataUserId');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

}

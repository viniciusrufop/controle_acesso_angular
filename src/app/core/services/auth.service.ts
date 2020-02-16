import { UserData } from './../interfaces/user-data';
import { Injectable } from '@angular/core';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';


import { config } from './config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StorageKeys } from '../interfaces/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @BlockUI() blockUI: NgBlockUI;

  private _isAuthenticated = new ReplaySubject<boolean>(1);
  private _userData = new ReplaySubject<UserData>(1);

  constructor(
    private http:HttpClient,
    private router : Router
  ) { }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  get userData(): Observable<UserData> {
    return this._userData.asObservable();
  }

  loginUser(obj) : Observable<UserData>{
    return this.http.post<UserData>(`${config.apiUrl}/login`, obj).pipe(
      map(res => res['result']),
      tap(res => {
        this.setAuthState({token: res.token, userName: res.userName, userEmail: res.userEmail, isAuthenticated: true, userData: res});
      }),
      catchError(error => {
        this.logoutUser();
        return throwError(error);
      })
    );
  }

  logged(): Observable<UserData> {
    return this.http.get(`${config.apiUrl}/api/logged`).pipe(
      map(res => res['result']),
      tap(res => {
        this.setAuthState({token: res.token, userName: res.userName, userEmail: res.userEmail, isAuthenticated: true, userData: res});
      }),
      catchError(error => {
        this.logoutUser();
        return throwError(error);
      })
    );
  }

  logoutUser(){
    localStorage.clear();
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  private setAuthState(authData: {token: string, userName: string, userEmail: string, isAuthenticated: boolean, userData: UserData}): void {
    window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
    window.localStorage.setItem(StorageKeys.AUTH_USERNAME, authData.userName);
    window.localStorage.setItem(StorageKeys.AUTH_USEREMAIL, authData.userEmail);
    this._userData.next(authData.userData);
    this._isAuthenticated.next(authData.isAuthenticated);
  }


}

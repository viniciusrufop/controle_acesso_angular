import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService:AuthService
  ) { }

  private verifyAccess(){
    return this.authService.checkJWT();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | 
    Promise<boolean | UrlTree> | boolean | UrlTree{
      return this.verifyAccess();
  }

  canLoad(route : Route):Observable<boolean> | Promise<boolean> | boolean{
    return this.verifyAccess();
  }
}

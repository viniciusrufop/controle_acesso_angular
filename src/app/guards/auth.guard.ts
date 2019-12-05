import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,CanActivateChild ,Router, Route, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../core/services/auth.service';
import { admin } from './../core/services/admin';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(
    private authService:AuthService,
    private router: Router
  ) { }

  private verifyAccess(){
    return this.authService.checkJWT();
  }

  private verifyAdmin(){
    if(admin.value){
      return true;
    } else {
      this.router.navigate(['/historico']);
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      return this.verifyAccess();
  }

  canLoad(route : Route):Observable<boolean> | Promise<boolean> | boolean{
    console.log('canLoad',admin.value)
    // return admin.value;
    return this.verifyAccess();
  }

  /* canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> | Promise<boolean> | boolean{
    return this.verifyAdmin();
  } */

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    return this.verifyAdmin();
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,CanActivateChild ,Router, Route, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../core/services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(
    private authService:AuthService,
    private router: Router
  ) { }

  private verifyAccess(){
    return this.authService.isAuthenticated.pipe(
      tap(is => { if (!is) { this.router.navigate(['/login']); } })
    );
  }

  private verifyAdmin(){
    return this.authService.isAdmin.pipe(
      tap(is => { if (!is) { this.router.navigate(['/historico']); } })
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      return this.verifyAccess();
  }

  canLoad(route : Route):Observable<boolean> | Promise<boolean> | boolean{
    return this.verifyAccess();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    return this.verifyAdmin();
  }

}

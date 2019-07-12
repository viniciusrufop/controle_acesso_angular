import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  private verifyAccess(){
    if (this.authService.loggedIn()) {
      this.router.navigate(['/historico'])
      return false
    } else {
      return true
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | 
    Promise<boolean | UrlTree> | boolean | UrlTree{
    return this.verifyAccess();
  }
  
}

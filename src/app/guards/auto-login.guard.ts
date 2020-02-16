import { StorageKeys } from './../core/interfaces/storage-keys';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate{

  constructor(
    private router: Router
  ) { }

  private verifyAccess(){
    if(localStorage.getItem(StorageKeys.AUTH_TOKEN) === null){
      return true;
    } else {
      this.router.navigate(['/historico']);
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

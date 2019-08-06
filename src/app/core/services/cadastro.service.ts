import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

import { config } from './config';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep) : Observable<any>{
    cep = cep.replace(/\D/g,'');
    if(cep != ""){
      const validaCep = /^[0-9]{8}$/;
      if(validaCep.test(cep)){
        return this.http.post<any>(`${config.apiUrl}/api/get-cep`,{cep:cep});
      }
    }
    return of({})
  }

  getEstadoBr(){
    return this.http.get('assets/dados/estadosbr.json');
  }

  getEmptyTags(): Observable<any>{
    return this.http.get(`${config.apiUrl}/api/get-empty-tags`);
  }

  createUser(dataUser): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/create-user`,{params:dataUser});
  }

  getEmailUser(email): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/get-email-user`,{params:email});
  }

  getLoginUser(login): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/get-login-user`,{params:login});
  }

  getAllUsers(): Observable<any>{
    return this.http.get(`${config.apiUrl}/api/get-all-users`);
  }

  deleteUser(idUser): Observable<any>{
    return this.http.delete(`${config.apiUrl}/api/delete-user`,{params:idUser});
  }

}

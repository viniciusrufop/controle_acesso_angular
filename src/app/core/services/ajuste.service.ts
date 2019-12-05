import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { config } from './config';

@Injectable({
  providedIn: 'root'
})
export class AjusteService {

  constructor(private http: HttpClient) { }

  adjustmentRequest(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/adjustment-request`,{params:params});
  }

  getAdjustmentRequest(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/get-adjustment-request`,{params:params});
  }

  getAdjustmentHistoryRequest(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/get-adjustment-history-request`,{params:params});
  }

  acceptAdjustmentRequest(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/accept-adjustment-request`,{params:params});
  }

  getTags(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/get-tags`,{params:params});
  }

  deleteTag(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/delete-tag`,{params:params});
  }

  desvincularTag(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/desvincular-tag`,{params:params});
  }

  vincularTag(params): Observable<any>{
    return this.http.post(`${config.apiUrl}/api/vincular-tag`,{params:params});
  }

}

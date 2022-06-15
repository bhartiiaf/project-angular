import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { OAuthService } from 'angular-oauth2-oidc';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiGatewayService {
  url : string = environment.apigwUrl;
  dastoken : string;
  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.dastoken = this.oauthService.getAccessToken();
  }

  getInventory(): Observable<any> {
    return this.http.get<any>(this.url, { headers : {'Authorization' : 'Bearer ' + this.dastoken}});
  }

  postInventory(body: any): Observable<any> {
    return this.http.post<any>(this.url, body, { headers : {'Authorization' : 'Bearer ' + this.dastoken}});
  }
}


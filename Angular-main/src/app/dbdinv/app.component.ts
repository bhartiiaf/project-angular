import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService,JwksValidationHandler } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['/app.component.css']
})

@Injectable()

export class AppComponent{
  title = 'adb';

  constructor(private oauthService: OAuthService) {
    this.initializeOAuthService();
  }
  
  initializeOAuthService() {
  
      this.oauthService.configure({
        redirectUri: window.location.origin,
        clientId: environment.clientId,
        requireHttps: false,
        loginUrl: environment.adfsUrl + '/oauth2/authorize',
        issuer: environment.adfsUrl,
        scope: "openid profile email",
        responseType: 'id_token token',
        oidc: true,
        logoutUrl: environment.adfsUrl +
          '/ls/?wa=wsignoutcleanup1.0&wreply=' + location.protocol +
          '//' + location.hostname + (location.port ? ':' + location.port : ''),
        postLogoutRedirectUri: window.location.origin
        //postLogoutRedirectUri: location.protocol + '//' +
        //  location.hostname + (location.port ? ':' + location.port : '')
      });
  
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      //this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.oauthService.tryLogin();
      this.oauthService.setStorage(sessionStorage);
  

  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  showToken() {
    alert(this.oauthService.getAccessToken());
  }

  get token(){
    let claims:any = this.oauthService.getIdentityClaims();
    if (!this.oauthService.hasValidAccessToken()) return null;
    return true;
  }

  ngOnInit() {
  }
}

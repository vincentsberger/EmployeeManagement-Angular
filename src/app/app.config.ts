import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {KeycloakAngularModule, KeycloakBearerInterceptor, KeycloakService} from "keycloak-angular";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

export const initializeKeycloak = (keycloak: KeycloakService) => async () =>
  keycloak.init({
    config: {
      url: 'https://keycloak.szut.dev/auth',
      realm: 'szut',
      clientId: 'employee-management-service-frontend',
    },
    loadUserProfileAtStartUp: true,
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri:
        window.location.origin + '/silent-check-sso.html',
      checkLoginIframe: false,
      redirectUri: 'http://localhost:4200',
    },
  });


function initializeApp(keycloak: KeycloakService): () => Promise<boolean> {
  return () => initializeKeycloak(keycloak)();
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    KeycloakAngularModule,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [KeycloakService]
    },
    KeycloakService,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
};

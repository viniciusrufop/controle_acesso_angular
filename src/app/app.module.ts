import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { TokenInterceptorService } from './core/services/token-interceptor.service';

import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { LayoutModule } from './layout/layout.module';

import { BlockUIModule } from 'ng-block-ui';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    LoginModule,
    HttpClientModule,
    LayoutModule,
    BlockUIModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    AutoLoginGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass : TokenInterceptorService,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

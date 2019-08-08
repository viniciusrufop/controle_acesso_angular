import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
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

import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import '@progress/kendo-angular-intl/locales/pt/all';


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
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    SweetAlert2Module.forRoot(),
    DialogsModule,
    DateInputsModule
  ],
  providers: [
    AuthGuard,
    AutoLoginGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass : TokenInterceptorService,
      multi : true
    },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

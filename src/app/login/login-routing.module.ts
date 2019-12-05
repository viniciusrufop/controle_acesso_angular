import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AutoLoginGuard } from './../guards/auto-login.guard';

const routes: Routes = [
  { path : '' , pathMatch : 'full' , redirectTo : 'login'},
  { path: 'login' , component: LoginComponent, canActivate: [AutoLoginGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

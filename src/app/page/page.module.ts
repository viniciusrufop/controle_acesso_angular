import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { PageCadastroComponent } from './components/page-cadastro/page-cadastro.component';
import { PageHistoricoComponent } from './components/page-historico/page-historico.component';
import { PageUsuarioComponent } from './components/page-usuario/page-usuario.component';

@NgModule({
  declarations: [
    PageCadastroComponent,
    PageHistoricoComponent, 
    PageUsuarioComponent],
  imports: [
    CommonModule,
    PageRoutingModule,
    SharedModule
  ]
})
export class PageModule { }

import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { PageCadastroComponent } from './components/page-cadastro/page-cadastro.component';
import { PageHistoricoComponent } from './components/page-historico/page-historico.component';
import { PageUsuarioComponent, PhonePipe } from './components/page-usuario/page-usuario.component';
import { ModalUserEditComponent } from './components/modal-user-edit/modal-user-edit.component';

@NgModule({
  declarations: [
    PageCadastroComponent,
    PageHistoricoComponent, 
    PageUsuarioComponent,
    PhonePipe,
    ModalUserEditComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    SharedModule,
  ],
  entryComponents: [ 
    ModalUserEditComponent 
  ],
})
export class PageModule { }

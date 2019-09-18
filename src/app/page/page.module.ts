import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { PageCadastroComponent } from './components/page-cadastro/page-cadastro.component';
import { PageHistoricoComponent } from './components/page-historico/page-historico.component';
import { PageUsuarioComponent } from './components/page-usuario/page-usuario.component';
import { ModalUserEditComponent } from './components/modal-user-edit/modal-user-edit.component';
import { PageRelatorioComponent } from './components/page-relatorio/page-relatorio.component';
import { PagePerfilComponent } from './components/page-perfil/page-perfil.component';
import { PageAjusteComponent } from './components/page-ajuste/page-ajuste.component';
import { PageTagsComponent } from './components/page-tags/page-tags.component';
import { ModalVinculaTagComponent } from './components/modal-vincula-tag/modal-vincula-tag.component';

@NgModule({
  declarations: [
    PageCadastroComponent,
    PageHistoricoComponent, 
    PageUsuarioComponent,
    ModalUserEditComponent,
    PageRelatorioComponent,
    PagePerfilComponent,
    PageAjusteComponent,
    PageTagsComponent,
    ModalVinculaTagComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    SharedModule,
  ],
  entryComponents: [ 
    ModalUserEditComponent,
    ModalVinculaTagComponent 
  ],
})
export class PageModule { }

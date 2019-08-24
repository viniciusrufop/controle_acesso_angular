import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { PageUsuarioComponent } from './../page/components/page-usuario/page-usuario.component';
import { PageHistoricoComponent } from './../page/components/page-historico/page-historico.component';
import { PageCadastroComponent } from './../page/components/page-cadastro/page-cadastro.component';
import { LayoutHomeComponent } from './components/layout-home/layout-home.component';
import { PageRelatorioComponent } from '../page/components/page-relatorio/page-relatorio.component';
import { PagePerfilComponent } from '../page/components/page-perfil/page-perfil.component';
import { PageAjusteComponent } from '../page/components/page-ajuste/page-ajuste.component';
import { PageTagsComponent } from '../page/components/page-tags/page-tags.component';

const routes: Routes = [
  { path:'cadastro' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    canActivateChild:[AuthGuard],
    children:[
      {path : '' , component:PageCadastroComponent}
    ]
  },
  { path:'historico' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    children:[
      {path : '' , component: PageHistoricoComponent}
    ]
  },
  { path:'usuarios' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    canActivateChild:[AuthGuard],
    children:[
      {path : '' , component: PageUsuarioComponent}
    ]
  },
  { path:'relatorio' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    children:[
      {path : '' , component: PageRelatorioComponent}
    ]
  },
  { path:'ajuste' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    children:[
      {path : '' , component: PageAjusteComponent}
    ]
  },
  { path:'perfil' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    children:[
      {path : '' , component: PagePerfilComponent}
    ]
  },
  { path:'tags' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    canActivateChild:[AuthGuard],
    children:[
      {path : '' , component: PageTagsComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

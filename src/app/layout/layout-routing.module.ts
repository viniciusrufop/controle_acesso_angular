import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { PageUsuarioComponent } from './../page/components/page-usuario/page-usuario.component';
import { PageHistoricoComponent } from './../page/components/page-historico/page-historico.component';
import { PageCadastroComponent } from './../page/components/page-cadastro/page-cadastro.component';
import { LayoutHomeComponent } from './components/layout-home/layout-home.component';

const routes: Routes = [
  { path:'cadastro' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    /* canLoad: [AuthGuard], */
    children:[
      {path : '' , component:PageCadastroComponent}
    ]
  },
  { path:'historico' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    /* canLoad: [AuthGuard], */
    children:[
      {path : '' , component: PageHistoricoComponent}
    ]
  },
  { path:'usuarios' , component: LayoutHomeComponent,
    canActivate: [AuthGuard],
    /* canLoad: [AuthGuard], */
    children:[
      {path : '' , component: PageUsuarioComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

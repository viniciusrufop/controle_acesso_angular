import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutHomeComponent } from './components/layout-home/layout-home.component';
import { PageModule } from '../page/page.module';

@NgModule({
  declarations: [LayoutHomeComponent],
  imports: [
    SharedModule,
    CommonModule,
    LayoutRoutingModule,
    PageModule,
  ]
})
export class LayoutModule { }

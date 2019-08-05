import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { GridModule } from '@progress/kendo-angular-grid';

import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    GridModule,
    NgxMaskModule,
    MatCheckboxModule,
    MatSelectModule,
    ToastrModule,
    MatCardModule
  ]
})
export class SharedModule { }

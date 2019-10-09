import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** MATERIAL */
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
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';

/** KENDO */
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogsModule } from '@progress/kendo-angular-dialog'
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';

/** OUTROS */
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from 'ngx-clipboard';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PipesModule } from './../core/pipes/pipes.module';

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
    MatCardModule,
    SweetAlert2Module,
    FontAwesomeModule,
    DialogsModule,
    DateInputsModule,
    MatMenuModule,
    ClipboardModule,
    MatExpansionModule,
    PipesModule,
    UploadModule,
    MatDialogModule,
    ExcelExportModule
  ]
})
export class SharedModule { }

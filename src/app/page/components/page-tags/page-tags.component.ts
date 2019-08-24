import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AjusteService } from 'src/app/core/services/ajuste.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-page-tags',
  templateUrl: './page-tags.component.html',
  styleUrls: ['./page-tags.component.scss']
})
export class PageTagsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public showTagTable:boolean = false;

  /**
   * === CONFIG GRID TABLE
   */
  public tagsArray : any = [];
  public state: State = {
    skip: 0,
    take: 7,
  };
  public gridData: GridDataResult = process(this.tagsArray, this.state);
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.tagsArray, this.state);
  }
  /**
   * === END CONFIG GRID TABLE
   */

  constructor(
    private ajusteService: AjusteService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getTags();
  }

  getTags(){
    this.blockUI.start();
    let obj = this.getObjSolicitacao();
    this.ajusteService.getTags(obj).subscribe(res=>{
      this.tagsArray = res.result;
      this.gridData = process(this.tagsArray, this.state);
      this.showTagTable = true;
    },error=>{
      console.log(error)
      this.openSnackBar('Erro ao buscar dados.','OK');
      this.showTagTable = false;
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  getObjSolicitacao(){
    let email = localStorage.getItem('userEmail');
    let authToken = localStorage.getItem('authToken');
    return {
      email: email,
      authToken: authToken
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}

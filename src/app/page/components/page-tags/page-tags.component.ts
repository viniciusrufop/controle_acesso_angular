import { AuthService } from 'src/app/core/services/auth.service';
import { UserData } from './../../../core/interfaces/user-data';
import { StorageKeys } from './../../../core/interfaces/storage-keys';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AjusteService } from 'src/app/core/services/ajuste.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { faTrash, faRedo, faUnlink, faLink } from '@fortawesome/free-solid-svg-icons';
import { DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import { ModalVinculaTagComponent } from '../modal-vincula-tag/modal-vincula-tag.component';

@Component({
  selector: 'app-page-tags',
  templateUrl: './page-tags.component.html',
  styleUrls: ['./page-tags.component.scss']
})
export class PageTagsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public showTagTable:boolean = false;

  faTrash = faTrash;
  faRedo = faRedo;
  faUnlink = faUnlink;
  faLink = faLink;

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
  public userData: UserData;
  /**
   * === END CONFIG GRID TABLE
   */

  constructor(
    private ajusteService: AjusteService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.userData.subscribe(res => this.userData = res);
    this.getTags();
  }

  getTags(){
    this.blockUI.start();
    let obj = this.getObjSolicitacao();
    this.ajusteService.getTags(obj).subscribe(res=>{
      this.tagsArray = res.result;
      this.gridData = process(this.tagsArray, this.state);
      if(this.tagsArray.length > 0){
        this.showTagTable = true;  
      } else {
        this.openSnackBar('Nenhuma tag cadastrada.','OK');
        this.showTagTable = false;  
      }
    },error=>{
      console.log(error)
      this.openSnackBar('Erro ao buscar dados.','OK');
      this.showTagTable = false;
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  getObjSolicitacao(){
    let email = localStorage.getItem(StorageKeys.AUTH_USEREMAIL);
    let authToken = this.userData.auth;
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

  deleteTag(idTag){
    this.blockUI.start();
    let obj = Object.assign(this.getObjSolicitacao(),{id:idTag}) ;
    this.ajusteService.deleteTag(obj).subscribe(res=>{
      this.toastr.success('Tag deletada com sucesso!', 'Sucesso',{timeOut:3000});
    },error=>{
      console.log(error)
      this.toastr.error('Erro ao deletar tag.', 'Erro',{timeOut:3000});
    }).add(()=>{
      this.getTags();
      this.blockUI.stop();
    });
  }

  desvincularTag(idTag){
    this.blockUI.start();
    let obj = Object.assign(this.getObjSolicitacao(),{id:idTag}) ;
    this.ajusteService.desvincularTag(obj).subscribe(res=>{
      this.toastr.success('Tag desvinculada com sucesso!', 'Sucesso',{timeOut:3000});
    },error=>{
      console.log(error)
      this.toastr.error('Erro ao desvincular tag.', 'Erro',{timeOut:3000});
    }).add(()=>{
      this.getTags();
      this.blockUI.stop();
    });
  }

  vincularTag(idTag,tagValue){
    const dialogRef = this.dialogService.open({
      title: 'Vincular Tag',
      content: ModalVinculaTagComponent,
    });
    const userInfo = dialogRef.content.instance;
    userInfo.idTag = idTag;
    userInfo.tagValue = tagValue;
    
    dialogRef.result.subscribe((result) => {
      if (!(result instanceof DialogCloseResult)) {
        this.getTags();
      } 
    });
  }

}

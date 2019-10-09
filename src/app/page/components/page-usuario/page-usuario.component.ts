import { Component, OnInit } from '@angular/core';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { faTrash, faEdit, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DialogCloseResult } from '@progress/kendo-angular-dialog';

import { ModalUserEditComponent } from './../modal-user-edit/modal-user-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-page-usuario',
  templateUrl: './page-usuario.component.html',
  styleUrls: ['./page-usuario.component.scss']
})
export class PageUsuarioComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  faTrash = faTrash;
  faEdit = faEdit;
  faFileExcel = faFileExcel;

  public users : any = [];
  public allDataUser: Array<any> = [];

  constructor(
    private cadastroService : CadastroService,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers(){
    this.blockUI.start();
    this.cadastroService.getAllUsers().subscribe(res=>{
      this.users = res.userList;
    },error=>{
      console.log(error)
      this.openSnackBar('Problema ao buscar dados','OK');
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  deleteUser(idUser){
    let obj = {id : idUser };
    this.blockUI.start();
    this.cadastroService.deleteUser(obj).subscribe(res=>{
      this.getAllUsers();
      this.toastr.success('Usuário deletado com sucesso!', 'Sucesso',{timeOut:3000});
    },error=>{
      console.log(error)
      this.toastr.error('Erro ao deletar usuário!', 'Erro',{timeOut:3000});
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  editUser(idUser){
    const dialogRef = this.dialogService.open({
      title: 'Editar usuário',
      content: ModalUserEditComponent,
    });
    const userInfo = dialogRef.content.instance;
    userInfo.id = idUser;
    
    dialogRef.result.subscribe((result) => {
      if (!(result instanceof DialogCloseResult)) {
        this.getAllUsers();
      } 
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  exportarExcel(excelexport) {
    this.blockUI.start();
    this.cadastroService.getAllDatauser().subscribe(res=>{
      this.allDataUser = res.result.map(elem => { elem.senha = 9999; return elem; });
      setTimeout(() => excelexport.save(), 200 );
    },error=>{
      console.log(error)
      this.openSnackBar('Problema ao buscar dados','OK');
    }).add(()=>{
      this.blockUI.stop();
    });
    
  }

}
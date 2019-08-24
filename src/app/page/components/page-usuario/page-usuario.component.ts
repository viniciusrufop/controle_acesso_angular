import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
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

  public users : any = [];

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

}

@Pipe({name: 'phone'})
export class PhonePipe implements PipeTransform {
  transform(value: string): string {
    if(value)
      return `(${value.slice(0, 2)}) ${value.slice(2,7)}-${value.slice(7,11)}`;
  }
}
import { AuthService } from 'src/app/core/services/auth.service';
import { UserData } from './../../../core/interfaces/user-data';
import { StorageKeys } from './../../../core/interfaces/storage-keys';
import { Component, OnInit } from '@angular/core';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faEdit, faCopy, faKey } from '@fortawesome/free-solid-svg-icons';
import { DialogService, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { ModalUserEditComponent } from '../modal-user-edit/modal-user-edit.component';
import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component';

@Component({
  selector: 'app-page-perfil',
  templateUrl: './page-perfil.component.html',
  styleUrls: ['./page-perfil.component.scss']
})
export class PagePerfilComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  cadastroForm:FormGroup;

  faEdit = faEdit;
  faCopy = faCopy;
  faKey = faKey;

  private idUser:number;
  public tagList : any = [];
  public admin: boolean;
  public authToken;
  public userData: UserData;

  constructor(
    private cadastroService : CadastroService,
    private _snackBar: MatSnackBar,
    private formBuilder : FormBuilder,
    private dialogService: DialogService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.userData.subscribe(res => this.userData = res);
    this.authToken = this.userData.auth;
    this.admin = (this.userData.auth) ? true : false;
    this.getDataUser();
    this.createForm();
  }

  createForm(){
    this.cadastroForm = this.formBuilder.group({
      nome:[null,[Validators.required]],
      sobrenome:[null],
      email:[null,[Validators.required,Validators.email]],
      telefone:[null,],
      endereco:this.formBuilder.group({
        cep:[null,],
        logradouro:[null,],
        bairro:[null,],
        complemento:[null,],
        cidade:[null,],
        estado:[null,],
      }),
      login:[null,[Validators.required,Validators.minLength(4)]],
      ativo:[true,[Validators.required]],
      tag: [null],
      authToken : [this.authToken]
    })
  }

  getDataUser(){
    this.blockUI.start();
    let email = localStorage.getItem(StorageKeys.AUTH_USEREMAIL);
    let obj = { email : email}
    this.cadastroService.getDataUserByEmail(obj).subscribe(res=>{
      this.preencheForm(res.result.dataUser);
      this.idUser = res.result.dataUser.id;
      this.tagList = res.result.dataUser.tags;
    },error=>{
      console.log(error)
      this.openSnackBar('Problema ao buscar dados','OK');
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  preencheForm(dataUser){
    this.cadastroForm.patchValue({
      id: dataUser.id,
      nome: dataUser.nome,
      sobrenome: dataUser.sobrenome,
      email: dataUser.email,
      login: dataUser.login,
      telefone: dataUser.telefone,
      ativo: dataUser.ativo,
      tag: dataUser.tags,
      endereco:{
        cep : dataUser.cep,
        logradouro : dataUser.logradouro,
        bairro : dataUser.bairro,
        cidade : dataUser.cidade,
        estado : dataUser.estado,
        complemento : dataUser.complemento
      },
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  editUser(){
    let nameUser = this.cadastroForm.get('nome').value;
    if(nameUser){
      const dialogRef = this.dialogService.open({
        title: 'Editar usuário',
        content: ModalUserEditComponent,
      });
      const userInfo = dialogRef.content.instance;
      userInfo.id = this.idUser;
      
      dialogRef.result.subscribe((result) => {
        if (!(result instanceof DialogCloseResult)) {
          this.getDataUser();
        } 
      });
    } else {
      this.openSnackBar('Problema ao buscar dados','OK');
    }
  }

  changePassword() {
    const dialogRef = this.dialogService.open({
      title: 'Trocar Senha',
      content: ModalChangePasswordComponent,
    });
  }

}
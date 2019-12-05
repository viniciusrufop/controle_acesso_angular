import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { CadastroService } from './../../../core/services/cadastro.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { faSave, faDownload, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { config } from './../../../core/services/config';
import { UploadEvent } from '@progress/kendo-angular-upload';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-page-cadastro',
  templateUrl: './page-cadastro.component.html',
  styleUrls: ['./page-cadastro.component.scss']
})
export class PageCadastroComponent implements OnInit {

  public apiUploadFile: string = `${config.apiUrl}/api/importExcelUser`;

  @BlockUI() blockUI: NgBlockUI;
  estados:Observable <any>;
  cadastroForm:FormGroup;
  sub: Subscription;
  
  public validForm : boolean = true;
  public tagList: any = [];
  existUserEmail : boolean = false;
  existUserLogin : boolean = false;

  faSave = faSave;
  faDownload = faDownload;

  constructor(
    private formBuilder : FormBuilder,
    private cadastroService : CadastroService,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getEmptyTags();
    this.createForm();
    this.validateForm();
    this.estados = this.cadastroService.getEstadoBr();
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
      senha:[null,[Validators.required,Validators.minLength(4)]],
      ativo:[true,[Validators.required]],
      admin:[false],
      tag: [null],
    })
  }

  validateForm(){
    this.sub = this.cadastroForm.statusChanges.subscribe(res=>{
      this.validForm = (res === 'VALID') ? false : true;
    })
  }

  getEmailError() {
    return this.cadastroForm.get('email').hasError('required') ? 'Campo obrigatório' :
        this.cadastroForm.get('email').hasError('email') ? 'Não é um email válido' :
            '';
  }

  getRequiredError(campo){
    return this.cadastroForm.get(campo).hasError('required') ? 'Campo obrigatório' : '';
  }

  getLoginError(campo){
    return this.cadastroForm.get(campo).hasError('required') ? 'Campo obrigatório' :
      this.cadastroForm.get(campo).hasError('minlength') ? 'Mínimo de 4 caracteres' : 
      '';
  }

  consultaCEP(){
    let cep = this.cadastroForm.get('endereco.cep').value;
    if(cep !== "" && cep !=null && cep.length === 8){
      this.blockUI.start();
      this.cadastroService.consultaCEP(cep).subscribe(res=>{
        let dados = JSON.parse(res.dados);
        if (dados.hasOwnProperty('erro')) { this.openSnackBar('CEP não encontrado', 'OK'); }
        this.preencheCampoCEP(dados);
      },error=>{
        console.log(error)
      }).add(()=>{
        this.blockUI.stop();
      });
    }
  }

  preencheCampoCEP(dados){
    this.cadastroForm.patchValue({
      endereco:{
        logradouro : dados.logradouro,
        bairro : dados.bairro,
        cidade : dados.localidade,
        estado : dados.uf
      }
    })
  }

  onSubmit(){
    if(!this.validForm && !this.existUserEmail && !this.existUserLogin){
      let Obj = this.trataForm();
      this.blockUI.start();
      this.cadastroService.createUser(Obj).subscribe(res=>{
        this.cadastroForm.reset();
        this.cadastroForm.get('ativo').setValue(true);
        this.cadastroForm.get('admin').setValue(false);
        this.getEmptyTags();
        this.toastr.success('Usuário cadastrado com sucesso!', 'Sucesso',{timeOut:3000});
      },error=>{
        console.log(error)
        this.toastr.error('Erro ao cadastrar novo usuário.', 'Erro',{timeOut:3000});
      }).add(()=>{
        this.blockUI.stop();
      });
    } else {
      if(this.existUserEmail) this.openSnackBar('Email de usuário já existente','OK');
      else if(this.existUserLogin) this.openSnackBar('Login de usuário já existente','OK');
      else this.openSnackBar('Formulário Inválido','OK');
    }
  }

  trataForm(){
    let obj1 = this.cadastroForm.get('endereco').value;
    let obj2 = this.cadastroForm.value;
    delete obj2.endereco;
    let Obj = Object.assign(obj1,obj2);
    return Obj;
  }

  getEmptyTags(){
    this.blockUI.start();
    this.cadastroService.getEmptyTags().subscribe(res=>{
      this.tagList = res.tagList;
    },error=>{
      console.log(error)
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  getEmailUser(){
    // let email = this.cadastroForm.get('email').value;
    let email = this.cadastroForm.get('email');
    if(email.valid){
      this.blockUI.start();
      this.cadastroService.getEmailUser({email:email.value}).subscribe(res=>{
        this.existUserEmail = false;
      },error=>{
        if( error instanceof HttpErrorResponse){
          if(error.status === 400){
            this.toastr.warning('Email de usuário já cadastrado.', 'Atenção');
            this.existUserEmail = true;
          } else {
            console.log(error);
          }
        }
      }).add(()=>{
        this.blockUI.stop();
      });
    }
  }

  getLoginUser(){
    let login = this.cadastroForm.get('login');
    if(login.valid){
      this.blockUI.start();
      this.cadastroService.getLoginUser({login:login.value}).subscribe(res=>{
        this.existUserLogin = false;
      },error=>{
        if( error instanceof HttpErrorResponse){
          if(error.status === 400){
            this.toastr.warning('Login de usuário já cadastrado.', 'Atenção');
            this.existUserLogin = true;
          } else {
            console.log(error);
          }
        }
      }).add(()=>{
        this.blockUI.stop();
      });
    }
  }

  /** ===== UPLOAD ARQUIVO EXCEL ===== */
  successUpload(event) {
    this.blockUI.stop();
    // this.toastr.success('Dados salvos com sucesso!', 'Sucesso!', {disableTimeOut: false, timeOut: 3000});
    const result: Array<any> = event.response.body.Result;
    const nonInserted = result.filter(elem => elem.success === false);
    if (nonInserted.length === 0) {
      this.toastr.success('Dados salvos com sucesso!', 'Sucesso!', {disableTimeOut: false, timeOut: 3000});
    } else {
      const modal = this.dialog.open(PageCadastroComponentDialog, {
        width: '50%',
        data: result
      });
    }
  }

  errorUpload(event) {
    this.blockUI.stop();
    this.toastr.error(event.response.error.message || 'Erro ao inserir dados.' , 'Erro!', { disableTimeOut: false, timeOut: 3000 });
  }

  uploadEventHandler(e: UploadEvent) {
    this.blockUI.start();
    e.data = {
      description: 'File upload'
    };
  }

  downloadTamplateTabela() {
    window.open('./../../../../assets/tabelas/tabela_cadastro_usuario.xlsx');
  }
}

/** POPUP COM USUÁRIOS NÃO CADASTRADOS */

@Component({
  selector: 'app-page-cadastro-dialog',
  template: `
  <div mat-dialog-title>Erro ao inserir alguns usuários</div>

  <div mat-dialog-content class="mt-2">
  
    <div *ngFor="let item of data">

      <div *ngIf="!item.success" class="row vr-box-info error mt-1"  style="margin-left: 0;font-size: 14px;">
        <span style="font-size: 20px;align-self: center;"><fa-icon [icon]="faTimes" size="lg"></fa-icon></span>
        <div class="ml-2">
          <div style="font-weight: bold;">Erro: {{ item.message.errorInfo }} </div>
          <div>Usuário: {{ item.nome }} - {{ item.email }} </div>
        </div>
        
      </div>

      <div *ngIf="item.success" class="row vr-box-info success mt-1"  style="margin-left: 0;font-size: 14px;">
        <span style="font-size: 20px;align-self: center;"><fa-icon [icon]="faCheck" size="lg"></fa-icon></span>
        <div class="ml-2">
          <div style="font-weight: bold;">Sucesso!</div>
          <div>Usuário: {{ item.nome }} - {{ item.email }}</div>
        </div>
      </div>

    </div>

  </div>

  <div mat-dialog-actions class="mt-2">
    <button type="submit" class="mr-2 btn btn-sm btn-primary float-right" (click)="onNoClick()">
      Fechar
    </button>
  </div>
  `,
})
export class PageCadastroComponentDialog implements OnInit {

  faCheck = faCheck;
  faTimes = faTimes;

  constructor(
    public dialogRef: MatDialogRef<PageCadastroComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
      this.sortArrayByBooleanValue(this.data);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    sortArrayByBooleanValue(a) {
      return a.sort((a, b) => b.success - a.success );
    }
}
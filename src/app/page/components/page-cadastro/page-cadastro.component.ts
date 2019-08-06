import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { CadastroService } from './../../../core/services/cadastro.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-cadastro',
  templateUrl: './page-cadastro.component.html',
  styleUrls: ['./page-cadastro.component.scss']
})
export class PageCadastroComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  estados:Observable <any>;
  cadastroForm:FormGroup;
  sub: Subscription;
  
  public validForm : boolean = true;
  public tagList: any = [];
  existUserEmail : boolean = false;
  existUserLogin : boolean = false;

  faSave = faSave;

  constructor(
    private formBuilder : FormBuilder,
    private cadastroService : CadastroService,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar
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
    if(cep !== "" && cep !=null){
      this.blockUI.start();
      this.cadastroService.consultaCEP(cep).subscribe(res=>{
        let dados = JSON.parse(res.dados);
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
    let email = this.cadastroForm.get('email').value;
    
    this.blockUI.start();
    this.cadastroService.getEmailUser({email:email}).subscribe(res=>{
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

  getLoginUser(){
    let login = this.cadastroForm.get('login').value;

    this.blockUI.start();
    this.cadastroService.getLoginUser({login:login}).subscribe(res=>{
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

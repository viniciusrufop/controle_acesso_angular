import { AuthService } from 'src/app/core/services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { faWindowClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-user-edit',
  templateUrl: './modal-user-edit.component.html',
  styleUrls: ['./modal-user-edit.component.scss']
})
export class ModalUserEditComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @Input() public id: number;
  cadastroForm:FormGroup;
  estados:Observable <any>;
  sub: Subscription;

  public validForm : boolean = true;
  public tagList : any = [];
  public admin: boolean;
  faWindowClose = faWindowClose ;
  faSave = faSave;

  constructor(
    public dialog : DialogRef,
    private formBuilder : FormBuilder,
    private cadastroService : CadastroService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.isAdmin.subscribe(res => this.admin = res);

    this.createForm();
    this.getDataUser();
    this.validateForm();
    this.estados = this.cadastroService.getEstadoBr();
  }
  
  onClose(text){
    this.dialog.close({text: text})
  }

  validateForm(){
    this.sub = this.cadastroForm.statusChanges.subscribe(res=>{
      this.validForm = (res !== 'VALID');
    })
  }
  
  createForm(){
    this.cadastroForm = this.formBuilder.group({
      id:[null,[Validators.required]],
      nome:[null,[Validators.required]],
      sobrenome:[null],
      email:[null,[Validators.required,Validators.email]],
      telefone:[null],
      endereco:this.formBuilder.group({
        cep:[null],
        logradouro:[null],
        bairro:[null],
        complemento:[null],
        cidade:[null],
        estado:[null],
      }),
      login:[null,[Validators.required,Validators.minLength(4)]],
      ativo:[null,[Validators.required]],
      admin:[null,[Validators.required]],
      tag: [null],
    })
  }

  getDataUser(){
    this.blockUI.start();
    let obj = { id : this.id}
    this.cadastroService.getDataUser(obj).subscribe(res=>{
      this.preencheForm(res.result.dataUser);
      if(res.result.dataUser.tags) this.tagList = res.result.dataUser.tags;
    },error=>{
      console.log(error)
      this.openSnackBar('Problema ao buscar dados','OK');
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

  getRequiredError(campo){
    return this.cadastroForm.get(campo).hasError('required') ? 'Campo obrigatório' : '';
  }

  consultaCEP(){
    let cep = String(this.cadastroForm.get('endereco.cep').value);
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
        estado : dados.uf,
      }
    })
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
      admin: dataUser.admin,
      endereco:{
        cep : dataUser.cep,
        logradouro : dataUser.logradouro,
        bairro : dataUser.bairro,
        cidade : dataUser.cidade,
        estado : dataUser.estado,
        complemento : dataUser.complemento
      }
    })
  }

  trataForm(){
    let obj1 = this.cadastroForm.get('endereco').value;
    let obj2 = this.cadastroForm.value;
    delete obj2.endereco;
    let Obj = Object.assign(obj1,obj2);
    return Obj;
  }

  onSubmit(){
    if(!this.validForm){
      let Obj = this.trataForm();
      this.blockUI.start();
      this.cadastroService.updateUser(Obj).subscribe(res=>{
        this.toastr.success('Usuário atualizado com sucesso!', 'Sucesso',{timeOut:3000});
        this.onClose('Submit');
      },error=>{
        console.log(error)
        this.toastr.error('Erro ao atualizar usuário.', 'Erro',{timeOut:3000});
      }).add(()=>{
        this.blockUI.stop();
      });
    } else {
      this.openSnackBar('Formulário Inválido','OK');
    }
  }
 
}

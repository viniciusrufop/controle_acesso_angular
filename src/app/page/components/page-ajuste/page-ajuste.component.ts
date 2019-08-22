import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { faReply, faRedo, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { admin } from 'src/app/core/services/admin';

@Component({
  selector: 'app-page-ajuste',
  templateUrl: './page-ajuste.component.html',
  styleUrls: ['./page-ajuste.component.scss']
})
export class PageAjusteComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  ajusteForm:FormGroup;

  public maxDate : Date = new Date;
  public valueDateTime:Date;
  public admin = admin.value;
  public solicitacaoAjuste : any = [];
  public showTableAjuste : boolean = false;
  public showFormAjuste : boolean = false;
  private dataUserId = localStorage.getItem('dataUserId');

  faRedo = faRedo;
  faReply = faReply;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;

  constructor(
    private formBuilder : FormBuilder,
    private cadastroService : CadastroService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if(this.dataUserId != "null"){
      this.createForm();
      this.showFormAjuste = true;
    } else {
      this.showFormAjuste = false;
    }
    this.getAdjustmentRequest();
  }

  createForm(){
    this.ajusteForm = this.formBuilder.group({
      data_user_id:[null,[Validators.required]],
      data: [null,[Validators.required]],
      hora: [null,[Validators.required]],
      justificativa: [null,[Validators.required]],
    })
  }

  onSubmit(){
    if(this.trataForm()){
      console.log(this.ajusteForm.value);
      this.blockUI.start();
      let obj = this.ajusteForm.value;
      console.log(obj)
      this.cadastroService.adjustmentRequest(obj).subscribe(res=>{
        console.log(res);
        this.toastr.success('Solicitação de ajuste realizada!', 'Sucesso',{timeOut:3000});
        this.getAdjustmentRequest();
      },error=>{
        console.log(error)
        this.toastr.error('Erro de solicitação.', 'Erro',{timeOut:3000});
      }).add(()=>{
        this.blockUI.stop();
      });
    } else {
      this.openSnackBar('Formulario inválido.','OK');
    }
  }

  trataForm():boolean{
    let id = localStorage.getItem('dataUserId');
    this.ajusteForm.get('data_user_id').setValue(id);
    return (this.ajusteForm.status  === 'VALID' && id != "null")
  }

  getAdjustmentRequest(){
    this.blockUI.start();
    let email = localStorage.getItem('userEmail');
    let obj = {email : email};
    this.cadastroService.getAdjustmentRequest(obj).subscribe(res=>{
      this.solicitacaoAjuste = res.result;
      this.showTableAjuste = (this.solicitacaoAjuste.length > 0);
    },error=>{
      console.log(error)
      this.openSnackBar('Problema ao buscar dados','OK');
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  resetForm(){
    this.ajusteForm.reset();
  }

  getRequiredError(campo){
    return this.ajusteForm.get(campo).hasError('required') ? 'Campo obrigatório' : '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  confirmaSolicitacao(obj){
    if(admin){
      this.blockUI.start();
      this.cadastroService.acceptAdjustmentRequest(obj).subscribe(res=>{
        this.toastr.success('Solicitação atendida!', 'Sucesso',{timeOut:3000});
        this.getAdjustmentRequest();
      },error=>{
        console.log(error)
        this.toastr.success('Erro ao atender solicitação!', 'Sucesso',{timeOut:3000});
      }).add(()=>{
        this.blockUI.stop();
      });
    }
  }

  setObjSolicitacao(accept:boolean,id){
    let email = localStorage.getItem('userEmail');
    let authToken = localStorage.getItem('authToken');
    let obj = {
      email: email,
      authToken: authToken,
      id: id,
      accept: accept
    }
    this.confirmaSolicitacao(obj)
  }

  // recusarSolicitacao(){
  //   if(admin){
  //     console.log('recusarSolicitacao')
  //   }
  // }

}

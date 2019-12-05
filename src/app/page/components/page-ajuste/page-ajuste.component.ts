import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjusteService } from 'src/app/core/services/ajuste.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { faReply, faRedo, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { admin } from 'src/app/core/services/admin';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-page-ajuste',
  templateUrl: './page-ajuste.component.html',
  styleUrls: ['./page-ajuste.component.scss']
})
export class PageAjusteComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  ajusteForm:FormGroup;

  public maxDate: Date = new Date;
  public valueDateTime:Date;
  public admin = admin.value;
  public solicitacaoAjuste : any = [];
  public showTableAjuste : boolean = false;
  public showFormAjuste : boolean = false;
  public showHistoricoAjuste : boolean = false;
  private dataUserId = localStorage.getItem('dataUserId');

  faRedo = faRedo;
  faReply = faReply;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
 
  /** CONFIG GRID TABLE */
  public historicoAjuste : any = [];
  public state: State = {
    skip: 0,
    take: 7,
  };
  public gridData: GridDataResult = process(this.historicoAjuste, this.state);

  constructor(
    private formBuilder : FormBuilder,
    private ajusteService: AjusteService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    if(this.dataUserId != "null"){
      this.createForm();
      this.showFormAjuste = true;
    } else {
      this.showFormAjuste = false;
    }
    this.getAdjustmentRequest();
    this.getAdjustmentHistoryRequest();
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
    this.ajusteForm.markAllAsTouched()
    if(this.trataForm()){
      this.blockUI.start();
      let obj = this.ajusteForm.value;
      this.ajusteService.adjustmentRequest(obj).subscribe(res=>{
        this.ajusteForm.reset()
        this.toastr.success('Solicitação de ajuste enviada!', 'Sucesso',{timeOut:3000});
        this.getAdjustmentRequest();
      },error=>{
        console.log(error)
        this.toastr.error('Erro ao solicitar ajuste.', 'Erro',{timeOut:3000});
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
    this.ajusteService.getAdjustmentRequest(obj).subscribe(res=>{
      this.solicitacaoAjuste = res.result;
      this.showTableAjuste = (this.solicitacaoAjuste.length > 0);
    },error=>{
      console.log(error)
      this.openSnackBar('Problema ao buscar dados','OK');
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  getAdjustmentHistoryRequest(){
    this.blockUI.start();
    let email = localStorage.getItem('userEmail');
    let obj = {email : email};
    this.ajusteService.getAdjustmentHistoryRequest(obj).subscribe(res=>{
      this.historicoAjuste = res.result;
      if(this.historicoAjuste.length > 0){
        this.formatData(this.historicoAjuste)
        this.showHistoricoAjuste = true;
      } else {
        this.openSnackBar('Nenhum histórico encontrado','OK');
        this.showHistoricoAjuste = false;
      }
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
      this.ajusteService.acceptAdjustmentRequest(obj).subscribe(res=>{
        this.toastr.success('Solicitação atendida!', 'Sucesso',{timeOut:3000});
        this.getAdjustmentRequest();
        this.getAdjustmentHistoryRequest();
      },error=>{
        console.log(error)
        this.toastr.error('Erro ao atender solicitação!', 'Erro',{timeOut:3000});
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

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.historicoAjuste, this.state);
  }

  formatData(array){
    array.forEach(element => {
      element.data = new Date(element.data);
      element.diaDoPedido = new Date(element.diaDoPedido);
    });
    this.gridData = process(array, this.state);
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faWindowClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { AjusteService } from 'src/app/core/services/ajuste.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from 'src/app/core/services/cadastro.service';

@Component({
  selector: 'app-modal-vincula-tag',
  templateUrl: './modal-vincula-tag.component.html',
  styleUrls: ['./modal-vincula-tag.component.scss']
})
export class ModalVinculaTagComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @Input() public idTag: number;
  @Input() public tagValue: number;

  tagUpdateForm:FormGroup;
  public users:any = [];
  faWindowClose = faWindowClose ;
  faSave = faSave;
  
  constructor(
    public dialog : DialogRef,
    private formBuilder : FormBuilder,
    private ajusteService : AjusteService,
    private cadastroService : CadastroService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.createForm();
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

  createForm(){
    this.tagUpdateForm = this.formBuilder.group({
      idTag:[this.idTag,[Validators.required]],
      idUser:[null,[Validators.required]]
    })
  }

  onSubmit(){
    this.tagUpdateForm.markAllAsTouched();
    if(this.tagUpdateForm.status === 'VALID'){
      let obj = Object.assign(this.getObjSolicitacao(),this.tagUpdateForm.value);
      this.blockUI.start();
      this.ajusteService.vincularTag(obj).subscribe(res=>{
        this.toastr.success('Tag vinculada com sucesso!', 'Sucesso',{timeOut:3000});
        this.onClose('Submit');
      },error=>{
        console.log(error)
        this.toastr.error('Erro ao vincular tag.', 'Erro',{timeOut:3000});
      }).add(()=>{
        this.blockUI.stop();
      });
    } else {
      this.openSnackBar('Formulário inválido.','OK');
    }
      
  }

  getRequiredError(campo){
    return this.tagUpdateForm.get(campo).hasError('required') ? 'Campo obrigatório' : '';
  }

  onClose(text){
    this.dialog.close({text: text})
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
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

}

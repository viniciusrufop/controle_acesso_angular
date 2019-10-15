import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faWindowClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { CadastroService } from 'src/app/core/services/cadastro.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss']
})
export class ModalChangePasswordComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  changePassForm:FormGroup;

  faWindowClose = faWindowClose ;
  faSave = faSave;

  public validForm: boolean = true;
  public sub: Subscription;

  constructor(
    public dialog : DialogRef,
    private formBuilder : FormBuilder,
    private _snackBar: MatSnackBar,
    private cadastroService : CadastroService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.validateForm();
  }

  createForm(){
    this.changePassForm = this.formBuilder.group({
      newPass: [null, [Validators.required, Validators.minLength(6)]],
      newPass2: [null, [Validators.required, Validators.minLength(6)]],
    })
  }

  getPassError(campo){
    return this.changePassForm.get(campo).hasError('required') ? 'Campo obrigatório' :
        this.changePassForm.get(campo).hasError('minlength') ? 'Mínimo de 6 caracteres' : 
        '';
  }

  getForm(campo) {
    return this.changePassForm.get(campo);
  }

  onSubmit() {
    if (!this.validForm) {
      this.blockUI.start();
      let obj = { id : localStorage.getItem('dataUserId'), newPass: this.getForm('newPass').value };
      this.cadastroService.changePassword(obj).subscribe(res=>{
        this.toastr.success('Senha alterada com sucesso!', 'Sucesso', {timeOut: 3000});
        this.onClose();
      },error=>{
        this.toastr.error('Erro ao atualizar dados.' , 'Erro!', { disableTimeOut: false, timeOut: 3000 });
      }).add(()=>{
        this.blockUI.stop();
      });
    } else {
      this._snackBar.open('Formulário Inválido.', 'OK', { duration: 3000, verticalPosition: 'top' });
    }
  }

  validateForm(){
    this.sub = this.changePassForm.statusChanges.subscribe(res=>{
      this.validForm = !((res === 'VALID') && (this.getForm('newPass').value === this.getForm('newPass2').value));
    })
  }

  onClose() {
    this.dialog.close()
  }

}

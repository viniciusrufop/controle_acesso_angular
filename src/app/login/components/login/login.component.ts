import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  public validForm : boolean = true;
  public invalidLogin : boolean = false;

  loginForm:FormGroup;
  hide : boolean = true;
  sub: Subscription;
  
  constructor(
    private formBuilder : FormBuilder,
    private authService:AuthService,
    private _router:Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createForm();
    this.validateForm();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createForm(){
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required, Validators.email]],
      password:[null,[Validators.required,Validators.minLength(6)]],
    })
  }

  validateForm(){
    this.sub = this.loginForm.statusChanges.subscribe(res=>{
      this.validForm = (res === 'VALID') ? false : true;
    })
  }

  onSubmit(){

    if(this.loginForm.status !== 'VALID') { return this.openSnackBar('Formulário Inválido','OK'); }

    let obj = this.loginForm.value;

    this.blockUI.start();

    this.sub = this.authService.loginUser(obj).subscribe(res => {
      this._router.navigate(['/historico']);
    }, error =>{
      if( error instanceof HttpErrorResponse){
        if(error.status === 401){
          this.invalidLogin = true;
        } else if(error.status === 0){
          this.openSnackBar('Servidor Offline','OK');
        }
      }
    }).add(() => this.blockUI.stop());
  }

  getEmailError() {
    return this.loginForm.get('email').hasError('required') ? 'Campo obrigatório' :
        this.loginForm.get('email').hasError('email') ? 'Não é um email válido' :
            '';
  }
  
  getPassError(){
    return this.loginForm.get('password').hasError('required') ? 'Campo obrigatório' :
        this.loginForm.get('password').hasError('minlength') ? 'Mínimo de 6 caracteres' : 
        '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}

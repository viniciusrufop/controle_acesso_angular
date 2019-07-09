import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  public validForm : boolean = false;
  public invalidLogin : boolean = false;

  loginForm:FormGroup;
  hide : boolean = true;
  sub: Subscription;
  
  constructor(
    private formBuilder : FormBuilder,
    private authService:AuthService,
    private _router:Router
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
      email:['email1@gmail.com',[Validators.required, Validators.email]],
      password:['123451',[Validators.required,Validators.minLength(6)]],
    })
  }

  validateForm(){
    this.sub = this.loginForm.statusChanges.subscribe(res=>{
      if(res === 'VALID') this.validForm = false;
      else this.validForm = true;
    })
  }

  onSubmit(){
    if(this.loginForm.status === 'VALID'){
      this.sub = this.authService.loginUser(this.loginForm.value)
      .subscribe(res=>{
        localStorage.setItem('token',res.token);
        console.log(res.token)
        //this._router.navigate(['/historico']);
      }
      ,error=>{
        if( error instanceof HttpErrorResponse){
          if(error.status === 401){
            this.invalidLogin = true;
          }
        }
      })
      .add(()=>{
        console.log('add');
      })
    } else {
      console.log('invalid')
    }
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


}

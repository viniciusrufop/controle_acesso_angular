import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-cadastro',
  templateUrl: './page-cadastro.component.html',
  styleUrls: ['./page-cadastro.component.scss']
})
export class PageCadastroComponent implements OnInit {

  public validForm : boolean = true;
  
  cadastroForm:FormGroup;
  sub: Subscription;

  constructor(
    private formBuilder : FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
    this.validateForm();
  }

  createForm(){
    this.cadastroForm = this.formBuilder.group({
      nome:[null,[Validators.required]],
      sobrenome:[null,[Validators.required]],
      email:[null,[Validators.required,Validators.email]],
      telefone:[null,[Validators.required]],
      cep:[null,[Validators.required]],
      endereco:[null,[Validators.required]],
      bairro:[null,[Validators.required]],
      complemento:[null,[Validators.required]],
      cidade:[null,[Validators.required]],
      estado:[null,[Validators.required]],
      login:[null,[Validators.required,Validators.minLength(4)]],
      senha:[null,[Validators.required,Validators.minLength(4)]],
      situacao:[null,[Validators.required]],
    })
  }

  validateForm(){
    this.sub = this.cadastroForm.statusChanges.subscribe(res=>{
      //console.log(this.cadastroForm.controls['login'].value)
      //console.log(this.cadastroForm.controls['login'].status)
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

  getLoginError(){
    return this.cadastroForm.get('login').hasError('required') ? 'Campo obrigatório' :
      this.cadastroForm.get('login').hasError('minlength') ? 'Mínimo de 4 caracteres' : 
      '';
  }

}

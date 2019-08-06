import { Component, OnInit, Input } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-modal-user-edit',
  templateUrl: './modal-user-edit.component.html',
  styleUrls: ['./modal-user-edit.component.scss']
})
export class ModalUserEditComponent implements OnInit {

  @Input() public id: number;
  cadastroForm:FormGroup;

  constructor(
    public dialog : DialogRef,
    private formBuilder : FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.cadastroForm = this.formBuilder.group({
      nome:[null,[Validators.required]],
      sobrenome:[null],
      email:[null,[Validators.required,Validators.email]],
      telefone:[null,],
      endereco:this.formBuilder.group({
        cep:[null,],
        rua:[null,],
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

  onClose(){
    this.dialog.close()
  }
}

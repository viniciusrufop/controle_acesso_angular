import { AuthService } from 'src/app/core/services/auth.service';
import { UserData } from './../../../core/interfaces/user-data';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { faSearch, faReply } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-page-historico',
  templateUrl: './page-historico.component.html',
  styleUrls: ['./page-historico.component.scss']
})
export class PageHistoricoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  historicoForm:FormGroup;

  public users : any = [];
  public minDate : Date;
  public maxDate : Date;
  public arrayData: any = [];
  public showGrid : boolean = false;
  public admin: boolean;
  public userData: UserData;
  
  faSearch = faSearch;
  faReply = faReply;
  
  public state: State = {
    skip: 0,
    take: 7,
  };
  public gridData: GridDataResult = process(this.arrayData, this.state);

  constructor(
    private formBuilder : FormBuilder,
    private cadastroService : CadastroService,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.userData.subscribe(res => this.userData = res);
    this.admin = (this.userData.auth) ? true : false;
    this.createForm();
    this.getAllUsers();
    this.minDate = this.historicoForm.get('dataInicio').value;
  }

  getAllUsers(){
    if(this.admin){
      this.blockUI.start();
      this.cadastroService.getAllUsers().subscribe(res=>{
        this.users = res.userList;
      },error=>{
        console.log(error)
      }).add(()=>{
        this.blockUI.stop();
      });
    } else {
      let id = this.userData.dataUserId;
      if(id !== undefined){
        this.historicoForm.get('users').setValue([id]);
      }
    }
  }

  createForm(){
    this.historicoForm = this.formBuilder.group({
      dataInicio : [null],
      dataFim : [null],
      users : [null]
    })
  }

  onChangeMinDate(event){
    this.minDate = this.historicoForm.get('dataInicio').value;
  }

  onChangeMaxDate(event){
    this.maxDate = this.historicoForm.get('dataFim').value;
  }

  resetForm(){
    this.showGrid = false;
    this.historicoForm.reset();
    this.minDate = null;
    this.maxDate = null;
    if(!this.admin){
      let id = this.userData.dataUserId;
      this.historicoForm.get('users').setValue([id]);
    }
  }

  onSubmit(){
    if(this.validForm()){
      let obj = this.historicoForm.value;
      this.blockUI.start();
      this.cadastroService.getHistory(obj).subscribe(res=>{
        this.arrayData = res.result;
        this.formatHistory(this.arrayData);
      },error=>{
        this.openSnackBar('Problema ao buscar dados','OK');
        console.log(error)
      }).add(()=>{
        this.blockUI.stop();
      });
    } else {
      this.openSnackBar('Formulario inválido.','OK');
    }
  }

  validForm():boolean {
    let dataInicio = this.historicoForm.get('dataInicio').value;
    let dataFim = this.historicoForm.get('dataFim').value;
    let users = this.historicoForm.get('users').value;
    return (dataInicio === null && dataFim !== null && users === null) ? false : true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.arrayData, this.state);
  }

  formatHistory(array){
    let users = this.historicoForm.get('users').value;
    if(users){
      let newArray = [] ;
      for (let i = 0; i < array.length; i++) {
        array[i].forEach(element => {
          element.data = new Date(element.data);
          newArray.push(element);
        });    
      }
      this.arrayData = newArray.slice();
      this.gridData = process(this.arrayData, this.state);
    } else {
      array.forEach(element => {
        element.data = new Date(element.data);
      });
      this.gridData = process(array, this.state);
    }
    this.showGrid = true;
  }

}

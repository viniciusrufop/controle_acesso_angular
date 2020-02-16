import { AuthService } from './../../../core/services/auth.service';
import { UserData } from './../../../core/interfaces/user-data';
import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { faReply, faFileAlt, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { DrawOptions, drawDOM, Group, exportPDF } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

@Component({
  selector: 'app-page-relatorio',
  templateUrl: './page-relatorio.component.html',
  styleUrls: ['./page-relatorio.component.scss']
})
export class PageRelatorioComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('pdf',{static : false}) pdf : ElementRef;
  relatorioForm:FormGroup;

  public maxDate : Date = new Date();
  public users : any = [];
  public showRelatorio: boolean = false;
  public dataUser:any = [];
  public arrayData: any = [];
  public admin: boolean;
  public totalHorasMensal;
  public userData: UserData;

  faReply = faReply;
  faFileAlt = faFileAlt;
  faFileDownload = faFileDownload;

  options : DrawOptions = {paperSize:"A4"};

  constructor(
    private formBuilder : FormBuilder,
    private cadastroService : CadastroService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.userData.subscribe(res => this.userData = res);
    this.admin = (this.userData.auth) ? true : false;
    this.createForm();
    this.getAllUsers();
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
      let id = this.userData.dataUserId
      if(id !== undefined){
        this.relatorioForm.get('idUser').setValue(id);
      }
    }
  }

  createForm(){
    this.relatorioForm = this.formBuilder.group({
      mes : [null,[Validators.required]],
      idUser : [null,[Validators.required]]
    })
  }

  resetForm(){
    this.showRelatorio = false;
    this.relatorioForm.reset();
    this.arrayData = [];
  }

  validForm() {
    this.relatorioForm.markAllAsTouched()
    if(this.relatorioForm.status === 'VALID'){
      let mes = (this.relatorioForm.get('mes').value.getMonth())+1;
      let ano = this.relatorioForm.get('mes').value.getFullYear();
      let id = this.relatorioForm.get('idUser').value;
      let obj = {mes: mes,id: id , ano:ano}
      this.onSubmit(obj);
    } else {
      this.openSnackBar('Formulario inválido.','OK');
    }
  }

  onSubmit(obj){
    this.blockUI.start();
    this.cadastroService.getRelatorio(obj).subscribe(res=>{
      this.arrayData = [];
      let arrayRes = res.result;
      this.setArrayData(arrayRes)
      this.getDataUser();
      this.showRelatorio = true;
    },error=>{
      this.openSnackBar('Problema ao buscar dados','OK');
      console.log(error)
    }).add(()=>{
      this.blockUI.stop();
    });
  }

  setArrayData(arrayRes){
    let totalHoras = 0;
    Object.keys(arrayRes).forEach(element => {
      let value = arrayRes[element];
      if(value.length > 1){
        let arraySeconds : any = [];
        for (let i = 0; i < value.length; i++) {
          arraySeconds.push(this.hoursToSeconds(value[i]['hora']));
        }
        arraySeconds.sort((a,b) => {return a-b});
        let totalSeconds = 0;
        for (let i = 0; i < arraySeconds.length; i++) {
          if(i%2 != 0){
            let hora1Seconds = arraySeconds[i-1];
            let hora2Seconds = arraySeconds[i];
            totalSeconds += (hora2Seconds-hora1Seconds);
          }
        }
        let hora1 = this.secondsToHours(arraySeconds[0]);
        let hora2 = this.secondsToHours(arraySeconds[arraySeconds.length-1]);
        value[0]['hora'] = `${hora1} - ${hora2}`;
        value[0]['tempo'] = this.secondsToHours(totalSeconds);
        totalHoras += totalSeconds;
      } else {
        value[0]['data'] =  new Date(value[0]['data']);
        value[0]['tempo'] = '-';
      }
      this.arrayData.push(value[0]);
    });
    this.totalHorasMensal = this.secondsToHours(totalHoras)
  }

  hoursToSeconds(hora:string):number{
    let hSeconds = parseInt(hora.substr(0,2))*3600;
    let mSeconds = parseInt(hora.substr(3,2))*60;
    let sSeconds = parseInt(hora.substr(6,2));
    let total = hSeconds + mSeconds + sSeconds;
    return total;
  }

  secondsToHours(s:number) : string{
    function formatNumber(numero:number){
      return (numero <= 9) ? `0${numero}` : numero;
    }
    let hora = formatNumber(Math.trunc(s/3600));
    let minuto = formatNumber(Math.floor((s%3600)/60));
    let segundo = formatNumber((s%3600)%60);
    let formatado = hora+":"+minuto+":"+segundo;
    return formatado;
  }

  getDataUser(){
    this.blockUI.start();
    let obj = { id : this.relatorioForm.get('idUser').value}
    this.cadastroService.getDataUser(obj).subscribe(res=>{
      this.dataUser = res.result.dataUser;
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

  downloadPDF(element?: HTMLElement) {
    drawDOM(this.pdf.nativeElement, this.options).then((group: Group) => {
        return exportPDF(group);
    }).then((dataUri) => {
        let pdfName = this.pafName();
        saveAs(dataUri, pdfName);
    });
  } 

  pafName():string{
    let data = this.relatorioForm.get('mes').value;
    let mes = data.toLocaleString('default', { month: 'short' });;
    let ano = data.getFullYear();
    let id = this.relatorioForm.get('idUser').value;
    let obj = this.users.find(ele=>{
      if(ele.id === id) return ele
    })
    let nome = (obj.sobrenome) ? `${obj.nome}_${obj.sobrenome}` : obj.nome;
    return `Rochaut_${nome}_${mes}_${ano}`;
  }

  getRequiredError(campo){
    return this.relatorioForm.get(campo).hasError('required') ? 'Campo obrigatório' : '';
  }


}

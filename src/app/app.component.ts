import { Component } from '@angular/core';
import { CadastroService } from './core/services/cadastro.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { admin } from './core/services/admin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private cadastroService : CadastroService,
  ) { }

  ngOnInit(){
    this.getAdmin();
  }

  getAdmin(){
    this.blockUI.start();
    let email = localStorage.getItem('userEmail');
    let authToken = localStorage.getItem('authToken');
    let obj = { email : email , authToken : authToken}
    this.cadastroService.getAdmin(obj).subscribe(res=>{
      admin.value=true;
    },error=>{
      admin.value=false;
    }).add(()=>{
      this.blockUI.stop();
    });
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import {TooltipPosition} from '@angular/material/tooltip';
import { faAngleDown, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import { admin } from './../../../core/services/admin';

@Component({
  selector: 'app-layout-home',
  templateUrl: './layout-home.component.html',
  styleUrls: ['./layout-home.component.scss']
})
export class LayoutHomeComponent implements OnInit {

  @ViewChild('vrMenu',{static:false}) vrMenu : ElementRef;

  faAngleDown = faAngleDown;
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;

  positionLogout: TooltipPosition = 'left';
  showFiller = false;
  showMenu : boolean = false;
  titlePage : string;
  public admin = admin.value;
  public userName = localStorage.getItem('userName');

  constructor(
    private router:Router,
    private authService:AuthService,
  ) {}

  ngOnInit() {
    this.namePage(this.router.url);
  }

  menuToggle(){
    const clientWidth = this.vrMenu.nativeElement.clientWidth;
    this.vrMenu.nativeElement.style.width = clientWidth == 0 ? '230px' : '0';
  }

  onResize(event) {
    const innerWidth = event.target.innerWidth;
    this.vrMenu.nativeElement.style.width = innerWidth >= 618 ? '230px' : '0';
  }

  namePage(url:string){
    if(url == '/usuarios') this.titlePage = 'Usuários';
    else if(url == '/cadastro') this.titlePage = 'Cadastro';
    else if(url == '/historico') this.titlePage = 'Histórico';
    else if(url == '/relatorio') this.titlePage = 'Relatório';
    else if(url == '/perfil') this.titlePage = 'Perfil do Usuário';
    else if(url == '/ajuste') this.titlePage = 'Ajuste de Ponto';
    else if(url == '/tags') this.titlePage = 'Controle de Tags';
  }

  logout(){
    this.authService.logoutUser()
  }

}

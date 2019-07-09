import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-layout-home',
  templateUrl: './layout-home.component.html',
  styleUrls: ['./layout-home.component.scss']
})
export class LayoutHomeComponent implements OnInit {

  @ViewChild('vrMenu',{static:false}) vrMenu : ElementRef;

  positionLogout: TooltipPosition = 'left';
  showFiller = false;
  showMenu : boolean = false;
  titlePage : string;

  constructor(
    private router:Router,
    private authService:AuthService
  ) { }

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
  }

  logout(){
    this.authService.logoutUser()
  }

}

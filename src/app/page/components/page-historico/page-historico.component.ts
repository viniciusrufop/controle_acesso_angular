import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-page-historico',
  templateUrl: './page-historico.component.html',
  styleUrls: ['./page-historico.component.scss']
})
export class PageHistoricoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
  ) { }

  ngOnInit() {
  }
}

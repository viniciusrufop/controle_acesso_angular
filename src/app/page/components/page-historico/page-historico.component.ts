import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { sampleProducts } from './products';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

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
    sampleProducts.forEach(element => {
      element.FirstOrderedOn = new Date(element.FirstOrderedOn)
    });
  }


  public state: State = {
    skip: 0,
    take: 5,
  };

  public gridData: GridDataResult = process(sampleProducts, this.state);

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(sampleProducts, this.state);
  }
}

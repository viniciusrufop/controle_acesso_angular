import { AuthService } from './core/services/auth.service';
import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(){

    this.blockUI.start();

    this.authService.logged().subscribe(res => {
      // if (res.auth) { admin.value = true; }
    }).add(()=> this.blockUI.stop() );

  }
}

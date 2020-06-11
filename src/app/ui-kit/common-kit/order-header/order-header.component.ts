import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: [ './order-header.component.scss' ],
})
export class OrderHeaderComponent implements OnInit {

  @Input() backGroundColor: string;
  @Input() isClose: boolean;
  @Input() title: string;
  @Input() subTitle: string;
  @Input() close: string;
  @Input() backUrl: string;
  @Input() main: string;

  constructor(
    private navController: NavController,
  ) {
  }

  ngOnInit() {
  }

  async back() {
    await this.navController.pop();
  }

}

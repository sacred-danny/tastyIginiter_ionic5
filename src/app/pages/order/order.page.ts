import { Component, OnInit } from '@angular/core';
import { config } from '../../config/config';

import { CommonService } from '../../core/services/common.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: [ './order.page.scss' ],
})
export class OrderPage implements OnInit {
  serverConfig = config;

  constructor(
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.commonService.activeIcon(2);
  }

}

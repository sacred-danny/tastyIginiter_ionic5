import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: [ './tabs.page.scss' ],
})
export class TabsPage implements OnInit {

  constructor(
    private menuService: MenuService,
    private navController: NavController,
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
  }

  goOrder() {
    if (this.menuService.order.totalPrice > 0) {
      this.navController.navigateForward('your-order');
    } else {
      this.commonService.presentAlert('Warning', 'Please, add some menus before you checkout!');
    }
  }

}

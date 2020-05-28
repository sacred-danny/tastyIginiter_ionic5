import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  goOrder() {
    if (this.menuService.order.totalPrice > 0) {
      this.router.navigate([ 'your-order' ]);
      // this.navController.navigateForward('your-order');
    } else {
      this.commonService.presentAlert('Warning', 'Please, add some menus before you checkout!');
    }
  }

}

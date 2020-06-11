import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CommonService } from '../../core/services/common.service';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: [ './policy.page.scss' ],
})
export class PolicyPage implements OnInit {

  backGroundColor = environment.baseColors.burningOrange;
  content = '';

  constructor(
    private commonService: CommonService,
    private menuService: MenuService
  ) {
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const res = await this.menuService.getPolicy().toPromise();
      this.content = res.content;
    } catch (e) {
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      await loading.dismiss();
    }
  }

}

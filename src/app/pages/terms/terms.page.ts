import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../core/services/common.service';
import { MenuService } from '../../core/services/menu.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: [ './terms.page.scss' ],
})
export class TermsPage implements OnInit {

  backGroundColor = environment.baseColors.burningOrange;
  content = '';

  constructor(
    public commonService: CommonService,
    public menuService: MenuService
  ) {
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const res = await this.menuService.getTerms().toPromise();
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

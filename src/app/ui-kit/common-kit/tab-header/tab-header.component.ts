import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: [ './tab-header.component.scss' ],
})
export class TabHeaderComponent implements OnInit {

  @Input() backGroundColor: string;
  @Input() isLogo: boolean;
  @Input() backUrl: string;
  @Input() title: string;
  @Input() subTitle: string;
  @Input() logout: boolean;

  menuBlankImage = environment.menuBlankImage;

  constructor(
    private authService: AuthService,
    private navController: NavController
  ) {
  }

  ngOnInit() {
  }

  async back() {
    await this.navController.pop();
  }

}

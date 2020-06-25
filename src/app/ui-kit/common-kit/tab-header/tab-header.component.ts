import { Component, Input, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment.prod';

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
    public authService: AuthService,
    public navController: NavController,
    public platform: Platform
  ) {
  }

  ngOnInit() {
  }

  async back() {
    await this.navController.pop();
  }

}

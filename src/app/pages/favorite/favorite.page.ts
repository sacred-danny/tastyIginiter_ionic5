import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: [ './favorite.page.scss' ],
})
export class FavoritePage implements OnInit {
  backGroundColor = environment.baseColors.burningOrage;
  menuBlankImage = environment.menuBlankImage;

  constructor(
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.commonService.activeIcon(1);
  }
}

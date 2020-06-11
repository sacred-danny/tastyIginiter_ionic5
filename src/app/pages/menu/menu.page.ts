import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonService } from '../../core/services/common.service';
import { environment } from '../../../environments/environment';
import { Category, CategoryDetail, MenuDetail, Special } from '../../core/models/menu';
import { associateArrayToArray, keysToCamel } from '../../core/utils/dto.util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: [ './menu.page.scss' ],
})
export class MenuPage implements OnInit {

  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  @ViewChild('slideCategory') slideCategory: IonSlides;
  @ViewChild('refresherRef') refresherRef;

  backGroundColor = environment.baseColors.burningOrage;
  menuBlankImage = environment.menuBlankImage;

  specialSlideOpts = {
    coverFlowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    initialSlide: 0,
    spaceBetween: 20,
    onlyExternal: false,
    observer: true,
    observeParents: true,
    slidesPerView: 2,
  };
  categorySlideOpts = {
    initialSlide: 0,
    onlyExternal: false,
    observer: true,
    observeParents: true,
    slidesPerView: 2,
  };

  specials: Array<Special>;
  categories: Array<Category>;
  categoryDetails: Array<CategoryDetail>;

  scrolledIndex = 0;
  setScrolled = false;
  currentIndex = 0;
  categoryPositions: any;

  constructor(
    private menuService: MenuService,
    private commonService: CommonService,
    private authService: AuthService,
    private navController: NavController,
    private platform: Platform,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.setData();
    if (this.commonService.isInit) {
      await this.ionViewWillEnter();
    }
  }

  setData() {
    this.specials = associateArrayToArray(this.menuService.menu.specials);
    this.categories = associateArrayToArray(this.menuService.menu.categories);
    this.categoryDetails = associateArrayToArray(this.menuService.menu.categoryDetails);
    Object.keys(this.categoryDetails).forEach(i => {
      this.categoryDetails[i].menus = associateArrayToArray(this.categoryDetails[i].menus);
    });
  }

  async ionViewWillEnter() {
    this.commonService.activeIcon(0);
    this.categoryPositions = [];
    for (let i = 0; i < this.categoryDetails.length; i ++) {
      this.categoryPositions.push(document.getElementById('category_' + i).offsetTop - 20);
    }
  }

  doRefresh() {
    setTimeout(async () => {
      await this.menuService.getOrder();
      const payload = {
        user: this.authService.user
      };
      const res = await this.menuService.getMenu(payload).toPromise();
      this.menuService.menu = keysToCamel(res);
      this.setData();
      this.categoryPositions = [];
      for (let i = 0; i < this.categoryDetails.length; i ++) {
        this.categoryPositions.push(document.getElementById('category_' + i).offsetTop - 20);
      }
      this.refresherRef.complete();
    }, 10);
  }

  async getMenu(id) {
    this.scrolledIndex = id;
    const y = document.getElementById('category_' + id).offsetTop - 20;
    this.setScrolled = true;
    await this.myContent.scrollToPoint(0, y, 400);
    setTimeout(() => {
      this.setScrolled = false;
    }, 400);
  }

  async goDetail(menu: MenuDetail) {
    await this.router.navigate([ 'menu-detail/' + menu.menuId ]);
  }

  async logScrolling(event: any) {
    const detail: any = event.detail;
    const currentPos = detail.scrollTop;
    Object.keys(this.categoryPositions).forEach(i => {
      if (this.categoryPositions[i] - currentPos <= 5 && this.categoryPositions[i] - currentPos >= 0
        || currentPos - this.categoryPositions[i] >= 0 && currentPos - this.categoryPositions[i] <= 20) {
        this.currentIndex = Number(i);
      }
    });
    if (this.scrolledIndex !== this.currentIndex) {
      if (this.setScrolled === false) {
        this.scrolledIndex = this.currentIndex;
        await this.slideCategory.slideTo(this.scrolledIndex, 500);
      }
    }
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { config } from '../../config/config';
import { NavController, IonContent, IonSlides } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';
import { Category, CategoryDetail, Menu, MenuDetail, Special } from '../../core/models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: [ './menu.page.scss' ],
})
export class MenuPage implements OnInit {
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  @ViewChild('slideCategory') slideCategory: IonSlides;
  @ViewChild('refresherRef') refresherRef;
  backGroundColor = config.baseColors.burningOrage;
  menuBlankImage = config.menuBlankImage;
  specailSlideOpts = {
    coverflowEffect: {
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

  categoryPositions = [];

  specials: Array<Special>;
  categories: Array<Category>;
  categoryDetails: Array<CategoryDetail>;
  scrolledIndex = 0;
  setScrolled = false;
  currentIndex = 0;

  constructor(
    private menuService: MenuService,
    private commonService: CommonService,
    private navController: NavController,
    private platform: Platform,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.commonService.activeIcon(0);
    this.specials = new Array();
    this.categories = new Array();
    this.categoryDetails = new Array();
    // tslint:disable-next-line:forin
    for (const item in this.menuService.menu.specials) {
      this.specials.push(this.menuService.menu.specials[item]);
    }

    // tslint:disable-next-line:forin
    for (const item in this.menuService.menu.categories) {
      this.categories.push(this.menuService.menu.categories[item]);
    }

    // tslint:disable-next-line:forin
    for (const item in this.menuService.menu.categoryDetails) {
      const categoryDetail: CategoryDetail = this.menuService.menu.categoryDetails[item];
      const menus = [];
      // tslint:disable-next-line:forin
      for (const menu in categoryDetail.menus) {
        menus.push(categoryDetail.menus[menu]);
      }
      categoryDetail.menus = menus;
      this.categoryDetails.push(categoryDetail);
    }
  }

  ionViewWillEnter() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.categoryDetails.length; i ++) {
      this.categoryPositions.push(document.getElementById('category_' + i).offsetTop - 20);
    }
  }

  keys(obj) {
    return Object.keys(obj);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.refresherRef.complete();
    }, 10);
  }

  getMenu(id) {
    this.scrolledIndex = id;
    const y = document.getElementById('category_' + id).offsetTop - 20;
    this.setScrolled = true;
    this.myContent.scrollToPoint(0, y, 400);
    setTimeout(() => {
      this.setScrolled = false;
    }, 400);
  }

  goDetail(menu: MenuDetail) {
    // @ts-ignore
    // this.router.navigate([ 'menu-detail/' + menu.menuId ]);
    this.navController.navigateForward('menu-detail/' + menu.menuId);
  }

  logScrolling(event: any) {
    const detail: any = event.detail;
    const currentPos = detail.scrollTop;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.categoryPositions.length; i ++) {
      // tslint:disable-next-line:max-line-length
      if (this.categoryPositions[i] - currentPos <= 5 && this.categoryPositions[i] - currentPos >= 0 || currentPos - this.categoryPositions[i] >= 0 && currentPos - this.categoryPositions[i] <= 20) {
        this.currentIndex = i;
        break;
      }
    }
    if (this.scrolledIndex !== this.currentIndex) {
      if (this.setScrolled === false) {
        this.scrolledIndex = this.currentIndex;
        this.slideCategory.slideTo(this.scrolledIndex, 500).then(() => {
        });
      }
    }
  }
}

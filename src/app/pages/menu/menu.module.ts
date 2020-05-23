import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommonKitModule } from '../../ui-kit/common-kit/common-kit.module';
import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonKitModule,
    MenuPageRoutingModule
  ],
  declarations: [ MenuPage ]
})
export class MenuPageModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, NavParams } from '@ionic/angular';

import { MenuDeatilPageRoutingModule } from './menu-deatil-routing.module';

import { MenuDeatilPage } from './menu-deatil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuDeatilPageRoutingModule
  ],
  declarations: [ MenuDeatilPage ],
  providers: [ NavParams ]
})
export class MenuDeatilPageModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommonKitModule } from '../../ui-kit/common-kit/common-kit.module';

import { YourOrderPageRoutingModule } from './your-order-routing.module';

import { YourOrderPage } from './your-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonKitModule,
    YourOrderPageRoutingModule
  ],
  declarations: [ YourOrderPage ]
})
export class YourOrderPageModule {
}

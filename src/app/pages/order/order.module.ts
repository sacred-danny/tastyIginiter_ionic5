import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { CommonKitModule } from '../../ui-kit/common-kit/common-kit.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    CommonKitModule,
  ],
  declarations: [OrderPage]
})
export class OrderPageModule {}

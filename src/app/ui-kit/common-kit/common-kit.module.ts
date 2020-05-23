import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { TabHeaderComponent } from './tab-header/tab-header.component';
import { OrderHeaderComponent } from './order-header/order-header.component';

@NgModule({
  declarations: [
    AuthHeaderComponent,
    TabHeaderComponent,
    OrderHeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [
    AuthHeaderComponent,
    TabHeaderComponent,
    OrderHeaderComponent
  ]
})
export class CommonKitModule {
}

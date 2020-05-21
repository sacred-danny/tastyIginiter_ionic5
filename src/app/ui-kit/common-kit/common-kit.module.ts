import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { TabHeaderComponent } from './tab-header/tab-header.component';


@NgModule({
  declarations: [
    AuthHeaderComponent,
    TabHeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [
    AuthHeaderComponent,
    TabHeaderComponent
  ]
})
export class CommonKitModule {
}

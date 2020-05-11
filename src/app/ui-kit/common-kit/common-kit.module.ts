import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AuthHeaderComponent } from './auth-header/auth-header.component';


@NgModule({
  declarations: [ AuthHeaderComponent ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [
    AuthHeaderComponent
  ]
})
export class CommonKitModule {
}

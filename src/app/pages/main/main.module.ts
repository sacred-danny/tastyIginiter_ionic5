import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { TabsComponent } from './tabs/tabs.component';
import { MainPage } from './main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule
  ],
  declarations: [ MainPage, TabsComponent ],
  exports: [ TabsComponent ]
})
export class MainPageModule {
}

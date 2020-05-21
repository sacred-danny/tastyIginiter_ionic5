import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuDeatilPage } from './menu-deatil.page';

const routes: Routes = [
  {
    path: '',
    component: MenuDeatilPage
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class MenuDeatilPageRoutingModule {
}

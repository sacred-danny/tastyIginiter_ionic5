import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SetAddressPage } from './set-address.page';

const routes: Routes = [
  {
    path: '',
    component: SetAddressPage
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class SetAddressPageRoutingModule {
}

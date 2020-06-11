import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SetLocationPage } from './set-location.page';

const routes: Routes = [
  {
    path: '',
    component: SetLocationPage
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class SetLocationPageRoutingModule {
}

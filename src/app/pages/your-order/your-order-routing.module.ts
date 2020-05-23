import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourOrderPage } from './your-order.page';

const routes: Routes = [
  {
    path: '',
    component: YourOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourOrderPageRoutingModule {}

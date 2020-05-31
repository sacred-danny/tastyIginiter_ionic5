import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripeJavascriptPage } from './stripe-javascript.page';

const routes: Routes = [
  {
    path: '',
    component: StripeJavascriptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripeJavascriptPageRoutingModule {}

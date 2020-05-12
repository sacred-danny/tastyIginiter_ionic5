import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';

import { SetLocationRequest } from '../../../core/models/auth';
import { config } from '../../../config/config';
import { error } from 'util';
import { elementSelectors } from '@angular/material/schematics/ng-update/data';


@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.page.html',
  styleUrls: [ './set-location.page.scss' ],
})
export class SetLocationPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    houseNumber: [ '', Validators.compose([ Validators.required ]) ],
    postCode: [ '', Validators.compose([ Validators.required ]) ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  async setLocation() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload: SetLocationRequest = {
        userId: this.authService.user.id,
        token: this.authService.token,
        postCode: this.form.value.postCode,
        houseNumber: this.form.value.houseNumber
      };
      await this.authService.setLocation(payload);
      await this.router.navigate([ '/main' ], { replaceUrl: true });
    } catch (e) {
      console.log(e);
      if (e.status === 500) {
        console.log(e.error.message);
        if (e.error.message.indexOf('please enter a valid address/postcode') >= 0) {
          await this.commonService.presentAlert('Warning', e.error.message);
        } else {
          await this.commonService.presentAlert('Warning', 'Internal Server Error');
        }
        return;
      }
      if (e.url.indexOf('https://api.getaddress.io/find') >= 0) {
        this.commonService.presentAlert('Warning', 'Your House Name/ Number or Postcode is incorrect, please try again.');
        return;
      }
      if (e.error.message.indexOf('expired') >= 0) {
        await this.commonService.presentAlert('Warning', e.error.message);
        await this.router.navigate([ '/login' ], { replaceUrl: true });
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    } finally {
      await loading.dismiss();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';

import { PrepareLocationRequest } from '../../../core/models/auth';
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
    houseName: [ '', Validators.compose([ Validators.required ]) ],
    postcode: [ '', Validators.compose([ Validators.required ]) ],
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
      const payload: PrepareLocationRequest = {
        postcode: this.form.value.postcode,
        houseName: this.form.value.houseName
      };
      await this.authService.setLocation(payload);
      await this.router.navigate([ '' ], { replaceUrl: true });
    } catch (e) {
      console.log(e);
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

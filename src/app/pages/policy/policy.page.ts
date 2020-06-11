import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: [ './policy.page.scss' ],
})
export class PolicyPage implements OnInit {

  backGroundColor = environment.baseColors.burningOrage;

  constructor() {
  }

  ngOnInit() {
  }

}

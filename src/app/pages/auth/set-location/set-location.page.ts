import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.page.html',
  styleUrls: ['./set-location.page.scss'],
})
export class SetLocationPage implements OnInit {

  constructor(
    public navController: NavController
  ) { }

  ngOnInit() {
  }

  async back() {
    await this.navController.pop();
  }

}

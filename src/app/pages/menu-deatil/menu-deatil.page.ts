import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu-deatil',
  templateUrl: './menu-deatil.page.html',
  styleUrls: [ './menu-deatil.page.scss' ],
})
export class MenuDeatilPage implements OnInit {

  constructor(
    private navController: NavController
  ) {
  }

  ngOnInit() {
  }

}

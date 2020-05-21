import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: [ './tab-header.component.scss' ],
})
export class TabHeaderComponent implements OnInit {
  @Input() backGroundColor: string;
  @Input() isLogo: boolean;
  @Input() title: string;

  constructor() {
  }

  ngOnInit() {
  }

}

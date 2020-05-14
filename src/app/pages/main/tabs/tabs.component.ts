import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input() showTabs: boolean;
  constructor() { }

  ngOnInit() {}

}

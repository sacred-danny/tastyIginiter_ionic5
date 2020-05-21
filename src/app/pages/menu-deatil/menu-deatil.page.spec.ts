import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuDeatilPage } from './menu-deatil.page';

describe('MenuDeatilPage', () => {
  let component: MenuDeatilPage;
  let fixture: ComponentFixture<MenuDeatilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDeatilPage ],
      imports: [ IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuDeatilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

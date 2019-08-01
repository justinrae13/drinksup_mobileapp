import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLogoutPage } from './admin-logout.page';

describe('AdminLogoutPage', () => {
  let component: AdminLogoutPage;
  let fixture: ComponentFixture<AdminLogoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLogoutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

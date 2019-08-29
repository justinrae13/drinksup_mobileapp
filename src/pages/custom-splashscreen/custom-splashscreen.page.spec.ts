import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSplashscreenPage } from './custom-splashscreen.page';

describe('CustomSplashscreenPage', () => {
  let component: CustomSplashscreenPage;
  let fixture: ComponentFixture<CustomSplashscreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSplashscreenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSplashscreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

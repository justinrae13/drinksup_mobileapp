import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalToSharePage } from './modal-to-share.page';

describe('ModalToSharePage', () => {
  let component: ModalToSharePage;
  let fixture: ComponentFixture<ModalToSharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalToSharePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalToSharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

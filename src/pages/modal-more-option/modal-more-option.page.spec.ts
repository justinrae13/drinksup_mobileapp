import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMoreOptionPage } from './modal-more-option.page';

describe('ModalMoreOptionPage', () => {
  let component: ModalMoreOptionPage;
  let fixture: ComponentFixture<ModalMoreOptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMoreOptionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMoreOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

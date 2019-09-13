import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalToSponsorPage } from './modal-to-sponsor.page';

describe('ModalToSponsorPage', () => {
  let component: ModalToSponsorPage;
  let fixture: ComponentFixture<ModalToSponsorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalToSponsorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalToSponsorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

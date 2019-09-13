import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGetSponsoredPage } from './modal-get-sponsored.page';

describe('ModalGetSponsoredPage', () => {
  let component: ModalGetSponsoredPage;
  let fixture: ComponentFixture<ModalGetSponsoredPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGetSponsoredPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGetSponsoredPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

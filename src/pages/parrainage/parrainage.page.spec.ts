import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParrainagePage } from './parrainage.page';

describe('ParrainagePage', () => {
  let component: ParrainagePage;
  let fixture: ComponentFixture<ParrainagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParrainagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParrainagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

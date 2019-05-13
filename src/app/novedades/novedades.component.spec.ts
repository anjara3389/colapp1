import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesComponent } from './novedades.component';

describe('NovedadesComponent', () => {
  let component: NovedadesComponent;
  let fixture: ComponentFixture<NovedadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

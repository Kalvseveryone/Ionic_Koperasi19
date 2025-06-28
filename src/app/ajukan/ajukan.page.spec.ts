import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjukanPage } from './ajukan.page';

describe('AjukanPage', () => {
  let component: AjukanPage;
  let fixture: ComponentFixture<AjukanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AjukanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

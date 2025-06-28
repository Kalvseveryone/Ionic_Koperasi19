import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PinjamanPage } from './pinjaman.page';

describe('PinjamanPage', () => {
  let component: PinjamanPage;
  let fixture: ComponentFixture<PinjamanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PinjamanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

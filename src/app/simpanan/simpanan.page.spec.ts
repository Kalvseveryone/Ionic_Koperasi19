import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpananPage } from './simpanan.page';

describe('SimpananPage', () => {
  let component: SimpananPage;
  let fixture: ComponentFixture<SimpananPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpananPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

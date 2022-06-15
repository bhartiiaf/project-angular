import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotLinksComponent } from './hot-links.component';

describe('HotLinksComponent', () => {
  let component: HotLinksComponent;
  let fixture: ComponentFixture<HotLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

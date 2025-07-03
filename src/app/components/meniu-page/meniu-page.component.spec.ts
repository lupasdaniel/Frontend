import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeniuPageComponent } from './meniu-page.component';

describe('MeniuPageComponent', () => {
  let component: MeniuPageComponent;
  let fixture: ComponentFixture<MeniuPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeniuPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeniuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

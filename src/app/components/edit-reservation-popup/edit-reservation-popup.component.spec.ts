import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReservationPopupComponent } from './edit-reservation-popup.component';

describe('EditReservationPopupComponent', () => {
  let component: EditReservationPopupComponent;
  let fixture: ComponentFixture<EditReservationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReservationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReservationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

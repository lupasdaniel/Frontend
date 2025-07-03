import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationDto } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ReservationFilter } from '../../filters/reservations-filters.model';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    DatePickerModule 
  ],
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss']
})
export class ReservationsListComponent implements OnInit {
  reservations: ReservationDto[] = [];
  public filters: ReservationFilter = new ReservationFilter();

  reservationToCancelId: string | null = null;
  showConfirm: boolean = false;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservations(this.filters).subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
      }
    });
  }

  resetFilters(): void{
    this.filters = new ReservationFilter();
    this.loadReservations();
  }

  applyFilters(): void {
    const dateObj = this.filters.date as any;
    if (dateObj instanceof Date) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      this.filters.date = `${year}-${month}-${day}`;
    }

    const timeObj = this.filters.time as any;
    if (timeObj instanceof Date) {
    const h = String(timeObj.getHours()).padStart(2, '0');
    const min = String(timeObj.getMinutes()).padStart(2, '0');
    this.filters.time = `${h}:${min}`;
    }

    this.loadReservations();
  }

  cancelReservation(id: string): void {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => this.loadReservations(),
    });
  }

  openConfirmDialog(reservationId: string) {
    this.reservationToCancelId = reservationId;
    this.showConfirm = true;
  }

  closeConfirmDialog() {
    this.showConfirm = false;
    this.reservationToCancelId = null;
  }

  confirmCancel() {
    if (this.reservationToCancelId) {
      this.cancelReservation(this.reservationToCancelId);
    }
    this.closeConfirmDialog();
  }
}

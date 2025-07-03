import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ReservationService } from '../../services/reservation.service';
import { ReservationDto } from '../../models/reservation.model';
import { AddReservationCommand } from '../../commands/reservation-commands.model';
import { FormsModule } from '@angular/forms';
import { TableDto } from '../../models/table.model';

@Component({
  selector: 'app-reservation-popup',
  standalone: true,
  imports: [DialogModule, ButtonModule, DropdownModule, FormsModule],
  templateUrl: './edit-reservation-popup.component.html',
  styleUrls: ['./edit-reservation-popup.component.scss']
})
export class EditReservationPopupComponent {
  constructor(private reservationService: ReservationService) {}

  @Input() table!: TableDto;
  @Input() userId: any;
  @Output() close = new EventEmitter<void>();
  @Output() reserve = new EventEmitter<any>();
  @Input() reservationDate: any;
  @Input() reservationHour: any;
  visible: boolean = true;

  public reservation: ReservationDto = new ReservationDto();

  nrOfPersonsOptions: { label: string; value: number }[] = [];
  nrOfPersons: number | null = null;

  duration: string = '02:00:00';

  ngOnChanges(): void {
    if (this.table && this.table.personsNr) {
      this.nrOfPersonsOptions = [];
      for (let i = 1; i <= this.table.personsNr; i++) {
        this.nrOfPersonsOptions.push({ label: i.toString(), value: i });
      }
      this.nrOfPersons = this.nrOfPersonsOptions.length > 0 ? this.nrOfPersonsOptions[0].value : null;
    } else {
      this.nrOfPersonsOptions = [];
      this.nrOfPersons = null;
    }
  }

  onCancel() {
    this.visible = false;
    this.close.emit();
  }

  onReserve() {
    if (!this.nrOfPersons) return;

    const command = {
      reservation: {
        clientID: this.userId,
        tableID: this.table.id,
        roomID: this.table.roomID,
        date: this.formatDate(this.reservationDate),
        startTime: this.formatTime(this.reservationHour),
        duration: this.duration,
        nrOfPersons: this.nrOfPersons,
      } as ReservationDto
    } as AddReservationCommand;

    this.reservationService.addReservation(command).subscribe({
      next: (res) => {
        this.reserve.emit(this.table);
        this.visible = false;
        this.close.emit();
      },
    });
  }

  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}:00`;
  }
}


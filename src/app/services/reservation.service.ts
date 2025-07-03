import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import { ReservationDto } from '../models/reservation.model';
import { AddReservationCommand, UpdateReservationCommand } from '../commands/reservation-commands.model';
import { ReservationFilter } from '../filters/reservations-filters.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/Reservation`;

  constructor(private http: HttpClient) {}

  getReservations(filters?: ReservationFilter): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(this.apiUrl, {
      params: {
        'filters.date': filters?.date ?? '',
        'filters.time': filters?.time ?? '',
        'filters.roomName': filters?.roomName ?? ''
      }
    });
  }

  private formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    return date.toString();
  }


  public isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
  }

  getUserReservations(userId: string): Observable<ReservationDto[]> {
    let params = new HttpParams().set('UserId', userId);
    return this.http.get<ReservationDto[]>(`${this.apiUrl}/user`, { params });
  }

  getReservationById(id: string): Observable<ReservationDto> {
    return this.http.get<ReservationDto>(`${this.apiUrl}/${id}`);
  }

  addReservation(command: AddReservationCommand): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, command);;
  }

  updateReservation(command: UpdateReservationCommand): Observable<void> {
    return this.http.put<void>(this.apiUrl, command);
  }

  deleteReservation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

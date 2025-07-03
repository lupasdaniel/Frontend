import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { RoomDto } from '../models/room.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/Room`;

  constructor(private http: HttpClient) {}

  getRoomByName(name: string): Observable<RoomDto> {
    return this.http.get<RoomDto>(`${this.apiUrl}/${name}`);
  }
  
  createRoom(room: { name: string }): Observable<RoomDto> {
    return this.http.post<RoomDto>(this.apiUrl, room);
  }
    
  getRoomNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/names`);
  }
}
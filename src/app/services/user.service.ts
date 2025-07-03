import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUserCommand, UpdateUserCommand } from '../commands/user-commands.model';
import { UserDto } from '../models/user.model';
import { environment } from '../environment';
import { UserFilters } from '../filters/user-filters.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  getUsers(filters?: UserFilters): Observable<UserDto[]> {
   return this.http.get<UserDto[]>(this.apiUrl, {
          params: {
            'filters.userName': filters?.userName ?? '',
            'filters.email': filters?.email ?? '',
            'filters.isActiv': filters?.isActiv?.toString() ?? '',
            'filters.role': filters?.role ?? ''
          }
    })

  }

  getUserById(id: string): Observable<UserDto> {
        return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  addUser(command: AddUserCommand): Observable<void> {
     return this.http.post<void>(this.apiUrl, command);
  }

  updateUser(command: UpdateUserCommand): Observable<void> {
    return this.http.put<void>(this.apiUrl, command);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

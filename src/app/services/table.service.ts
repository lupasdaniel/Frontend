import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import { TableDto } from '../models/table.model';
import { AddTableCommand, UpdateTableCommand, UpdateTablesCommand } from '../commands/table-commands.model';
import { GetTablesQuery } from '../queries/table-queries.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl = `${environment.apiUrl}/Table`;

  constructor(private http: HttpClient) {}

  getTables(query: GetTablesQuery): Observable<TableDto[]> {
    return this.http.get<TableDto[]>(this.apiUrl, {
      params: {
        roomId: query.roomId,
        date: query.date,
        time: query.time
      }
    });
  }

  getTableById(id: string): Observable<TableDto> {
    return this.http.get<TableDto>(`${this.apiUrl}/${id}`);
  }

  addTable(command: AddTableCommand): Observable<void> {
    return this.http.post<void>(this.apiUrl, command);
  }

  updateTable(command: UpdateTableCommand): Observable<void> {
    return this.http.put<void>(this.apiUrl, command);
  }

  deleteTable(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTables(command: UpdateTablesCommand): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tables`, command);
  }
  
  detectTablesFromImage(formData: FormData): Observable<TableDto[]> {
    return this.http.post<TableDto[]>(`${this.apiUrl}/detect`, formData);
  }

}

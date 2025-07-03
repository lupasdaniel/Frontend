import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import { FoodDto } from '../models/food.model';
import { FoodFilters } from '../filters/food-filters.model';
import { AddFoodCommand, UpdateFoodCommand } from '../commands/food-commands.model';
import { FoodCategoryType } from '../models/food-category-type.model';
import { AllergenDto } from '../models/allergen.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = `${environment.apiUrl}/Food`;

  constructor(private http: HttpClient) {}

  getFood(filters: FoodFilters): Observable<FoodDto[]> {
    return this.http.get<FoodDto[]>(this.apiUrl, {
      params: {
        categoryId: filters.categoryId,
        allergernIds: filters.allergernIds,
      }
    });
  }

  getCategories(): Observable<FoodCategoryType[]>{
    return this.http.get<FoodCategoryType[]>(`${this.apiUrl}/categories`);
  }

  getAllergens(): Observable<AllergenDto[]>{
    return this.http.get<AllergenDto[]>(`${this.apiUrl}/allergens`);
  }

  getFoodById(id: string): Observable<FoodDto> {
    return this.http.get<FoodDto>(`${this.apiUrl}/${id}`);
  }

  addFood(command: AddFoodCommand): Observable<void> {
    return this.http.post<void>(this.apiUrl, command);
  }

  updateFood(command: UpdateFoodCommand): Observable<void> {
    return this.http.put<void>(this.apiUrl, command);
  }

  deleteFood(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

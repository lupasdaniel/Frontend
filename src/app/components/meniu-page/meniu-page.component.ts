import { Component } from '@angular/core';
import { FoodDto } from '../../models/food.model';
import { AllergenDto } from '../../models/allergen.model';
import { FoodCategoryType } from '../../models/food-category-type.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { FoodService } from '../../services/food.service';
import { FoodFilters } from '../../filters/food-filters.model';

@Component({
  selector: 'app-meniu-page',
  imports: [    CommonModule,
    FormsModule,
    MultiSelectModule,
    CardModule,
    TooltipModule,
    TagModule,
    PanelModule 
  ],
  templateUrl: './meniu-page.component.html',
  styleUrl: './meniu-page.component.scss',
  standalone: true
})
export class MeniuPageComponent {
  foods: FoodDto[] = [];
  categories: FoodCategoryType[] = [];
  allergens: AllergenDto[] = [];
  public filters: FoodFilters = new FoodFilters();

  selectedCategories: FoodCategoryType[] = [];
  selectedAllergens: AllergenDto[] = [];

  constructor(private foodService: FoodService) {}

  get categoryOptions() {
    return this.categories;
  }

  get allergenOptions() {
    return this.allergens;
  }

  ngOnInit() {
    this.loadFoods();
    this.loadCategories();
    this.loadAllergens();
  }

  public loadFoods(): void{
    this.foodService.getFood(this.filters).subscribe({
      next: (data) => {
        this.foods = data;
      },
      error: (err) => {
      }
    });
  }

  public loadCategories(): void{
    this.foodService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
      }
    });
  }

  public loadAllergens(): void{
    this.foodService.getAllergens().subscribe({
      next: (data) => {
        this.allergens = data;
      },
      error: (err) => {
      }
    });
  }

  get filteredCategories(): FoodCategoryType[] {
    if (!this.selectedCategories.length) return this.categories;
    return this.categories.filter(c => this.selectedCategories.some(s => s.id === c.id));
  }

  filteredFoodsByCategory(categoryId: number): FoodDto[] {
    return this.foods
      .filter(f => f.categoryID === categoryId)
      .filter(f => {
        if (!this.selectedAllergens.length) return true;
        return !f.foodAllergens.some(af =>
          this.selectedAllergens.some(a => a.id === af.allergen.id));
      });
  }

  getAllergenIcon(allergenName: string): string {
    const icons: Record<string, string> = {
      Gluten: 'pi pi-bread',
      Peanuts: 'pi pi-circle-fill',
      Milk: 'pi pi-cow',
      Eggs: 'pi pi-egg',
      Fish: 'pi pi-fish',
      Shellfish: 'pi pi-water',
      Soy: 'pi pi-leaf',
      Nuts: 'pi pi-bolt',
      Celery: 'pi pi-tree',
      Mustard: 'pi pi-sliders-h',
      Sesame: 'pi pi-star',
      Sulfites: 'pi pi-times-circle',
      Lupin: 'pi pi-sun',
      Molluscs: 'pi pi-apple'
    };
    return icons[allergenName] || 'pi pi-question-circle';
  }
}

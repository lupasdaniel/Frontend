import { FoodDto } from "../models/food.model";

export interface AddFoodCommand {
  food: FoodDto;
}

export interface UpdateFoodCommand {
  food: FoodDto;
}
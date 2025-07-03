import { TableDto } from "./table.model";

export class RoomDto {
  id!: string;
  name!: string;
  typeId!: number;
  type!: string;
  tables!: TableDto[];
}

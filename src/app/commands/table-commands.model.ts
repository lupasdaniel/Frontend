import { TableDto } from "../models/table.model";

export interface AddTableCommand {
  table: TableDto;
}

export interface UpdateTableCommand {
  table: TableDto;
}

export interface UpdateTablesCommand {
  tables: TableDto[];
  roomId: string;
}
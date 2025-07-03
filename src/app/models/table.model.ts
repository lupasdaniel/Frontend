import { ReservationDto } from "./reservation.model";

export class TableDto {
  id!: string;
  roomID!: string;
  personsNr!: number;
  statusId!: string;
  status!: string;
  reservation!: ReservationDto;
  tableNumber!: number;
  x!: number;
  y!: number;
  isReserved!: boolean;
  availableTime!: Date;
}

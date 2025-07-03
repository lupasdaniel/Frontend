import { ReservationDto } from "../models/reservation.model";

export class AddReservationCommand {
  reservation!: ReservationDto;
}

export class UpdateReservationCommand {
  reservation!: ReservationDto;
}

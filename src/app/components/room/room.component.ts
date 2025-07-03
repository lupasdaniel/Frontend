import { Component } from '@angular/core'; 
import { RestaurantMapComponent } from '../restaurant-map/restaurant-map.component';
import { RoomService } from '../../services/room.service';
import { RoomDto } from '../../models/room.model';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [RestaurantMapComponent, DropdownModule, CommonModule, FormsModule],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  public roomNames: string[] = [];
  public selectedRoomName!: string;
  public room: RoomDto = new RoomDto();
  public isRoomLoaded: boolean = false;

  public isPopupVisible: boolean = false;
  public newRoomName: string = '';

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadRoom(name: string): void {
    this.isRoomLoaded = false;
    this.roomService.getRoomByName(name).subscribe({
      next: (res) => {
        this.room = res;
        this.isRoomLoaded = true;
      }
    });
  }

  public loadData(): void{
    this.roomService.getRoomNames().subscribe({
      next: (res) =>{
        this.roomNames = res;
        this.selectedRoomName = this.roomNames[0];
        this.loadRoom(this.selectedRoomName);
      }
    })
  }

  onRoomChange(): void {
    this.loadRoom(this.selectedRoomName);
  }

  showPopup(): void {
    this.newRoomName = '';
    this.isPopupVisible = true;
  }

  cancelPopup(): void {
    this.isPopupVisible = false;
  }

  confirmAddRoom(): void {
    const trimmedName = this.newRoomName.trim();
    if (!trimmedName) return;

    const newRoom = new RoomDto();
    newRoom.name = trimmedName;

    this.roomService.createRoom(newRoom).subscribe({
      next: (createdRoom) => {
        this.selectedRoomName = createdRoom.name;
        this.loadData();
        this.isPopupVisible = false;
      },
      error: (err) => {
        alert('Eroare la adăugare cameră!');
      }
    });
  }
}

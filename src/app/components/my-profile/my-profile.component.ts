import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UpdateUserCommand } from '../../commands/user-commands.model';
import { ReservationService } from '../../services/reservation.service';
import { ReservationDto } from '../../models/reservation.model';


@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  standalone: true,
})
export class MyProfileComponent implements OnInit {
  editUserForm!: FormGroup;
  reservations: ReservationDto[] = [];
  user!: any;
  showConfirm: boolean = false;
  reservationToCancelId: string | null = null;

  constructor(private fb: FormBuilder,
     private userService: UserService,
     private reservationService: ReservationService,
     private authService: AuthService) {}

  ngOnInit(): void {
    this.editUserForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phoneNumber: ['']
    });
    
    this.authService.getCurrentUser().subscribe({
      next: (user) =>{
        this.user = user;
        this.reservations =  [];
        this.userService.getUserById(user.id).subscribe({
          next: (userDetails) => {
             this.editUserForm = this.fb.group({
                id: [userDetails.id],
                firstName: [userDetails.firstName || '', Validators.required],
                lastName: [userDetails.lastName || '', Validators.required],
                userName: [{ value: userDetails.userName, disabled: true }],
                email: [{ value: userDetails.email, disabled: true }],
                phoneNumber: [userDetails.phoneNumber || '']
              });
          },
          error: () => {

          }
      });
      this.getReservations(user.id);
      }
    })
  }

  public getReservations(id: string): void{
      this.reservationService.getUserReservations(this.user.id).subscribe({
        next: (res) => {
          this.reservations = res;
        }
      })
  }

  public onSubmit(): void {
    if (this.editUserForm.valid) {
      const updatedUser = {
        user: this.editUserForm.getRawValue()
      } as UpdateUserCommand;

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          alert('Profilul a fost actualizat cu succes!');
        },
        error: () => {
          alert('A apărut o eroare la actualizarea profilului.');
        }
      });
    }
  }

  cancelReservation(id: string): void {
     this.reservationService.deleteReservation(id).subscribe({
       next: (res) =>{
          this.getReservations(id);
       }
     })
  }

  
openConfirmDialog(reservationId: string) {
  this.reservationToCancelId = reservationId;
  this.showConfirm = true;
}

closeConfirmDialog() {
  this.showConfirm = false;
  this.reservationToCancelId = null;
}

confirmCancel() {
  if (this.reservationToCancelId) {
    this.cancelReservation(this.reservationToCancelId);
  }
  this.closeConfirmDialog();
}

  public formatDateForQuery(date: string): string {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}-${month}-${year}`;
  }

  public formatTimeForQuery(time: string | Date): string {
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    }

    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

}

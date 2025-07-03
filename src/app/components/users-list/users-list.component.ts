import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../models/user.model';
import { UserFilters } from '../../filters/user-filters.model';
import { UpdateUserCommand } from '../../commands/user-commands.model';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DialogModule,
    NgIf,
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public users: UserDto[] = [];

  public filters: UserFilters = new UserFilters();
  editDialogVisible = false;
  editUser: UserDto | null = null;

  public roles = [
    { label: 'Client', value: 'Client' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void{
    this.userService.getUsers(this.filters).subscribe({
      next: (res) => {
        this.users = res;
      }
    });
  }

  editUserInit(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.editUser = { ...user };
      this.editDialogVisible = true;
    }
  }
    
  resetFilters(): void{
    this.filters = new UserFilters();
    this.loadUsers();
  }

  saveEditedUser(): void {
    if (!this.editUser) return;

    const updatedUser = {
      user: this.editUser
    } as UpdateUserCommand;

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        alert('Profilul a fost actualizat cu succes!');
        this.editDialogVisible = false;
        this.loadUsers();
      },
      error: () => {
        alert('A apărut o eroare la actualizarea profilului.');
      }
    });
  }

}

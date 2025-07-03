import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { UserDto } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterCommand } from '../../commands/auth-commands.model';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SignInComponent {
  constructor(private router: Router, private authService: AuthService) {}

  public user: UserDto =  new UserDto();
  public errors: string[] = [];

  onSignup() {
      var command = {
        user: this.user
      } as RegisterCommand;
  
      this.authService.regiter(command).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/restaurant-map']);
        },
       error: (error) => {
      if (error.status === 400 && Array.isArray(error.error)) {
        this.errors = error.error.map((e: any) => e.description);
      } else {
        this.errors = ['A apărut o eroare neașteptată.'];
      }
    }
      });
  }
}

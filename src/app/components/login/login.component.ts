import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserDto } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginCommand } from '../../commands/auth-commands.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public user: UserDto = new UserDto();
  public errorMessage = '';


  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    var command = {
      email: this.user.email,
      password: this.user.password
    } as LoginCommand;

   this.authService.login(command).subscribe({
      next: (res) => {
        this.authService.loginSuccess(res.token, res.email, res.username, res.role);
        this.router.navigate(['/room']);
      },
      error: () => {
        this.errorMessage = 'Autentificare eșuată. Verifică datele introduse.';
      }
    });
  }

    goToSignup() {
    this.router.navigate(['/signin']);
  }
}

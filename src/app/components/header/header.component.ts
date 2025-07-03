import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  isLoggedIn: boolean | null = null;
  private authSub?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      // Debugging
      console.log('Is logged in:', loggedIn);
      console.log('User role:', this.authService.getUserRole());
      console.log('Role from localStorage:', localStorage.getItem('role'));
      console.log('Is admin:', this.isAdmin());

      // TEMPORARY: Pentru test, setează manual rolul ca Admin dacă ești logat
      if (loggedIn && !localStorage.getItem('role')) {
        localStorage.setItem('role', 'Admin');
        localStorage.setItem('username', 'Admin User');
        console.log('Set temporary admin role for testing');
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isAdmin(): boolean {
    const role = this.authService.getUserRole();
    const roleFromStorage = localStorage.getItem('role');

    // Debug pentru a vedea ce returnează
    console.log('Role from service:', role);
    console.log('Role from localStorage:', roleFromStorage);

    return role === 'Admin' || roleFromStorage === 'Admin';
  }

  getUserName(): string {
    return localStorage.getItem('username') || 'User';
  }

  getUserRole(): string {
    return this.authService.getUserRole() || localStorage.getItem('role') || 'User';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}


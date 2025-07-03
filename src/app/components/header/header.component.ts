import { Component, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  menuItems: MenuItem[] = [];
  isLoggedIn: boolean | null = null;
  private authSub?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.buildMenu();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  private buildMenu() {
    const role = this.authService.getUserRole();

    if (!this.isLoggedIn) {
      this.menuItems = [
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          command: () => this.login()
        }
      ];
      return;
    }

    this.menuItems = [
      {
        label: 'Pagina principală',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/room'])
      },
      {
        label: 'Meniu',
        icon: 'pi pi-book',
        command: () => this.router.navigate(['/meniu-page'])
      },
      {
        label: 'Profilul meu',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/my-profile'])
      },
      ...(role === 'Admin'
        ? [{
            label: 'Utilizatori',
            icon: 'pi pi-users',
            command: () => this.router.navigate(['/users-list'])
          }]
        : []),
      ...(role === 'Admin'
        ? [{
            label: 'Rezervări ',
            icon: 'pi pi-calendar',
            command: () => this.router.navigate(['/reservations-list'])
          }]
        : []),
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}


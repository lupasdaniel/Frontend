import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
  imports: [ButtonModule],
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['/']);
  }
}

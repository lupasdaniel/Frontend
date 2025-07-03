import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  confirmationMessage: string = 'Se confirmă contul...';
  errorOccurred: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const token = params['token'];

      if (userId && token) {
        this.authService.confirmEmail(userId, token).subscribe({
  next: () => {
    this.confirmationMessage = 'Contul tău a fost confirmat cu succes! Poți să te autentifici.';
  },
  error: (err: any) => {
    this.confirmationMessage = 'Confirmarea contului a eșuat. Te rugăm să încerci din nou.';
    this.errorOccurred = true;
  }
});

      } else {
        this.confirmationMessage = 'Link-ul de confirmare este invalid.';
        this.errorOccurred = true;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginCommand, RegisterCommand } from '../commands/auth-commands.model';
import { UserDto } from '../models/user.model';

interface LoginResponse {
  token: string;
  email: string;
  role: string;
  username: string;
}

interface RegisterResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://licenta2-eacbcjg8crgpd0ca.northeurope-01.azurewebsites.net/api/auth';
  private tokenKey = 'token'; // Folosește cheia corectă pentru token
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(command: LoginCommand): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, command);
  }

  regiter(command: RegisterCommand): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, command);
  }

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/current-user`);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  loginSuccess(token: string, email: string, username: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    this.loggedIn.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.loggedIn.next(false);

    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(() => {});
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  confirmEmail(userId: string, token: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('token', token);

    return this.http.get(`${this.apiUrl}/confirm-email`, { params });
  }

}

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/signin/signin.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuard } from './auth.guard';
import { RoomComponent } from './components/room/room.component';
import { NgModule } from '@angular/core';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ReservationsListComponent } from './components/reservations-list/reservations-list.component';
import { MeniuPageComponent } from './components/meniu-page/meniu-page.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signin', component: SignInComponent },

  { path: 'users-list', component: UsersListComponent, canActivate: [AuthGuard]},

  { path: 'room', component: RoomComponent, canActivate: [AuthGuard] },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'reservations-list', component: ReservationsListComponent, canActivate: [AuthGuard]},
  { path: 'meniu-page', component: MeniuPageComponent},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

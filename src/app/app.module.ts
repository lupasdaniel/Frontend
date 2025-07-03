import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RestaurantMapComponent } from './components/restaurant-map/restaurant-map.component';
import { EditReservationPopupComponent } from './components/edit-reservation-popup/edit-reservation-popup.component';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/signin/signin.component';
import { HeaderComponent } from './components/header/header.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReservationsListComponent } from './components/reservations-list/reservations-list.component';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    InputTextModule,
    DatePickerModule,
    FloatLabelModule,
    CheckboxModule,
    TableModule,
    AppComponent,
    LoginComponent,
    SignInComponent,
    HeaderComponent,
    UsersListComponent,
    RestaurantMapComponent,
    MyProfileComponent,
    EditReservationPopupComponent,
    ReservationsListComponent,
    RouterModule.forRoot(routes),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }

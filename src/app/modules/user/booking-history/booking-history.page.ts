import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonBadge,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline } from 'ionicons/icons';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookingModel } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonButton,
    IonBadge,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon,
  ],
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit {
  bookings: BookingModel[] = [];
  currentUser: any;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
  ) {
    addIcons({ homeOutline, calendarOutline });
  }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUserProfile();
    this.bookingService.getUserBookings(this.currentUser.uid).subscribe((b) => {
      this.bookings = b;
    });
  }

  countStatus(status: string): number {
    return this.bookings.filter(b => b.status === status).length;
  }

  getStatusColor(status: string): string {
    const map: any = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger',
      paid: 'primary',
      completed: 'secondary',
      cancelled: 'medium',
    };
    return map[status] || 'medium';
  }
}

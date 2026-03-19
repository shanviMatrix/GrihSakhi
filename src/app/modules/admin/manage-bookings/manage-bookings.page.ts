import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { BookingModel } from '../../../core/models/booking.model';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonBadge,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonLabel,
    IonSegment,
    IonSegmentButton,
  ],
  templateUrl: './manage-bookings.page.html',
})
export class ManageBookingsPage implements OnInit {
  bookings: BookingModel[] = [];
  activeTab = 'all';

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getAllBookings().subscribe((b) => {
      this.bookings = b;
    });
  }

  getFilteredBookings() {
    if (this.activeTab === 'all') return this.bookings;
    return this.bookings.filter((b) => b.status === this.activeTab);
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

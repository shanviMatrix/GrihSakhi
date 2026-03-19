import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonButton, IonBadge,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon,
  IonToggle, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { BookingService } from '../../../core/services/booking.service';
import { MaidService } from '../../../core/services/maid.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookingModel } from '../../../core/models/booking.model';

@Component({
  selector: 'app-maid-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonCard, IonCardContent, IonButton, IonBadge,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon,
    IonToggle
  ],
  templateUrl: './dashboard.page.html',})
export class MaidDashboardPage implements OnInit {
  bookings: BookingModel[] = [];
  maidProfile: any;
  isAvailable = true;
  maidId = '';

  constructor(
    private bookingService: BookingService,
    private maidService: MaidService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    addIcons({ logOutOutline });
  }

  async ngOnInit() {
    const user = await this.authService.getCurrentUserProfile();
    this.maidId = user.uid;
    this.maidService.getMaidById(this.maidId).subscribe(m => {
      this.maidProfile = m;
      this.isAvailable = m.isAvailable;
    });
    this.bookingService.getMaidBookings(this.maidId).subscribe(b => {
      this.bookings = b;
    });
  }

  async toggleAvailability() {
    await this.maidService.toggleAvailability(this.maidId, this.isAvailable);
    const toast = await this.toastCtrl.create({
      message: this.isAvailable ? '✅ You are now Available' : '⛔ You are now Unavailable',
      duration: 2000, color: 'success'
    });
    toast.present();
  }

  async acceptBooking(booking: BookingModel) {
    await this.bookingService.updateBookingStatus(booking.id!, 'accepted');
    const toast = await this.toastCtrl.create({
      message: '✅ Booking Accepted!', duration: 2000, color: 'success'
    });
    toast.present();
  }

  async rejectBooking(booking: BookingModel) {
    await this.bookingService.updateBookingStatus(booking.id!, 'rejected');
    const toast = await this.toastCtrl.create({
      message: 'Booking Rejected.', duration: 2000, color: 'danger'
    });
    toast.present();
  }

  async markComplete(booking: BookingModel) {
    await this.bookingService.updateBookingStatus(booking.id!, 'completed');
    const toast = await this.toastCtrl.create({
      message: '🎉 Marked as Complete!', duration: 2000, color: 'success'
    });
    toast.present();
  }

  getStatusColor(status: string): string {
    const map: any = {
      pending: 'warning', accepted: 'success', rejected: 'danger',
      paid: 'primary', completed: 'secondary'
    };
    return map[status] || 'medium';
  }

  logout() { this.authService.logout(); }
}

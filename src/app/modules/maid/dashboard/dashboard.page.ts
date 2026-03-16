import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonButton, IonBadge,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon,
  IonLabel, IonToggle, ToastController
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
    IonLabel, IonToggle
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title style="font-family:Poppins;">My Dashboard 🧹</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">

      <!-- Profile Card -->
      <ion-card style="border-radius:16px;margin:16px;">
        <ion-card-content>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h3 style="font-family:Poppins;font-weight:700;color:#1E2A38;margin:0 0 6px;">
                {{ maidProfile?.name }}
              </h3>
              <ion-badge [color]="maidProfile?.isApproved === 'approved' ? 'success' : maidProfile?.isApproved === 'rejected' ? 'danger' : 'warning'">
                {{ maidProfile?.isApproved | uppercase }}
              </ion-badge>
            </div>
            <div style="text-align:right;">
              <p style="margin:0;font-size:12px;color:#666;">Available</p>
              <ion-toggle
                [(ngModel)]="isAvailable"
                (ionChange)="toggleAvailability()"
                color="primary">
              </ion-toggle>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Bookings -->
      <div style="padding:0 16px 16px;">
        <h3 style="font-family:Poppins;font-weight:600;color:#1E2A38;margin-bottom:12px;">
          Booking Requests
        </h3>

        <ion-card *ngFor="let booking of bookings" style="border-radius:16px;margin-bottom:12px;">
          <ion-card-content>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
              <div>
                <h4 style="font-family:Poppins;font-weight:600;color:#1E2A38;margin:0;">{{ booking.userName }}</h4>
                <p style="color:#666;font-size:13px;margin:2px 0;">{{ booking.service }} • {{ booking.timeSlot }}</p>
                <p style="color:#666;font-size:12px;margin:2px 0;">📅 {{ booking.date }}</p>
                <p style="color:#666;font-size:12px;margin:0;">📍 {{ booking.address }}</p>
              </div>
              <div style="text-align:right;">
                <ion-badge [color]="getStatusColor(booking.status)">
                  {{ booking.status | uppercase }}
                </ion-badge>
                <p style="font-family:Poppins;font-weight:700;color:#E91E63;margin:6px 0 0;">
                  ₹{{ booking.amount }}
                </p>
              </div>
            </div>

            <!-- Accept / Reject -->
            <div *ngIf="booking.status === 'pending'" style="display:flex;gap:8px;">
              <ion-button expand="block" color="success"
                (click)="acceptBooking(booking)"
                style="flex:1;--border-radius:10px;">
                ✅ Accept
              </ion-button>
              <ion-button expand="block" color="danger"
                (click)="rejectBooking(booking)"
                style="flex:1;--border-radius:10px;">
                ❌ Reject
              </ion-button>
            </div>

            <!-- Mark Complete -->
            <ion-button *ngIf="booking.status === 'paid'" expand="block"
              (click)="markComplete(booking)"
              style="margin-top:8px;--background:#1E2A38;--border-radius:10px;">
              ✔️ Mark as Complete
            </ion-button>
          </ion-card-content>
        </ion-card>

        <p *ngIf="bookings.length === 0"
          style="text-align:center;padding:40px;color:#999;">
          No bookings yet.
        </p>
      </div>
    </ion-content>
  `
})
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
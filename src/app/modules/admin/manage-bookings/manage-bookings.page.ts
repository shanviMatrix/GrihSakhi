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
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start"
          ><ion-back-button defaultHref="/admin/dashboard"></ion-back-button
        ></ion-buttons>
        <ion-title style="font-family:Poppins;">All Bookings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">
      <ion-segment [(ngModel)]="activeTab" style="margin:16px;">
        <ion-segment-button value="all"
          ><ion-label>All</ion-label></ion-segment-button
        >
        <ion-segment-button value="pending"
          ><ion-label>Pending</ion-label></ion-segment-button
        >
        <ion-segment-button value="paid"
          ><ion-label>Paid</ion-label></ion-segment-button
        >
        <ion-segment-button value="completed"
          ><ion-label>Done</ion-label></ion-segment-button
        >
      </ion-segment>

      <div style="padding:0 16px 16px;">
        <ion-card
          *ngFor="let booking of getFilteredBookings()"
          style="border-radius:16px;margin-bottom:12px;"
        >
          <ion-card-content>
            <div
              style="display:flex;justify-content:space-between;align-items:flex-start;"
            >
              <div>
                <h4
                  style="font-family:Poppins;font-weight:600;color:#1E2A38;margin:0 0 4px;"
                >
                  {{ booking.userName }}
                </h4>
                <p style="color:#666;font-size:12px;margin:0;">
                  🧹 {{ booking.maidName }}
                </p>
                <p style="color:#666;font-size:12px;margin:2px 0;">
                  {{ booking.service }} • {{ booking.timeSlot }}
                </p>
                <p style="color:#666;font-size:12px;margin:0;">
                  📅 {{ booking.date }}
                </p>
              </div>
              <div style="text-align:right;">
                <ion-badge [color]="getStatusColor(booking.status)">
                  {{ booking.status | uppercase }}
                </ion-badge>
                <p
                  style="font-family:Poppins;font-weight:700;color:#E91E63;margin:6px 0 0;"
                >
                  ₹{{ booking.amount }}
                </p>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <p
          *ngIf="getFilteredBookings().length === 0"
          style="text-align:center;padding:40px;color:#999;"
        >
          No bookings found.
        </p>
      </div>
    </ion-content>
  `,
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

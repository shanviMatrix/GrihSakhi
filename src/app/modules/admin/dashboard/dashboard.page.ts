import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonLabel,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline, peopleOutline, calendarOutline, logOutOutline, chevronForwardOutline } from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title style="font-family:Poppins;font-weight:700;">Admin Panel 👑</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px;">
        <ion-card style="border-radius:16px;background:linear-gradient(135deg,#E91E63,#c2185b);margin:0;">
          <ion-card-content style="text-align:center;padding:20px 12px;">
            <h2 style="font-family:Poppins;font-weight:700;font-size:28px;margin:0;color:white;">{{ totalUsers }}</h2>
            <p style="margin:4px 0 0;font-size:13px;color:white;opacity:0.9;">Total Users</p>
          </ion-card-content>
        </ion-card>

        <ion-card style="border-radius:16px;background:linear-gradient(135deg,#1E2A38,#2d3f55);margin:0;">
          <ion-card-content style="text-align:center;padding:20px 12px;">
            <h2 style="font-family:Poppins;font-weight:700;font-size:28px;margin:0;color:white;">{{ totalMaids }}</h2>
            <p style="margin:4px 0 0;font-size:13px;color:white;opacity:0.9;">Total Maids</p>
          </ion-card-content>
        </ion-card>

        <ion-card style="border-radius:16px;background:linear-gradient(135deg,#FF9800,#F57C00);margin:0;">
          <ion-card-content style="text-align:center;padding:20px 12px;">
            <h2 style="font-family:Poppins;font-weight:700;font-size:28px;margin:0;color:white;">{{ pendingMaids }}</h2>
            <p style="margin:4px 0 0;font-size:13px;color:white;opacity:0.9;">Pending Approval</p>
          </ion-card-content>
        </ion-card>

        <ion-card style="border-radius:16px;background:linear-gradient(135deg,#4CAF50,#388E3C);margin:0;">
          <ion-card-content style="text-align:center;padding:20px 12px;">
            <h2 style="font-family:Poppins;font-weight:700;font-size:28px;margin:0;color:white;">{{ totalBookings }}</h2>
            <p style="margin:4px 0 0;font-size:13px;color:white;opacity:0.9;">Total Bookings</p>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Quick Links -->
      <div style="padding:0 16px 16px;">
        <h3 style="font-family:Poppins;font-weight:600;color:#1E2A38;margin-bottom:12px;">Manage</h3>

        <ion-card routerLink="/admin/manage-maids" style="border-radius:16px;cursor:pointer;margin-bottom:10px;">
          <ion-item lines="none">
            <ion-icon name="person-add-outline" slot="start" color="primary" style="font-size:24px;"></ion-icon>
            <ion-label>
              <h3 style="font-family:Poppins;font-weight:600;">Maid Approvals</h3>
              <p>{{ pendingMaids }} pending requests</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
        </ion-card>

        <ion-card routerLink="/admin/manage-users" style="border-radius:16px;cursor:pointer;margin-bottom:10px;">
          <ion-item lines="none">
            <ion-icon name="people-outline" slot="start" color="secondary" style="font-size:24px;"></ion-icon>
            <ion-label>
              <h3 style="font-family:Poppins;font-weight:600;">Manage Users</h3>
              <p>View and block users</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
        </ion-card>

        <ion-card routerLink="/admin/manage-bookings" style="border-radius:16px;cursor:pointer;">
          <ion-item lines="none">
            <ion-icon name="calendar-outline" slot="start" color="warning" style="font-size:24px;"></ion-icon>
            <ion-label>
              <h3 style="font-family:Poppins;font-weight:600;">All Bookings</h3>
              <p>View all platform bookings</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
        </ion-card>
      </div>
    </ion-content>
  `
})
export class AdminDashboardPage implements OnInit {
  totalUsers = 0;
  totalMaids = 0;
  pendingMaids = 0;
  totalBookings = 0;

  constructor(
    private maidService: MaidService,
    private bookingService: BookingService,
    private authService: AuthService,
    private firestore: Firestore
  ) {
    addIcons({ personAddOutline, peopleOutline, calendarOutline, logOutOutline, chevronForwardOutline });
  }

  ngOnInit() {
    collectionData(collection(this.firestore, 'users')).subscribe((u: any[]) => {
      this.totalUsers = u.filter(x => x.role === 'user').length;
    });
    this.maidService.getAllMaids().subscribe(m => {
      this.totalMaids = m.length;
      this.pendingMaids = m.filter(x => x.isApproved === 'pending').length;
    });
    this.bookingService.getAllBookings().subscribe(b => {
      this.totalBookings = b.length;
    });
  }

  logout() { this.authService.logout(); }
}
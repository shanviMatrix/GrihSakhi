import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personAddOutline,
  peopleOutline,
  calendarOutline,
  logOutOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
  ],
  templateUrl: './dashboard.page.html',
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
    private firestore: Firestore,
  ) {
    addIcons({
      personAddOutline,
      peopleOutline,
      calendarOutline,
      logOutOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    collectionData(collection(this.firestore, 'users')).subscribe(
      (u: any[]) => {
        this.totalUsers = u.filter((x) => x.role === 'user').length;
      },
    );
    this.maidService.getAllMaids().subscribe((m) => {
      this.totalMaids = m.length;
      this.pendingMaids = m.filter((x) => x.isApproved === 'pending').length;
    });
    this.bookingService.getAllBookings().subscribe((b) => {
      this.totalBookings = b.length;
    });
  }

  logout() {
    this.authService.logout();
  }
}

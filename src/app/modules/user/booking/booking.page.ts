import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, IonSelect, IonSelectOption,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonAvatar, ToastController
} from '@ionic/angular/standalone';
import { MaidService } from '../../../core/services/maid.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { MaidModel } from '../../../core/models/maid.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton, IonSelect, IonSelectOption,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonAvatar
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-back-button></ion-back-button></ion-buttons>
        <ion-title style="font-family:Poppins;">Book Maid</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" style="--background:#F9FAFB;">
      <ion-card *ngIf="maid" style="border-radius:16px;margin-bottom:20px;">
        <ion-card-content>
          <div style="display:flex;align-items:center;gap:12px;">
            <ion-avatar style="width:50px;height:50px;">
              <img [src]="maid.profileImage || 'https://ionicframework.com/docs/img/demos/avatar.svg'">
            </ion-avatar>
            <div>
              <h4 style="font-family:Poppins;font-weight:600;margin:0;">{{ maid.name }}</h4>
              <p style="color:#E91E63;font-weight:600;margin:0;">₹{{ maid.salaryExpectation }}/day</p>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card style="border-radius:16px;">
        <ion-card-content>
          <h3 style="font-family:Poppins;font-weight:600;color:#1E2A38;">Booking Details</h3>

          <form [formGroup]="bookingForm" (ngSubmit)="submitBooking()">
            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Service Required</ion-label>
              <ion-select formControlName="service" placeholder="Select service">
                <ion-select-option *ngFor="let s of maid?.skills" [value]="s">{{ s }}</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Date (DD-MM-YYYY)</ion-label>
              <ion-input formControlName="date" placeholder="e.g. 15-06-2025"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Time Slot</ion-label>
              <ion-select formControlName="timeSlot">
                <ion-select-option value="Morning (8AM-12PM)">Morning (8AM-12PM)</ion-select-option>
                <ion-select-option value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</ion-select-option>
                <ion-select-option value="Evening (4PM-8PM)">Evening (4PM-8PM)</ion-select-option>
                <ion-select-option value="Full Day">Full Day</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item style="margin-bottom:20px;">
              <ion-label position="floating">Your Address</ion-label>
              <ion-input formControlName="address"></ion-input>
            </ion-item>

            <div style="background:#FFF0F5;border-radius:12px;padding:12px;margin-bottom:16px;">
              <p style="color:#E91E63;font-weight:600;margin:0;font-family:Poppins;">
                💰 Total: ₹{{ maid?.salaryExpectation || 0 }}
              </p>
              <p style="color:#666;font-size:12px;margin:4px 0 0;">Payment after maid accepts your request</p>
            </div>

            <ion-button expand="block" type="submit" [disabled]="bookingForm.invalid || isLoading"
              style="--background:#E91E63;--border-radius:12px;height:50px;">
              {{ isLoading ? 'Sending...' : 'Send Booking Request' }}
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class BookingPage implements OnInit {
  maid: MaidModel | null = null;
  bookingForm: FormGroup;
  isLoading = false;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private maidService: MaidService,
    private bookingService: BookingService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.bookingForm = this.fb.group({
      service: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    const maidId = this.route.snapshot.paramMap.get('id')!;
    this.maidService.getMaidById(maidId).subscribe(m => this.maid = m);
    this.authService.getCurrentUserProfile().then(p => this.currentUser = p);
  }

  async submitBooking() {
    if (!this.maid || this.bookingForm.invalid) return;
    this.isLoading = true;
    try {
      const v = this.bookingForm.value;
      await this.bookingService.createBooking({
        userId: this.currentUser.uid,
        userName: this.currentUser.name,
        maidId: this.maid.uid,
        maidName: this.maid.name,
        service: v.service,
        date: v.date,
        timeSlot: v.timeSlot,
        address: v.address,
        amount: this.maid.salaryExpectation,
        status: 'pending',
        createdAt: new Date()
      });
      const toast = await this.toastCtrl.create({
        message: '✅ Booking request sent! Waiting for maid to accept.',
        duration: 3000, color: 'success'
      });
      toast.present();
      this.router.navigate(['/user/booking-history']);
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Booking failed. Try again.',
        duration: 3000, color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
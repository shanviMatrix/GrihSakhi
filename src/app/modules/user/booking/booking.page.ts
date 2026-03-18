import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  calendarOutline,
  timeOutline,
  locationOutline,
} from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import type { MaidModel } from '../../../core/models/maid.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonAvatar,
    IonIcon,
  ],
  template: `
    <!-- Premium Header -->
    <ion-header class="premium-header">
      <ion-toolbar class="premium-toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/user/home"
            class="back-btn"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="header-title">Book Service</ion-title>
        <div slot="end" style="width: 48px;"></div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="premium-content">
      <!-- Maid Profile Card -->
      <div class="profile-section" *ngIf="maid">
        <ion-card class="maid-profile-card">
          <ion-card-content class="profile-content">
            <div class="profile-header">
              <ion-avatar class="profile-avatar">
                <img
                  [src]="
                    maid.profileImage ||
                    'https://ionicframework.com/docs/img/demos/avatar.svg'
                  "
                />
              </ion-avatar>
              <div class="profile-info">
                <h3 class="profile-name">{{ maid.name }}</h3>
                <p class="profile-salary">₹{{ maid.salaryExpectation }}/day</p>
              </div>
              <div class="profile-badge">
                <span class="badge-star">⭐</span>
                <span class="badge-text">{{ maid.rating || 'New' }}</span>
              </div>
            </div>
            <div class="profile-skills">
              <span
                *ngFor="let skill of maid.skills.slice(0, 3)"
                class="skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Booking Form -->
      <div class="form-section">
        <form [formGroup]="bookingForm" (ngSubmit)="submitBooking()">
          <!-- Service Selection -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🧹</span>
              Service Required
            </label>
            <ion-select
              formControlName="service"
              placeholder="Select service"
              class="premium-select"
              interface="popover"
            >
              <ion-select-option
                *ngFor="let skill of maid?.skills"
                [value]="skill"
              >
                {{ skill }}
              </ion-select-option>
            </ion-select>
          </div>

          <!-- Date Selection -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📅</span>
              Select Date
            </label>
            <div class="input-wrapper">
              <ion-icon name="calendar-outline" class="input-icon"></ion-icon>
              <ion-input
                type="text"
                formControlName="date"
                placeholder="DD-MM-YYYY"
                class="premium-input"
              ></ion-input>
            </div>
          </div>

          <!-- Time Slot Selection -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">⏰</span>
              Time Slot
            </label>
            <ion-select
              formControlName="timeSlot"
              placeholder="Select time slot"
              class="premium-select"
              interface="popover"
            >
              <ion-select-option value="Morning (8AM-12PM)"
                >Morning (8AM-12PM)</ion-select-option
              >
              <ion-select-option value="Afternoon (12PM-4PM)"
                >Afternoon (12PM-4PM)</ion-select-option
              >
              <ion-select-option value="Evening (4PM-8PM)"
                >Evening (4PM-8PM)</ion-select-option
              >
              <ion-select-option value="Full Day">Full Day</ion-select-option>
            </ion-select>
          </div>

          <!-- Address Selection -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📍</span>
              Your Address
            </label>
            <div class="input-wrapper">
              <ion-icon name="location-outline" class="input-icon"></ion-icon>
              <ion-input
                type="text"
                formControlName="address"
                placeholder="Enter your address"
                class="premium-input"
              ></ion-input>
            </div>
          </div>

          <!-- Price Summary Card -->
          <ion-card class="price-card">
            <ion-card-content class="price-content">
              <div class="price-row">
                <span class="price-label">Service Rate</span>
                <span class="price-value"
                  >₹{{ maid?.salaryExpectation || 0 }}</span
                >
              </div>
              <div class="price-divider"></div>
              <div class="price-row total">
                <span class="total-label">Total Amount</span>
                <span class="total-value"
                  >₹{{ maid?.salaryExpectation || 0 }}</span
                >
              </div>
              <p class="price-note">
                💳 Payment after maid accepts your request
              </p>
            </ion-card-content>
          </ion-card>

          <!-- Submit Button -->
          <ion-button
            expand="block"
            type="submit"
            [disabled]="bookingForm.invalid || isLoading"
            class="submit-btn"
          >
            <span *ngIf="!isLoading" class="btn-text">
              📨 Send Booking Request
            </span>
            <span *ngIf="isLoading" class="btn-text loading">
              <span class="spinner"></span> Sending...
            </span>
          </ion-button>

          <!-- Info Text -->
          <p class="info-text">
            By booking, you agree to our terms and conditions. The maid will
            review your request.
          </p>
        </form>
      </div>
    </ion-content>
  `,
  styles: [
    `
      /* ===== HEADER ===== */
      .premium-header {
        --background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        box-shadow: 0 8px 32px rgba(236, 72, 153, 0.15);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .premium-toolbar {
        --min-height: 60px;
        --padding-start: 16px;
        --padding-end: 16px;
      }

      .header-title {
        font-size: 22px;
        font-weight: 700;
        color: white;
        font-family: 'Poppins', sans-serif;
        margin: 0;
      }

      .back-btn {
        --color: white;
        --icon-font-size: 28px;
      }

      /* ===== CONTENT ===== */
      .premium-content {
        --background: linear-gradient(180deg, #0f172a 0%, #1a1f2e 100%);
        --padding-bottom: 40px;
      }

      /* ===== PROFILE SECTION ===== */
      .profile-section {
        padding: 20px 16px 0;
      }

      .maid-profile-card {
        background: linear-gradient(
          135deg,
          rgba(236, 72, 153, 0.15) 0%,
          rgba(255, 193, 7, 0.05) 100%
        );
        border: 1px solid rgba(236, 72, 153, 0.3);
        border-radius: 16px;
        margin: 0;
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
      }

      .profile-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .profile-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .profile-avatar {
        width: 56px;
        height: 56px;
        flex-shrink: 0;
        border: 3px solid #ec4899;
        background: linear-gradient(135deg, #ec4899, #f43f5e);
      }

      .profile-info {
        flex: 1;
      }

      .profile-name {
        color: white;
        font-size: 16px;
        font-weight: 700;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }

      .profile-salary {
        color: #ec4899;
        font-size: 13px;
        margin: 4px 0 0;
        font-weight: 600;
      }

      .profile-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 193, 7, 0.15);
        border: 1px solid rgba(255, 193, 7, 0.4);
        padding: 6px 10px;
        border-radius: 8px;
        color: #ffc107;
        font-weight: 700;
        font-size: 13px;
      }

      .badge-star {
        font-size: 11px;
      }

      .profile-skills {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .skill-tag {
        background: rgba(139, 92, 246, 0.2);
        border: 1px solid rgba(139, 92, 246, 0.4);
        color: rgba(255, 255, 255, 0.8);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 600;
      }

      /* ===== FORM SECTION ===== */
      .form-section {
        padding: 24px 16px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: white;
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 10px;
        font-family: 'Poppins', sans-serif;
      }

      .label-icon {
        font-size: 16px;
      }

      .premium-select {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        --padding-start: 12px;
        --padding-end: 12px;
        color: white;
        font-size: 14px;
        padding: 12px;
        transition: all 0.3s ease;
      }

      .premium-select:focus {
        background: rgba(236, 72, 153, 0.15);
        border-color: rgba(236, 72, 153, 0.5);
        box-shadow: 0 0 16px rgba(236, 72, 153, 0.2);
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 12px 14px;
        transition: all 0.3s ease;
      }

      .input-wrapper:focus-within {
        background: rgba(236, 72, 153, 0.15);
        border-color: rgba(236, 72, 153, 0.5);
        box-shadow: 0 0 16px rgba(236, 72, 153, 0.2);
      }

      .input-icon {
        color: #ec4899;
        font-size: 18px;
        flex-shrink: 0;
      }

      .premium-input {
        --background: transparent;
        --border-radius: 0;
        --padding-start: 0;
        --padding-end: 0;
        --box-shadow: none;
        color: white;
        font-size: 14px;
        flex: 1;
      }

      .premium-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      /* ===== PRICE CARD ===== */
      .price-card {
        background: linear-gradient(
          135deg,
          rgba(236, 72, 153, 0.15) 0%,
          rgba(244, 63, 94, 0.1) 100%
        );
        border: 1px solid rgba(236, 72, 153, 0.3);
        border-radius: 16px;
        margin: 0 0 24px;
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
      }

      .price-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .price-row.total {
        padding-top: 8px;
      }

      .price-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        font-weight: 600;
      }

      .price-value {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 700;
      }

      .total-label {
        color: white;
        font-size: 14px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
      }

      .total-value {
        color: #ec4899;
        font-size: 18px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
      }

      .price-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
      }

      .price-note {
        color: rgba(255, 255, 255, 0.6);
        font-size: 11px;
        margin: 0;
        font-style: italic;
        text-align: center;
      }

      /* ===== SUBMIT BUTTON ===== */
      .submit-btn {
        --background: linear-gradient(135deg, #ec4899, #f43f5e);
        --background-hover: linear-gradient(135deg, #db2777, #e11d48);
        --border-radius: 12px;
        height: 50px;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.5px;
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
        transition: all 0.3s ease;
        margin-bottom: 16px;
      }

      .submit-btn:not([disabled]):hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(236, 72, 153, 0.4);
      }

      .submit-btn:not([disabled]):active {
        transform: scale(0.98);
      }

      .submit-btn[disabled] {
        opacity: 0.6;
      }

      .btn-text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .btn-text.loading {
        font-size: 13px;
      }

      .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* ===== INFO TEXT ===== */
      .info-text {
        color: rgba(255, 255, 255, 0.5);
        font-size: 11px;
        text-align: center;
        margin: 0;
        line-height: 1.5;
      }

      /* ===== RESPONSIVE ===== */
      @media (max-width: 600px) {
        .header-title {
          font-size: 18px;
        }

        .premium-toolbar {
          --min-height: 56px;
        }

        .form-label {
          font-size: 12px;
        }

        .submit-btn {
          height: 48px;
          font-size: 13px;
        }
      }
    `,
  ],
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
    private toastCtrl: ToastController,
  ) {
    addIcons({
      chevronBackOutline,
      calendarOutline,
      timeOutline,
      locationOutline,
    });
    this.bookingForm = this.fb.group({
      service: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    const maidId = this.route.snapshot.paramMap.get('id')!;
    this.maidService.getMaidById(maidId).subscribe((m) => (this.maid = m));
    this.authService
      .getCurrentUserProfile()
      .then((p) => (this.currentUser = p));
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
        createdAt: new Date(),
      });
      const toast = await this.toastCtrl.create({
        message: '✅ Booking request sent! Waiting for maid to accept.',
        duration: 3000,
        color: 'success',
      });
      toast.present();
      this.router.navigate(['/user/booking-history']);
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Booking failed. Try again.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}

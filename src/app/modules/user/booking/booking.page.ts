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
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
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

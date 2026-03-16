import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonBackButton, ToastController
} from '@ionic/angular/standalone';
import { MaidService } from '../../../core/services/maid.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-back-button></ion-back-button></ion-buttons>
        <ion-title style="font-family:Poppins;">Edit Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" style="--background:#F9FAFB;">
      <ion-card style="border-radius:16px;">
        <ion-card-content>
          <h3 style="font-family:Poppins;font-weight:600;color:#1E2A38;margin-bottom:16px;">
            Update Your Profile
          </h3>

          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Full Name</ion-label>
              <ion-input formControlName="name"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Phone</ion-label>
              <ion-input type="tel" formControlName="phone"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">City</ion-label>
              <ion-input formControlName="city"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Address</ion-label>
              <ion-input formControlName="address"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Skills (comma separated)</ion-label>
              <ion-input formControlName="skills" placeholder="Cooking, Cleaning, Laundry"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Experience (years)</ion-label>
              <ion-input type="number" formControlName="experience"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:20px;">
              <ion-label position="floating">Expected Salary/Day (₹)</ion-label>
              <ion-input type="number" formControlName="salaryExpectation"></ion-input>
            </ion-item>

            <ion-button expand="block" type="submit"
              [disabled]="profileForm.invalid || isLoading"
              style="--background:#E91E63;--border-radius:12px;height:50px;">
              {{ isLoading ? 'Saving...' : 'Save Profile' }}
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class ProfileSetupPage implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  maidId = '';

  constructor(
    private fb: FormBuilder,
    private maidService: MaidService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      skills: ['', Validators.required],
      experience: [0, Validators.required],
      salaryExpectation: [0, Validators.required]
    });
  }

  async ngOnInit() {
    const user = await this.authService.getCurrentUserProfile();
    this.maidId = user.uid;
    this.maidService.getMaidById(this.maidId).subscribe(m => {
      this.profileForm.patchValue({
        name: m.name,
        phone: m.phone,
        city: m.city,
        address: m.address,
        skills: m.skills.join(', '),
        experience: m.experience,
        salaryExpectation: m.salaryExpectation
      });
    });
  }

  async saveProfile() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    try {
      const v = this.profileForm.value;
      await this.maidService.updateMaidProfile(this.maidId, {
        ...v,
        skills: v.skills.split(',').map((s: string) => s.trim())
      });
      const toast = await this.toastCtrl.create({
        message: '✅ Profile updated!', duration: 2000, color: 'success'
      });
      toast.present();
      this.router.navigate(['/maid/dashboard']);
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Update failed. Try again.', duration: 2000, color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
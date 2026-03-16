import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/auth/login"></ion-back-button>
        </ion-buttons>
        <ion-title style="font-family:Poppins;">Create Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;" class="ion-padding">
      <ion-segment [(ngModel)]="selectedRole" style="margin-bottom:20px;">
        <ion-segment-button value="user"
          ><ion-label>👤 User</ion-label></ion-segment-button
        >
        <ion-segment-button value="maid"
          ><ion-label>🧹 Maid</ion-label></ion-segment-button
        >
      </ion-segment>

      <ion-card style="border-radius:20px;">
        <ion-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="register()">
            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Full Name</ion-label>
              <ion-input formControlName="name"></ion-input>
            </ion-item>
            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Email</ion-label>
              <ion-input type="email" formControlName="email"></ion-input>
            </ion-item>
            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Phone</ion-label>
              <ion-input type="tel" formControlName="phone"></ion-input>
            </ion-item>
            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">City</ion-label>
              <ion-input formControlName="city"></ion-input>
            </ion-item>

            <ng-container *ngIf="selectedRole === 'maid'">
              <ion-item style="margin-bottom:12px;">
                <ion-label position="floating">Address</ion-label>
                <ion-input formControlName="address"></ion-input>
              </ion-item>
              <ion-item style="margin-bottom:12px;">
                <ion-label position="floating"
                  >Skills (e.g. Cooking, Cleaning)</ion-label
                >
                <ion-input formControlName="skills"></ion-input>
              </ion-item>
              <ion-item style="margin-bottom:12px;">
                <ion-label position="floating">Experience (years)</ion-label>
                <ion-input
                  type="number"
                  formControlName="experience"
                ></ion-input>
              </ion-item>
              <ion-item style="margin-bottom:12px;">
                <ion-label position="floating"
                  >Expected Salary/Day (₹)</ion-label
                >
                <ion-input
                  type="number"
                  formControlName="salaryExpectation"
                ></ion-input>
              </ion-item>
            </ng-container>

            <ion-item style="margin-bottom:20px;">
              <ion-label position="floating">Password</ion-label>
              <ion-input type="password" formControlName="password"></ion-input>
            </ion-item>

            <ion-button
              expand="block"
              type="submit"
              [disabled]="isLoading"
              style="--background:#E91E63;--border-radius:12px;height:50px;"
            >
              {{ isLoading ? 'Creating...' : 'Register' }}
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class RegisterPage {
  selectedRole: 'user' | 'maid' = 'user';
  isLoading = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      address: [''],
      skills: [''],
      experience: [0],
      salaryExpectation: [0],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    this.isLoading = true;
    try {
      const v = this.registerForm.value;
      if (this.selectedRole === 'user') {
        await this.authService.registerUser(v);
        this.router.navigate(['/user/home']);
      } else {
        await this.authService.registerMaid({
          ...v,
          skills: v.skills.split(',').map((s: string) => s.trim()),
        });
        const toast = await this.toastCtrl.create({
          message: '✅ Registration submitted! Awaiting admin approval.',
          duration: 3000,
          color: 'success',
        });
        toast.present();
        this.router.navigate(['/auth/login']);
      }
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message || 'Registration failed.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}

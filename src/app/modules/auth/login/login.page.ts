import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton
  ],
  template: `
    <ion-content style="--background:#F9FAFB;">
      <div style="display:flex;flex-direction:column;align-items:center;padding-top:60px;">
        <h1 style="font-family:Poppins;font-weight:700;font-size:28px;color:#1E2A38;margin:0;">🏠 GrihSakhi</h1>
        <p style="color:#666;font-size:14px;margin-top:4px;">Trusted Hands for Your Home</p>
      </div>

      <ion-card style="margin:32px 16px;border-radius:20px;">
        <ion-card-content>
            <h2 style="font-family:Poppins;font-weight:600;color:#ffffff;margin-bottom:20px;">Welcome Back 👋</h2>
          <form [formGroup]="loginForm" (ngSubmit)="login()">
            <ion-item style="margin-bottom:12px;">
              <ion-label position="floating">Email</ion-label>
              <ion-input type="email" formControlName="email"></ion-input>
            </ion-item>

            <ion-item style="margin-bottom:20px;">
              <ion-label position="floating">Password</ion-label>
              <ion-input type="password" formControlName="password"></ion-input>
            </ion-item>

            <ion-button expand="block" type="submit"
              [disabled]="loginForm.invalid || isLoading"
              style="--background:#E91E63;--border-radius:12px;height:50px;">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </ion-button>
          </form>

          <p style="text-align:center;margin-top:16px;color:#666;">
            New here? <a routerLink="/auth/register" style="color:#E91E63;font-weight:600;">Register</a>
          </p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message || 'Login failed!',
        duration: 3000, color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
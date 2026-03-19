import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
    IonIcon,
  ],
  template: `
    <ion-content class="login-container">
      <!-- Animated Background -->
      <div class="animated-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>

      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="header-section">
          <div class="logo-container">
            <div class="logo-icon">🏠</div>
          </div>
          <h1 class="app-title">GrihSakhi</h1>
          <p class="app-subtitle">Trusted Hands for Your Home</p>
        </div>

        <!-- Login Card -->
        <ion-card class="login-card">
          <ion-card-content class="card-content">
            <h2 class="card-title">Welcome Back</h2>
            <p class="card-subtitle">Sign in to your account</p>

            <form
              [formGroup]="loginForm"
              (ngSubmit)="login()"
              class="login-form"
            >
              <!-- Email Input -->
              <div class="input-group">
                <div class="input-icon">✉️</div>
                <ion-input
                  type="email"
                  formControlName="email"
                  class="input-field"
                  placeholder="you@example.com"
                ></ion-input>
              </div>

              <!-- Password Input with Eye Icon -->
              <div class="input-group">
                <div class="input-icon">🔐</div>
                <ion-input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="input-field"
                  placeholder="••••••••"
                ></ion-input>
                <ion-icon
                  [name]="showPassword ? 'eye-off-outline' : 'eye-outline'"
                  (click)="togglePassword()"
                  class="eye-icon"
                ></ion-icon>
              </div>

              <!-- Submit Button -->
              <ion-button
                expand="block"
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="login-btn"
              >
                <span *ngIf="!isLoading" class="btn-text">Sign In</span>
                <span *ngIf="isLoading" class="btn-text loading">
                  <span class="spinner"></span> Signing in...
                </span>
              </ion-button>
            </form>

            <!-- Divider -->
            <div class="divider">
              <span class="divider-text">New to GrihSakhi?</span>
            </div>

            <!-- Register Link -->
            <p class="register-text">
              <a routerLink="/auth/register" class="register-link"
                >Create an account</a
              >
            </p>
          </ion-card-content>
        </ion-card>

        <!-- Footer Info -->
        <div class="footer-info">
          <p class="footer-text">Secure login with Firebase</p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .login-container {
        --background: linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 50%,
          #0f172a 100%
        );
        position: relative;
        overflow: hidden;
      }

      .animated-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
      }

      .blob {
        position: absolute;
        opacity: 0.1;
        filter: blur(40px);
        border-radius: 50%;
        animation: float 8s ease-in-out infinite;
      }

      .blob-1 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, #ec4899, #f43f5e);
        top: -50px;
        right: -50px;
        animation-delay: 0s;
      }

      .blob-2 {
        width: 200px;
        height: 200px;
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        bottom: 20%;
        left: -50px;
        animation-delay: 2s;
      }

      .blob-3 {
        width: 250px;
        height: 250px;
        background: linear-gradient(135deg, #06b6d4, #0891b2);
        bottom: -50px;
        right: 10%;
        animation-delay: 4s;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(30px);
        }
      }

      .content-wrapper {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding: 24px;
        justify-content: center;
      }

      .header-section {
        text-align: center;
        margin-bottom: 40px;
        animation: slideDown 0.8s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .logo-container {
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
      }

      .logo-icon {
        font-size: 56px;
        animation: bounce 2s ease-in-out infinite;
      }

      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .app-title {
        font-size: 32px;
        font-weight: 700;
        background: linear-gradient(135deg, #ec4899, #f43f5e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 8px;
        font-family: 'Poppins', sans-serif;
        letter-spacing: -0.5px;
      }

      .app-subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
        font-weight: 500;
      }

      .login-card {
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(236, 72, 153, 0.2);
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin: 0;
        animation: slideUp 0.8s ease-out 0.2s both;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .card-content {
        padding: 32px 24px;
      }

      .card-title {
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin: 0 0 8px;
        font-family: 'Poppins', sans-serif;
      }

      .card-subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0 0 24px;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .input-group {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        transition: all 0.3s ease;
      }

      .input-group:focus-within {
        background: rgba(236, 72, 153, 0.1);
        border-color: rgba(236, 72, 153, 0.5);
        box-shadow: 0 0 16px rgba(236, 72, 153, 0.2);
      }

      .input-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .input-field {
        --background: transparent;
        --border-radius: 0;
        --padding-start: 0;
        --padding-end: 0;
        --box-shadow: none;
        flex: 1;
        color: white;
        font-size: 16px;
      }

      .eye-icon {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      .eye-icon:hover {
        color: #ec4899;
        transform: scale(1.1);
      }

      .login-btn {
        --background: linear-gradient(135deg, #ec4899, #f43f5e);
        --border-radius: 12px;
        height: 48px;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 0.5px;
        margin-top: 8px;
        text-transform: uppercase;
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
        transition: all 0.3s ease;
      }

      .login-btn:not([disabled]):active {
        transform: scale(0.98);
      }

      .login-btn[disabled] {
        opacity: 0.6;
      }

      .btn-text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .btn-text.loading {
        font-size: 14px;
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

      .divider {
        margin: 24px 0;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
      }

      .divider-text {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }

      .register-text {
        text-align: center;
        margin: 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }

      .register-link {
        color: #ec4899;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s ease;
        position: relative;
      }

      .register-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: #ec4899;
        transition: width 0.3s ease;
      }

      .register-link:hover::after {
        width: 100%;
      }

      .footer-info {
        text-align: center;
        margin-top: 40px;
        animation: fadeIn 1s ease-out 0.6s both;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .footer-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
      }
    `,
  ],
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController,
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}

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
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
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
    <ion-header class="modern-header">
      <ion-toolbar class="modern-toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            class="back-button"
            defaultHref="/auth/login"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="header-title">Create Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="register-container">
      <!-- Progress Indicator -->
      <div class="progress-container">
        <div
          class="progress-bar"
          [style.width.%]="selectedRole === 'user' ? 50 : 100"
        ></div>
      </div>

      <!-- Role Selector Card -->
      <div class="role-selector-wrapper">
        <div class="role-info">
          <h2 class="role-title">Who are you?</h2>
          <p class="role-subtitle">Choose your account type to get started</p>
        </div>

        <ion-segment [(ngModel)]="selectedRole" class="modern-segment">
          <ion-segment-button value="user" class="segment-btn">
            <span class="role-emoji">👤</span>
            <span class="role-label">Homeowner</span>
          </ion-segment-button>
          <ion-segment-button value="maid" class="segment-btn">
            <span class="role-emoji">🧹</span>
            <span class="role-label">Service Provider</span>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Registration Form Card -->
      <ion-card class="register-card">
        <ion-card-content class="card-content">
          <form
            [formGroup]="registerForm"
            (ngSubmit)="register()"
            class="register-form"
          >
            <!-- Common Fields -->
            <div class="form-section">
              <h3 class="section-title">Personal Information</h3>

              <div class="input-group">
                <div class="input-icon">👤</div>
                <ion-input
                  formControlName="name"
                  class="input-field"
                  placeholder="Full Name"
                >
                </ion-input>
              </div>

              <div class="input-group">
                <div class="input-icon">✉️</div>
                <ion-input
                  type="email"
                  formControlName="email"
                  class="input-field"
                  placeholder="Email Address"
                >
                </ion-input>
              </div>

              <div class="input-group">
                <div class="input-icon">📱</div>
                <ion-input
                  type="tel"
                  formControlName="phone"
                  class="input-field"
                  placeholder="Phone Number"
                >
                </ion-input>
              </div>

              <div class="input-group">
                <div class="input-icon">📍</div>
                <ion-input
                  formControlName="city"
                  class="input-field"
                  placeholder="City"
                >
                </ion-input>
              </div>
            </div>

            <!-- Maid-Specific Fields -->
            <ng-container *ngIf="selectedRole === 'maid'">
              <div class="form-section maid-section">
                <h3 class="section-title">Professional Details</h3>

                <div class="input-group">
                  <div class="input-icon">🏠</div>
                  <ion-input
                    formControlName="address"
                    class="input-field"
                    placeholder="Home Address"
                  >
                  </ion-input>
                </div>

                <div class="input-group">
                  <div class="input-icon">🎯</div>
                  <ion-input
                    formControlName="skills"
                    class="input-field"
                    placeholder="Skills (e.g., Cooking, Cleaning)"
                  >
                  </ion-input>
                </div>

                <div class="input-row">
                  <div class="input-group flex-half">
                    <div class="input-icon">📅</div>
                    <ion-input
                      type="number"
                      formControlName="experience"
                      class="input-field"
                      placeholder="Experience (years)"
                    >
                    </ion-input>
                  </div>

                  <div class="input-group flex-half">
                    <div class="input-icon">💰</div>
                    <ion-input
                      type="number"
                      formControlName="salaryExpectation"
                      class="input-field"
                      placeholder="Salary/Day (₹)"
                    >
                    </ion-input>
                  </div>
                </div>

                <div class="info-box">
                  <span class="info-icon">ℹ️</span>
                  <p class="info-text">
                    Your profile will be reviewed by our admin team before
                    approval
                  </p>
                </div>
              </div>
            </ng-container>

            <!-- Password Section -->
            <div class="form-section">
              <h3 class="section-title">Security</h3>

              <div class="input-group">
                <div class="input-icon">🔐</div>
                <ion-input
                  type="password"
                  formControlName="password"
                  class="input-field"
                  placeholder="Password"
                >
                </ion-input>
              </div>

              <div class="password-info">
                <p class="password-hint">Minimum 6 characters</p>
              </div>
            </div>

            <!-- Submit Button -->
            <ion-button
              expand="block"
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="register-btn"
            >
              <span *ngIf="!isLoading" class="btn-text">Create Account</span>
              <span *ngIf="isLoading" class="btn-text loading">
                <span class="spinner"></span> Creating...
              </span>
            </ion-button>

            <!-- Terms -->
            <p class="terms-text">
              By creating an account, you agree to our
              <a href="#" class="terms-link">Terms of Service</a> and
              <a href="#" class="terms-link">Privacy Policy</a>
            </p>
          </form>
        </ion-card-content>
      </ion-card>

      <!-- Login Link -->
      <div class="login-footer">
        <p class="login-text">
          Already have an account?
          <a routerLink="/auth/login" class="login-link">Sign In</a>
        </p>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .modern-header {
        --background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
      }

      .modern-toolbar {
        --padding-start: 0;
        --padding-end: 0;
        --min-height: 64px;
        background: transparent;
      }

      .header-title {
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 20px;
        color: white;
        letter-spacing: -0.5px;
      }

      .back-button {
        --color: #ec4899;
        --icon-font-size: 28px;
      }

      .register-container {
        --background: linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 50%,
          #0f172a 100%
        );
        padding: 24px 16px;
      }

      .progress-container {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 32px;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #ec4899, #f43f5e);
        border-radius: 4px;
        transition: width 0.3s ease;
        box-shadow: 0 0 12px rgba(236, 72, 153, 0.5);
      }

      .role-selector-wrapper {
        margin-bottom: 32px;
        animation: slideDown 0.6s ease-out;
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

      .role-info {
        text-align: center;
        margin-bottom: 24px;
      }

      .role-title {
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin: 0 0 8px;
        font-family: 'Poppins', sans-serif;
      }

      .role-subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
      }

      .modern-segment {
        --background: transparent;
        gap: 12px;
        display: flex;
      }

      .segment-btn {
        --padding-start: 0;
        --padding-end: 0;
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        transition: all 0.3s ease;
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        font-weight: 600;
      }

      .segment-btn.segment-button-checked {
        background: linear-gradient(
          135deg,
          rgba(236, 72, 153, 0.2),
          rgba(244, 63, 94, 0.2)
        );
        border-color: #ec4899;
        color: white;
        box-shadow: 0 0 16px rgba(236, 72, 153, 0.3);
      }

      .role-emoji {
        font-size: 28px;
      }

      .role-label {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .register-card {
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(236, 72, 153, 0.15);
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin: 0 0 32px;
        animation: slideUp 0.6s ease-out 0.1s both;
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
        padding: 28px 20px;
      }

      .register-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .form-section {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .form-section.maid-section {
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .section-title {
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 8px;
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

      .input-group.flex-half {
        flex: 1;
      }

      .input-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .input-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .input-field {
        --background: transparent;
        --border-radius: 0;
        --box-shadow: none;
        --padding-start: 0;
        --padding-end: 0;
        flex: 1;
        color: white;
        font-size: 15px;
      }

      .info-box {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: rgba(236, 72, 153, 0.1);
        border: 1px solid rgba(236, 72, 153, 0.3);
        border-radius: 12px;
        padding: 12px;
        margin-top: 8px;
      }

      .info-icon {
        font-size: 16px;
        flex-shrink: 0;
      }

      .info-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
        line-height: 1.5;
      }

      .password-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .password-hint {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        font-weight: 500;
      }

      .register-btn {
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

      .register-btn:not([disabled]):active {
        transform: scale(0.98);
      }

      .register-btn[disabled] {
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

      .terms-text {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        margin: 8px 0 0;
        line-height: 1.6;
      }

      .terms-link {
        color: #ec4899;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .terms-link:hover {
        color: #f43f5e;
      }

      .login-footer {
        text-align: center;
        padding: 24px 0;
        animation: fadeIn 0.6s ease-out 0.3s both;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .login-text {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }

      .login-link {
        color: #ec4899;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s ease;
        position: relative;
      }

      .login-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: #ec4899;
        transition: width 0.3s ease;
      }

      .login-link:hover::after {
        width: 100%;
      }
    `,
  ],
})
export class RegisterPage {
  selectedRole: 'user' | 'maid' = 'user';
  isLoading = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
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
        this.router.navigate(['/auth/login']);
      }
    } catch (err: any) {
      console.error('Register error:', err.message);
    } finally {
      this.isLoading = false;
    }
  }
}

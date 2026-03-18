import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonBadge,
  IonAvatar,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  star,
  locationOutline,
  briefcaseOutline,
  cashOutline,
  checkmarkCircleOutline,
  timeOutline,
} from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import type { MaidModel } from '../../../core/models/maid.model';

@Component({
  selector: 'app-maid-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonBadge,
    IonAvatar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonIcon,
  ],
  template: `
    <ion-header class="profile-header">
      <ion-toolbar class="profile-toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            class="back-button"
            defaultHref="/user/home"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="header-title">Service Provider</ion-title>
        <ion-buttons slot="end">
          <ion-button class="share-btn">
            <span>📤</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-container" *ngIf="maid">
      <!-- Hero Section with Background -->
      <div class="hero-banner">
        <div class="hero-gradient"></div>
        <ion-avatar class="hero-avatar">
          <img
            [src]="
              maid.profileImage ||
              'https://ionicframework.com/docs/img/demos/avatar.svg'
            "
          />
        </ion-avatar>
      </div>

      <!-- Profile Info Card -->
      <ion-card class="profile-info-card">
        <ion-card-content class="info-content">
          <h1 class="profile-name">{{ maid.name }}</h1>
          <p class="profile-location">
            <span class="location-icon">📍</span>
            {{ maid.city }}
          </p>

          <!-- Rating Section -->
          <div class="rating-section">
            <div class="rating-display">
              <div class="rating-circle">
                <span class="rating-number">{{ maid.rating || 'N/A' }}</span>
                <span class="rating-icon">⭐</span>
              </div>
            </div>
            <div class="rating-info">
              <p class="rating-count">{{ maid.totalReviews }} reviews</p>
              <p class="rating-text">
                {{
                  maid.rating >= 4.5
                    ? 'Excellent service'
                    : maid.rating >= 3.5
                      ? 'Good service'
                      : 'Getting started'
                }}
              </p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="quick-stats">
            <div class="stat-card experience-card">
              <span class="stat-icon">📅</span>
              <span class="stat-value">{{ maid.experience }}+</span>
              <span class="stat-label">Years Experience</span>
            </div>
            <div class="stat-card salary-card">
              <span class="stat-icon">💰</span>
              <span class="stat-value">₹{{ maid.salaryExpectation }}</span>
              <span class="stat-label">Per Day</span>
            </div>
            <div
              class="stat-card availability-card"
              [class.available]="maid.isAvailable"
            >
              <span class="stat-icon">✅</span>
              <span class="stat-value">{{
                maid.isAvailable ? 'Available' : 'Busy'
              }}</span>
              <span class="stat-label">Status</span>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- About Section -->
      <div class="section">
        <h2 class="section-title">About</h2>
        <ion-card class="content-card">
          <ion-card-content>
            <p class="about-text">
              {{ maid.experience }}-year experienced professional specializing
              in {{ maid.skills[0] }}. Dedicated to providing quality service
              with attention to detail and reliability.
            </p>

            <div class="badges-row">
              <ion-badge class="verified-badge" color="success">
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                Verified Profile
              </ion-badge>
              <ion-badge class="badge-item" color="warning">
                <ion-icon name="time-outline"></ion-icon>
                Punctual
              </ion-badge>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Skills Section -->
      <div class="section">
        <h2 class="section-title">Professional Skills</h2>
        <ion-card class="content-card">
          <ion-card-content class="skills-content">
            <div class="skills-grid">
              <div *ngFor="let skill of maid.skills" class="skill-item">
                <span class="skill-emoji">{{ getSkillEmoji(skill) }}</span>
                <span class="skill-name">{{ skill }}</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Details Section -->
      <div class="section">
        <h2 class="section-title">Details</h2>
        <ion-card class="content-card">
          <ion-card-content class="details-content">
            <div class="detail-item">
              <span class="detail-icon">📧</span>
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ maid.email }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📱</span>
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ maid.phone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📍</span>
              <span class="detail-label">Service Area:</span>
              <span class="detail-value">{{ maid.city }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-label">Member Since:</span>
              <span class="detail-value">{{ formatDate(maid.createdAt) }}</span>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Premium Reviews Section -->
      <div class="section">
        <h2 class="section-title">Recent Reviews</h2>

        <!-- Review Card 1 -->
        <ion-card class="review-card">
          <ion-card-content class="review-card-content">
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">👩‍💼</div>
                <div class="reviewer-details">
                  <h4 class="reviewer-name">Sarah Johnson</h4>
                  <p class="review-date">2 weeks ago</p>
                </div>
              </div>
              <div class="rating-stars">⭐⭐⭐⭐⭐</div>
            </div>
            <p class="review-text">
              "Amazing service! Very professional and punctual. She cleaned
              every corner of my house with great attention to detail."
            </p>
            <div class="review-footer">
              <span class="verified-tag">✓ Verified Booking</span>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Review Card 2 -->
        <ion-card class="review-card">
          <ion-card-content class="review-card-content">
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">👨‍💼</div>
                <div class="reviewer-details">
                  <h4 class="reviewer-name">Rajesh Patel</h4>
                  <p class="review-date">1 month ago</p>
                </div>
              </div>
              <div class="rating-stars">⭐⭐⭐⭐⭐</div>
            </div>
            <p class="review-text">
              "Highly recommended. Best cleaning service in town. Always arrives
              on time and does an excellent job."
            </p>
            <div class="review-footer">
              <span class="verified-tag">✓ Verified Booking</span>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Review Card 3 -->
        <ion-card class="review-card">
          <ion-card-content class="review-card-content">
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">👩‍🦰</div>
                <div class="reviewer-details">
                  <h4 class="reviewer-name">Priya Sharma</h4>
                  <p class="review-date">3 weeks ago</p>
                </div>
              </div>
              <div class="rating-stars">⭐⭐⭐⭐⭐</div>
            </div>
            <p class="review-text">
              "Professional, courteous, and reliable. She takes pride in her
              work. I've been using her service for 6 months now."
            </p>
            <div class="review-footer">
              <span class="verified-tag">✓ Verified Booking</span>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <ion-button
          expand="block"
          class="book-now-btn"
          [routerLink]="['/user/booking', maid.uid]"
        >
          <span class="btn-icon">📅</span>
          Book Now
        </ion-button>
        <ion-button expand="block" fill="outline" class="message-btn">
          <span class="btn-icon">💬</span>
          Send Message
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .profile-header {
        --background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
      }

      .profile-toolbar {
        --min-height: 64px;
        --padding-start: 0;
        --padding-end: 0;
      }

      .header-title {
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        color: white;
        font-size: 18px;
      }

      .back-button,
      .share-btn {
        --color: white;
        --icon-font-size: 24px;
        --padding-start: 16px;
        --padding-end: 16px;
      }

      .profile-container {
        --background: #fafafa;
      }

      .hero-banner {
        position: relative;
        height: 200px;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-gradient {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 300px;
        height: 300px;
        background: radial-gradient(
          circle,
          rgba(236, 72, 153, 0.2) 0%,
          transparent 70%
        );
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(20px);
        }
      }

      .hero-avatar {
        width: 120px;
        height: 120px;
        position: relative;
        z-index: 2;
        box-shadow: 0 12px 32px rgba(236, 72, 153, 0.3);
        border: 4px solid white;
      }

      .profile-info-card {
        border-radius: 24px;
        margin: -40px 16px 16px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        border: none;
      }

      .info-content {
        padding: 24px 20px;
        text-align: center;
      }

      .profile-name {
        font-size: 24px;
        font-weight: 700;
        color: #f5f5f9;
        margin: 0 0 8px;
        font-family: 'Poppins', sans-serif;
      }

      .profile-location {
        font-size: 14px;
        color: #666;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .location-icon {
        font-size: 16px;
      }

      .rating-section {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 0;
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
        margin: 16px 0;
      }

      .rating-display {
        flex-shrink: 0;
      }

      .rating-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ec4899, #f43f5e);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
      }

      .rating-number {
        font-size: 28px;
        font-weight: 700;
        color: white;
        font-family: 'Poppins', sans-serif;
      }

      .rating-icon {
        font-size: 24px;
        animation: bounce 2s ease-in-out infinite;
      }

      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-4px);
        }
      }

      .rating-info {
        flex: 1;
        text-align: left;
      }

      .rating-count {
        font-size: 16px;
        font-weight: 700;
        color: #3bd543;
        margin: 0;
      }

      .rating-text {
        font-size: 12px;
        color: #666;
        margin: 4px 0 0;
      }

      .quick-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 16px;
      }

      .stat-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        border-radius: 14px;
        background: #f0f0f0;
        transition: all 0.3s ease;
      }

      .stat-card.experience-card {
        background: linear-gradient(
          135deg,
          rgba(59, 130, 246, 0.1),
          rgba(99, 102, 241, 0.1)
        );
      }

      .stat-card.salary-card {
        background: linear-gradient(
          135deg,
          rgba(255, 253, 254, 0.1),
          rgba(252, 251, 251, 0.1)
        );
      }

      .stat-card.availability-card {
        background: linear-gradient(
          135deg,
          rgba(249, 115, 22, 0.1),
          rgba(217, 119, 6, 0.1)
        );
      }

      .stat-card.availability-card.available {
        background: linear-gradient(
          135deg,
          rgba(34, 197, 94, 0.1),
          rgba(22, 163, 74, 0.1)
        );
      }

      .stat-icon {
        font-size: 24px;
      }

      .stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
      }

      .stat-label {
        font-size: 11px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }

      .section {
        padding: 20px 16px 0;
      }

      .section-title {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: 'Poppins', sans-serif;
      }

      .content-card {
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        border: none;
        margin: 0 0 20px;
      }

      .about-text {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin: 0 0 16px;
      }

      .badges-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .verified-badge,
      .badge-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
      }

      .skills-content {
        padding: 16px;
      }

      .skills-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .skill-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f0f0f0;
        border-radius: 10px;
        transition: all 0.3s ease;
      }

      .skill-item:active {
        transform: scale(0.98);
      }

      .skill-emoji {
        font-size: 24px;
      }

      .skill-name {
        font-size: 13px;
        font-weight: 600;
        color: #1e293b;
      }

      .details-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f0f0f0;
        border-radius: 10px;
      }

      .detail-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .detail-label {
        font-size: 12px;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        flex-shrink: 0;
      }

      .detail-value {
        font-size: 13px;
        font-weight: 600;
        color: #1e293b;
        flex: 1;
        text-align: right;
      }

      /* ===== PREMIUM REVIEWS SECTION ===== */
      .review-card {
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(236, 72, 153, 0.15);
        margin: 0 0 16px;
        transition: all 0.3s ease;
        background: white;
      }

      .review-card:hover {
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
        border-color: rgba(236, 72, 153, 0.3);
        transform: translateY(-2px);
      }

      .review-card-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }

      .reviewer-info {
        display: flex;
        gap: 10px;
        flex: 1;
      }

      .reviewer-avatar {
        font-size: 32px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          135deg,
          rgba(236, 72, 153, 0.15),
          rgba(244, 63, 94, 0.1)
        );
        border-radius: 50%;
        flex-shrink: 0;
      }

      .reviewer-details {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .reviewer-name {
        font-size: 13px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }

      .review-date {
        font-size: 11px;
        color: #999;
        margin: 0;
      }

      .rating-stars {
        font-size: 13px;
        letter-spacing: 1px;
        white-space: nowrap;
      }

      .review-text {
        font-size: 13px;
        color: #666;
        line-height: 1.6;
        margin: 0;
        font-style: italic;
        font-weight: 500;
      }

      .review-footer {
        display: flex;
        gap: 8px;
        padding-top: 8px;
      }

      .verified-tag {
        background: linear-gradient(
          135deg,
          rgba(34, 197, 94, 0.15),
          rgba(22, 163, 74, 0.1)
        );
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #22c55e;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .cta-section {
        padding: 24px 16px 40px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .book-now-btn {
        --background: linear-gradient(135deg, #ec4899, #f43f5e);
        --border-radius: 12px;
        height: 48px;
        font-weight: 700;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .message-btn {
        --border-radius: 12px;
        height: 48px;
        --border: 2px solid #ec4899;
        --color: #ec4899;
        font-weight: 700;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .btn-icon {
        font-size: 18px;
      }
    `,
  ],
})
export class MaidProfilePage implements OnInit {
  maid: MaidModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private maidService: MaidService,
  ) {
    addIcons({
      star,
      locationOutline,
      briefcaseOutline,
      cashOutline,
      checkmarkCircleOutline,
      timeOutline,
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.maidService.getMaidById(id).subscribe((m) => (this.maid = m));
  }

  getSkillEmoji(skill: string): string {
    const emojis: { [key: string]: string } = {
      Cooking: '👨‍🍳',
      Cleaning: '🧹',
      Laundry: '👕',
      Childcare: '👶',
      Gardening: '🌱',
    };
    return emojis[skill] || '✨';
  }

  formatDate(date: any): string {
    if (!date) return 'Recently';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
  }
}

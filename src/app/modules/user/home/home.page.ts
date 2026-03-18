import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonSearchbar,
  IonChip,
  IonAvatar,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline, logOutOutline, starOutline, star } from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import { AuthService } from '../../../core/services/auth.service';
import type { MaidModel } from '../../../core/models/maid.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonSearchbar,
    IonChip,
    IonAvatar,
    IonIcon,
    IonTabBar,
    IonTabButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonLabel,
  ],
  template: `
    <ion-header class="premium-header">
      <ion-toolbar class="premium-toolbar">
        <ion-title class="premium-title">GrihSakhi 🏠</ion-title>
        <ion-buttons slot="end">
          <ion-button class="logout-btn" (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="premium-content">
      <!-- Hero Section with Blur Background -->
      <div class="hero-section">
        <div class="hero-blur"></div>
        <div class="hero-inner">
          <h2 class="greeting-title">Hello, {{ userName }}! 👋</h2>
          <p class="greeting-subtitle">Find trusted help for your home</p>

          <!-- Premium Search Bar -->
          <div class="search-wrapper">
            <div class="search-icon">🔍</div>
            <ion-searchbar
              [(ngModel)]="searchCity"
              placeholder="Search by city..."
              (ionInput)="applyFilters()"
              class="premium-search"
              debounce="300"
            ></ion-searchbar>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <h3 class="filter-title">Professional Skills</h3>
        <div class="skill-chips">
          <ion-chip
            *ngFor="let skill of skillFilters"
            [color]="selectedSkill === skill ? 'primary' : 'medium'"
            (click)="filterBySkill(skill)"
            class="skill-chip"
          >
            {{ skill }}
          </ion-chip>
        </div>
      </div>

      <!-- Maid Listings -->
      <div class="listings-section">
        <div class="listings-header">
          <h3 class="listings-title">{{ filteredMaids.length }} Service Providers</h3>
          <p *ngIf="selectedSkill !== 'All'" class="listings-subtitle">
            {{ selectedSkill }} specialists
          </p>
        </div>

        <div class="maids-grid">
          <ion-card
            *ngFor="let maid of filteredMaids; let i = index"
            [routerLink]="['/user/maid-profile', maid.uid]"
            class="maid-card"
            [style.animation-delay]="(i * 0.08) + 's'"
          >
            <ion-card-content class="card-content">
              <!-- Card Top: Avatar + Name + Rating -->
              <div class="card-top">
                <ion-avatar class="maid-avatar">
                  <img
                    [src]="
                      maid.profileImage ||
                      'https://ionicframework.com/docs/img/demos/avatar.svg'
                    "
                  />
                </ion-avatar>
                <div class="maid-info">
                  <h4 class="maid-name">{{ maid.name }}</h4>
                  <p class="maid-location">📍 {{ maid.city }}</p>
                </div>
                <div class="rating-badge" [ngClass]="{ 'high-rating': maid.rating >= 4 }">
                  <span class="star">⭐</span>
                  <span class="rating-value">{{ maid.rating ? (maid.rating | number: '1.1-1') : 'New' }}</span>
                </div>
              </div>

              <!-- Card Middle: Experience + Price -->
              <div class="card-middle">
                <div class="info-row">
                  <span class="info-item">
                    <span class="icon">💼</span>
                    <span>{{ maid.experience }}y exp</span>
                  </span>
                  <span class="price">₹{{ maid.salaryExpectation }}/day</span>
                </div>

                <!-- Skills Tags -->
                <div class="skills-container">
                  <span *ngFor="let skill of maid.skills.slice(0, 3)" class="skill-badge">
                    {{ skill }}
                  </span>
                  <span *ngIf="maid.skills.length > 3" class="skill-badge more">
                    +{{ maid.skills.length - 3 }}
                  </span>
                </div>
              </div>

              <!-- Card Bottom: CTA Button -->
              <div class="card-bottom">
                <ion-button class="book-btn" (click)="$event.stopPropagation()">
                  Book Now →
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredMaids.length === 0" class="empty-state">
          <div class="empty-emoji">🔍</div>
          <h3>No Providers Found</h3>
          <p>Try a different city or skill</p>
        </div>
      </div>
    </ion-content>

    <!-- Premium Tab Bar -->
    <ion-tab-bar class="premium-tabbar" slot="bottom">
      <ion-tab-button routerLink="/user/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <ion-icon name="home-outline"></ion-icon>
        <ion-label>Discover</ion-label>
      </ion-tab-button>
      <ion-tab-button routerLink="/user/booking-history" routerLinkActive="active">
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-label>Bookings</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
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
        --min-height: 64px;
        --padding-start: 20px;
        --padding-end: 20px;
      }

      .premium-title {
        font-size: 26px;
        font-weight: 700;
        background: linear-gradient(135deg, #ec4899, #f43f5e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-family: 'Poppins', sans-serif;
        margin: 0;
        letter-spacing: -0.5px;
      }

      .logout-btn {
        --color: white;
        --icon-font-size: 24px;
      }

      /* ===== CONTENT ===== */
      .premium-content {
        --background: linear-gradient(180deg, #0f172a 0%, #1a1f2e 100%);
        --padding-bottom: 100px;
      }

      /* ===== HERO SECTION ===== */
      .hero-section {
        position: relative;
        padding: 32px 20px;
        overflow: hidden;
      }

      .hero-blur {
        position: absolute;
        top: -40%;
        right: -20%;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(60px);
        animation: drift 8s ease-in-out infinite;
      }

      @keyframes drift {
        0%, 100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(30px, 30px);
        }
      }

      .hero-inner {
        position: relative;
        z-index: 2;
      }

      .greeting-title {
        color: white;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px;
        font-family: 'Poppins', sans-serif;
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

      .greeting-subtitle {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        margin: 0 0 20px;
        font-weight: 500;
      }

      /* ===== SEARCH BAR ===== */
      .search-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 14px;
        padding: 10px 16px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
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

      .search-wrapper:focus-within {
        background: rgba(236, 72, 153, 0.15);
        border-color: rgba(236, 72, 153, 0.5);
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
      }

      .search-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .premium-search {
        --background: transparent;
        --border-radius: 0;
        --padding-start: 0;
        --padding-end: 0;
        --box-shadow: none;
        flex: 1;
        font-size: 14px;
        color: white;
      }

      /* ===== FILTER SECTION ===== */
      .filter-section {
        padding: 24px 20px 0;
      }

      .filter-title {
        color: white;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 12px;
        font-family: 'Poppins', sans-serif;
      }

      .skill-chips {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 16px;
        scroll-behavior: smooth;
      }

      .skill-chip {
        --padding-start: 12px;
        --padding-end: 12px;
        --border-radius: 10px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* ===== LISTINGS SECTION ===== */
      .listings-section {
        padding: 24px 20px;
      }

      .listings-header {
        margin-bottom: 20px;
      }

      .listings-title {
        color: white;
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 6px;
        font-family: 'Poppins', sans-serif;
      }

      .listings-subtitle {
        color: #ec4899;
        font-size: 12px;
        margin: 0;
        font-weight: 600;
      }

      /* ===== MAID CARDS ===== */
      .maids-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .maid-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(236, 72, 153, 0.3);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        margin: 0;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: cardReveal 0.5s ease-out forwards;
        opacity: 0;
      }

      @keyframes cardReveal {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .maid-card:hover {
        transform: translateY(-4px);
        border-color: rgba(236, 72, 153, 0.6);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 12px 32px rgba(236, 72, 153, 0.2);
      }

      .maid-card:active {
        transform: scale(0.98);
      }

      .card-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* Card Top */
      .card-top {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .maid-avatar {
        width: 56px;
        height: 56px;
        flex-shrink: 0;
        border: 2px solid #ec4899;
        background: linear-gradient(135deg, #ec4899, #f43f5e);
      }

      .maid-info {
        flex: 1;
      }

      .maid-name {
        color: white;
        font-size: 15px;
        font-weight: 700;
        margin: 0;
        font-family: 'Poppins', sans-serif;
      }

      .maid-location {
        color: rgba(69, 248, 96, 0.6);
        font-size: 12px;
        margin: 4px 0 0;
      }

      .rating-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 193, 7, 0.15);
        border: 1px solid rgba(255, 193, 7, 0.4);
        padding: 6px 10px;
        border-radius: 8px;
        color: #ffc107;
        font-weight: 700;
        font-size: 12px;
      }

      .rating-badge.high-rating {
        background: rgba(236, 72, 153, 0.15);
        border-color: rgba(236, 72, 153, 0.4);
        color: #ec4899;
      }

      .star {
        font-size: 11px;
      }

      /* Card Middle */
      .card-middle {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: rgba(248, 248, 248, 0.7);
        font-size: 12px;
        font-weight: 600;
      }

      .icon {
        font-size: 14px;
      }

      .price {
        color: #ec4899;
        font-weight: 700;
        font-size: 14px;
        font-family: 'Poppins', sans-serif;
      }

      .skills-container {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .skill-badge {
        background: rgba(139, 92, 246, 0.15);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: rgba(255, 255, 255, 0.8);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 600;
      }

      .skill-badge.more {
        background: rgba(236, 72, 153, 0.15);
        border-color: rgba(236, 72, 153, 0.3);
        color: #ec4899;
      }

      /* Card Bottom */
      .card-bottom {
        display: flex;
        justify-content: flex-end;
        padding-top: 8px;
      }

      .book-btn {
        --background: linear-gradient(135deg, #ec4899, #f43f5e);
        --border-radius: 10px;
        height: 36px;
        font-weight: 700;
        font-size: 12px;
        --padding-start: 16px;
        --padding-end: 16px;
        box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
      }

      .book-btn:hover {
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
      }

      /* ===== EMPTY STATE ===== */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-emoji {
        font-size: 56px;
        margin-bottom: 16px;
        opacity: 0.4;
      }

      .empty-state h3 {
        color: white;
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 8px;
      }

      .empty-state p {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        margin: 0;
      }

      /* ===== TAB BAR ===== */
      .premium-tabbar {
        --background: rgba(15, 23, 42, 0.98);
        --border: 1px solid rgba(236, 72, 153, 0.2);
        backdrop-filter: blur(10px);
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
      }

      ion-tab-button {
        --color: rgba(255, 255, 255, 0.5);
        --color-selected: #ec4899;
        --padding-bottom: 8px;
        --padding-top: 8px;
      }

      ion-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `,
  ],
})
export class HomePage implements OnInit {
  maids: MaidModel[] = [];
  filteredMaids: MaidModel[] = [];
  searchCity = '';
  selectedSkill = 'All';
  userName = '';
  skillFilters = ['All', 'Cooking', 'Cleaning', 'Laundry', 'Childcare', 'Gardening'];

  constructor(
    private maidService: MaidService,
    private authService: AuthService,
  ) {
    addIcons({ homeOutline, calendarOutline, logOutOutline, starOutline, star });
  }

  ngOnInit() {
    this.authService.getCurrentUserProfile().then((p) => {
      this.userName = p?.name?.split(' ')[0] || 'User';
    });
    this.maidService.getApprovedMaids().subscribe((maids) => {
      this.maids = maids;
      this.filteredMaids = maids;
    });
  }

  filterBySkill(skill: string) {
    this.selectedSkill = skill;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.maids];
    if (this.searchCity) {
      result = result.filter((m) =>
        m.city.toLowerCase().includes(this.searchCity.toLowerCase()),
      );
    }
    if (this.selectedSkill !== 'All') {
      result = result.filter((m) => m.skills.includes(this.selectedSkill));
    }
    this.filteredMaids = result;
  }

  logout() {
    this.authService.logout();
  }
}
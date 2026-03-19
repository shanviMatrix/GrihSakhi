import { Component, OnInit, OnDestroy } from '@angular/core';
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
import {
  homeOutline,
  calendarOutline,
  logOutOutline,
  starOutline,
  star,
} from 'ionicons/icons';
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
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-blur"></div>
        <div class="hero-inner">
          <h2 class="greeting-title">Hello, {{ userName }}! 👋</h2>
          <p class="greeting-subtitle">Find trusted help for your home</p>

          <!-- Search Bar -->
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

      <!-- ===== CAROUSEL SECTION ===== -->
      <div class="carousel-outer">
        <div class="carousel-wrapper">
          <div
            class="carousel-track"
            [style.transform]="'translateX(-' + currentSlide * 100 + '%)'"
          >
            <div class="slide-card" *ngFor="let card of carouselCards">
              <img
                *ngIf="card.image"
                [src]="card.image"
                class="card-bg-img"
                [alt]="card.tag"
              />
              <div
                class="card-color-bg"
                *ngIf="!card.image"
                [style.background]="card.colorBg"
              ></div>
              <div class="card-overlay"></div>
              <div class="card-content">
                <span
                  class="card-tag"
                  [style.background]="card.tagBg"
                  [style.color]="card.tagColor"
                >
                  {{ card.tag }}
                </span>
                <p class="card-title">{{ card.title }}</p>
                <p class="card-desc">{{ card.desc }}</p>
              </div>
            </div>
          </div>

          <button class="nav-btn prev" (click)="prevSlide()">&#8249;</button>
          <button class="nav-btn next" (click)="nextSlide()">&#8250;</button>
        </div>

        <!-- Dots -->
        <div class="dots-row">
          <span
            *ngFor="let c of carouselCards; let i = index"
            class="dot"
            [class.active]="i === currentSlide"
            (click)="goToSlide(i)"
          >
          </span>
        </div>
        <p class="slide-counter">
          {{ currentSlide + 1 }} / {{ carouselCards.length }}
        </p>
      </div>
      <!-- ===== END CAROUSEL ===== -->

      <!-- Skill Filter Chips -->
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
          <h3 class="listings-title">
            {{ filteredMaids.length }} Service Providers
          </h3>
          <p *ngIf="selectedSkill !== 'All'" class="listings-subtitle">
            {{ selectedSkill }} specialists
          </p>
        </div>

        <div class="maids-grid">
          <ion-card
            *ngFor="let maid of filteredMaids; let i = index"
            [routerLink]="['/user/maid-profile', maid.uid]"
            class="maid-card"
            [style.animation-delay]="i * 0.08 + 's'"
          >
            <ion-card-content class="card-content-inner">
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
                <div
                  class="rating-badge"
                  [ngClass]="{ 'high-rating': maid.rating >= 4 }"
                >
                  <span class="star">⭐</span>
                  <span class="rating-value">{{
                    maid.rating ? (maid.rating | number: '1.1-1') : 'New'
                  }}</span>
                </div>
              </div>

              <div class="card-middle">
                <div class="info-row">
                  <span class="info-item">
                    <span class="icon">💼</span>
                    <span>{{ maid.experience }}y exp</span>
                  </span>
                  <span class="price">₹{{ maid.salaryExpectation }}/day</span>
                </div>
                <div class="skills-container">
                  <span
                    *ngFor="let skill of maid.skills.slice(0, 3)"
                    class="skill-badge"
                  >
                    {{ skill }}
                  </span>
                  <span *ngIf="maid.skills.length > 3" class="skill-badge more">
                    +{{ maid.skills.length - 3 }}
                  </span>
                </div>
              </div>

              <div class="card-bottom">
                <ion-button class="book-btn" (click)="$event.stopPropagation()">
                  Book Now →
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <div *ngIf="filteredMaids.length === 0" class="empty-state">
          <div class="empty-emoji">🔍</div>
          <h3>No Providers Found</h3>
          <p>Try a different city or skill</p>
        </div>
      </div>
    </ion-content>

    <!-- Tab Bar -->
    <ion-tab-bar class="premium-tabbar" slot="bottom">
      <ion-tab-button
        routerLink="/user/home"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        <ion-icon name="home-outline"></ion-icon>
        <ion-label>Discover</ion-label>
      </ion-tab-button>
      <ion-tab-button
        routerLink="/user/booking-history"
        routerLinkActive="active"
      >
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

      /* ===== HERO ===== */
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
        background: radial-gradient(
          circle,
          rgba(236, 72, 153, 0.25) 0%,
          transparent 70%
        );
        border-radius: 50%;
        filter: blur(60px);
        animation: drift 8s ease-in-out infinite;
      }
      @keyframes drift {
        0%,
        100% {
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
      }
      .greeting-subtitle {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        margin: 0 0 20px;
        font-weight: 500;
      }
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

      /* ===== CAROUSEL ===== */
      .carousel-outer {
        padding: 0 16px 8px;
      }
      .carousel-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
      }
      .carousel-track {
        display: flex;
        transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
      .slide-card {
        min-width: 100%;
        height: 215px;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.2rem;
        flex-shrink: 0;
      }
      .card-bg-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .card-color-bg {
        position: absolute;
        inset: 0;
      }
      .card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.78) 40%,
          rgba(0, 0, 0, 0.05) 100%
        );
      }
      .card-content {
        position: relative;
        z-index: 2;
      }
      .card-tag {
        display: inline-block;
        font-size: 10px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 20px;
        margin-bottom: 7px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .card-title {
        font-size: 17px;
        font-weight: 600;
        color: #fff;
        line-height: 1.35;
      }
      .card-desc {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.82);
        margin-top: 4px;
      }
      .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 17px;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #222;
      }
      .nav-btn.prev {
        left: 10px;
      }
      .nav-btn.next {
        right: 10px;
      }
      .dots-row {
        display: flex;
        justify-content: center;
        gap: 5px;
        margin-top: 10px;
        flex-wrap: wrap;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s;
      }
      .dot.active {
        background: white;
        transform: scale(1.3);
      }
      .slide-counter {
        text-align: center;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 5px;
      }

      /* ===== FILTER ===== */
      .filter-section {
        padding: 20px 20px 0;
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

      /* ===== LISTINGS ===== */
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
      .card-content-inner {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
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
export class HomePage implements OnInit, OnDestroy {
  maids: MaidModel[] = [];
  filteredMaids: MaidModel[] = [];
  searchCity = '';
  selectedSkill = 'All';
  userName = '';
  skillFilters = [
    'All',
    'Cooking',
    'Cleaning',
    'Laundry',
    'Childcare',
    'Gardening',
  ];

  // ===== CAROUSEL =====
  currentSlide = 0;
  private autoTimer: any;

  carouselCards = [
    {
      image: 'assets/images/Aaya.jpeg',
      tag: '👶 Aaya / Child Care',
      title: 'Bacchon ki dekhbhal, pyaar se',
      desc: 'Trained & verified child caretakers at your door',
      tagBg: '#F4C0D1',
      tagColor: '#4B1528',
      colorBg: '',
    },
    {
      image: 'assets/images/cleaning.jpeg',
      tag: '🧹 Cleaning',
      title: 'Chamakta ghar, khush parivar',
      desc: 'Deep clean & daily sweep — we handle it all',
      tagBg: '#B5D4F4',
      tagColor: '#042C53',
      colorBg: '',
    },
    {
      image: 'assets/images/cooking.jpeg',
      tag: '🍛 Cooking',
      title: 'Ghar jaisa khana, roz fresh',
      desc: 'Trained cooks for daily meals & special occasions',
      tagBg: '#FAC775',
      tagColor: '#412402',
      colorBg: '',
    },
    {
      image: 'assets/images/laundry.jpeg',
      tag: '👕 Laundry',
      title: 'Fresh kapde — bina jhanjhat ke',
      desc: 'Wash, dry, fold & iron — all at home',
      tagBg: '#C0DD97',
      tagColor: '#173404',
      colorBg: '',
    },
    {
      image: 'assets/images/dishwash.jpeg',
      tag: '🍽️ Dishwash',
      title: 'Bartan saaf, tension khatam',
      desc: 'Spotless dishes after every meal, daily',
      tagBg: '#9FE1CB',
      tagColor: '#04342C',
      colorBg: '',
    },
    {
      image: 'assets/images/movers and packers.jpeg',
      tag: '📦 Moving & Packing',
      title: 'Shift karo bina stress ke',
      desc: 'Pack, load & move — professional team ready',
      tagBg: '#CECBF6',
      tagColor: '#26215C',
      colorBg: '',
    },
    {
      image: 'assets/images/offers.jpeg',
      tag: '🎁 Offers',
      title: 'Naye offers, roz naye fayde',
      desc: 'Check daily offers — save on every booking',
      tagBg: '#9FE1CB',
      tagColor: '#04342C',
      colorBg: '#001a0d',
    },
    {
      image: 'assets/images/refer and earn.jpeg',
      tag: '🤝 Refer & Earn',
      title: 'Saheli ko bulao, ₹100 pao!',
      desc: 'Share your code — dono ko milega cashback',
      tagBg: '#B5D4F4',
      tagColor: '#042C53',
      colorBg: '#001220',
    },
    {
      image: '',
      tag: '📅 Monthly Plan',
      title: 'Mahine bhar ki tension khatam — ₹999 se shuru',
      desc: 'Weekly visits, priority booking, extra savings',
      tagBg: '#FAC775',
      tagColor: '#412402',
      colorBg: '#1a0e00',
    },
    {
      image: 'Quick book.jpeg',
      tag: '⚡ Quick Book',
      title: 'Maid at your door in 60 minutes!',
      desc: 'Express service available 7 days a week',
      tagBg: '#F4C0D1',
      tagColor: '#4B1528',
      colorBg: '#180008',
    },
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselCards.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.carouselCards.length) %
      this.carouselCards.length;
  }

  goToSlide(i: number) {
    this.currentSlide = i;
    this.resetTimer();
  }

  private startAutoPlay() {
    this.autoTimer = setInterval(() => this.nextSlide(), 3000);
  }

  private resetTimer() {
    clearInterval(this.autoTimer);
    this.startAutoPlay();
  }
  // ===== END CAROUSEL =====

  constructor(
    private maidService: MaidService,
    private authService: AuthService,
  ) {
    addIcons({
      homeOutline,
      calendarOutline,
      logOutOutline,
      starOutline,
      star,
    });
  }

  ngOnInit() {
    this.authService.getCurrentUserProfile().then((p) => {
      this.userName = p?.name?.split(' ')[0] || 'User';
    });
    this.maidService.getApprovedMaids().subscribe((maids) => {
      this.maids = maids;
      this.filteredMaids = maids;
    });
    this.startAutoPlay();
  }

  ngOnDestroy() {
    clearInterval(this.autoTimer);
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

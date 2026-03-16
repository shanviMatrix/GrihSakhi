import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonLabel,
  IonButton, IonSearchbar, IonChip, IonAvatar, IonBadge,
  IonIcon, IonTabBar, IonTabButton, IonHeader, IonToolbar,
  IonTitle, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline, logOutOutline, starOutline, star } from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import { AuthService } from '../../../core/services/auth.service';
import { MaidModel } from '../../../core/models/maid.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonButton, IonSearchbar, IonChip, IonAvatar, IonBadge,
    IonIcon, IonTabBar, IonTabButton, IonHeader, IonToolbar,
    IonTitle, IonButtons
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title style="font-family:Poppins;font-weight:700;">GrihSakhi 🏠</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">
      <div style="background:linear-gradient(135deg,#E91E63,#1E2A38);padding:24px 20px;color:white;">
        <h2 style="font-family:Poppins;font-weight:700;font-size:22px;margin:0;">Hello, {{ userName }}! 👋</h2>
        <p style="margin:4px 0 16px;opacity:0.85;font-size:14px;">Find trusted help for your home</p>
        <ion-searchbar
          [(ngModel)]="searchCity"
          placeholder="Search by city..."
          (ionInput)="applyFilters()"
          style="--background:rgba(255,255,255,0.15);--color:white;--placeholder-color:rgba(255,255,255,0.7);--border-radius:12px;">
        </ion-searchbar>
      </div>

      <div style="padding:16px 20px 0;">
        <h3 style="font-family:Poppins;font-weight:600;color:#1E2A38;margin-bottom:10px;">Filter by Skill</h3>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;">
          <ion-chip *ngFor="let skill of skillFilters"
            [color]="selectedSkill === skill ? 'primary' : 'medium'"
            (click)="filterBySkill(skill)">
            {{ skill }}
          </ion-chip>
        </div>
      </div>

      <div style="padding:16px;">
        <h3 style="font-family:Poppins;font-weight:600;color:#1E2A38;margin-bottom:12px;">
          Available Maids ({{ filteredMaids.length }})
        </h3>

        <ion-card *ngFor="let maid of filteredMaids"
          [routerLink]="['/user/maid-profile', maid.uid]"
          style="border-radius:16px;cursor:pointer;margin-bottom:12px;">
          <ion-card-content>
            <div style="display:flex;align-items:center;gap:12px;">
              <ion-avatar style="width:60px;height:60px;flex-shrink:0;">
                <img [src]="maid.profileImage || 'https://ionicframework.com/docs/img/demos/avatar.svg'">
              </ion-avatar>
              <div style="flex:1;">
                <h4 style="font-family:Poppins;font-weight:600;color:#1E2A38;margin:0;font-size:16px;">{{ maid.name }}</h4>
                <p style="color:#666;font-size:12px;margin:2px 0;">📍 {{ maid.city }} • {{ maid.experience }} yrs exp</p>
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">
                  <ion-badge *ngFor="let skill of maid.skills.slice(0,3)" color="light"
                    style="font-size:10px;color:#E91E63;">{{ skill }}</ion-badge>
                </div>
              </div>
              <div style="text-align:right;">
                <p style="font-family:Poppins;font-weight:700;color:#E91E63;font-size:16px;margin:0;">₹{{ maid.salaryExpectation }}</p>
                <p style="font-size:11px;color:#666;margin:0;">/day</p>
                <div style="margin-top:4px;">
                  <ion-icon name="star" style="color:#FFC107;font-size:12px;"></ion-icon>
                  <span style="font-size:12px;color:#666;">{{ maid.rating || 'New' }}</span>
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <p *ngIf="filteredMaids.length === 0"
          style="text-align:center;color:#999;padding:40px 0;">
          No maids found. Try a different city or skill.
        </p>
      </div>
    </ion-content>

    <ion-tab-bar slot="bottom" style="--background:#fff;">
      <ion-tab-button routerLink="/user/home">
        <ion-icon name="home-outline"></ion-icon>
        <ion-label>Home</ion-label>
      </ion-tab-button>
      <ion-tab-button routerLink="/user/booking-history">
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-label>Bookings</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  `
})
export class HomePage implements OnInit {
  maids: MaidModel[] = [];
  filteredMaids: MaidModel[] = [];
  searchCity = '';
  selectedSkill = 'All';
  userName = '';
  skillFilters = ['All', 'Cooking', 'Cleaning', 'Laundry', 'Childcare', 'Gardening'];

  constructor(private maidService: MaidService, private authService: AuthService) {
    addIcons({ homeOutline, calendarOutline, logOutOutline, starOutline, star });
  }

  ngOnInit() {
    this.authService.getCurrentUserProfile().then(p => {
      this.userName = p?.name || 'User';
    });
    this.maidService.getApprovedMaids().subscribe(maids => {
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
      result = result.filter(m => m.city.toLowerCase().includes(this.searchCity.toLowerCase()));
    }
    if (this.selectedSkill !== 'All') {
      result = result.filter(m => m.skills.includes(this.selectedSkill));
    }
    this.filteredMaids = result;
  }

  logout() { this.authService.logout(); }
}
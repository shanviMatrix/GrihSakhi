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
} from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import { MaidModel } from '../../../core/models/maid.model';

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
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"
          ><ion-back-button defaultHref="/user/home"></ion-back-button
        ></ion-buttons>
        <ion-title style="font-family:Poppins;">Maid Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">
      <div *ngIf="maid">
        <div
          style="background:linear-gradient(135deg,#E91E63,#1E2A38);padding:32px 20px;text-align:center;"
        >
          <ion-avatar style="width:90px;height:90px;margin:0 auto 12px;">
            <img
              [src]="
                maid.profileImage ||
                'https://ionicframework.com/docs/img/demos/avatar.svg'
              "
            />
          </ion-avatar>
          <h2 style="font-family:Poppins;font-weight:700;color:white;margin:0;">
            {{ maid.name }}
          </h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0;">
            📍 {{ maid.city }}
          </p>
          <div
            style="display:flex;justify-content:center;gap:4px;margin-top:8px;"
          >
            <ion-icon name="star" style="color:#FFC107;"></ion-icon>
            <span style="color:white;">{{ maid.rating || 'New' }}</span>
            <span style="color:rgba(255,255,255,0.7);"
              >({{ maid.totalReviews }} reviews)</span
            >
          </div>
        </div>

        <ion-card style="margin:16px;border-radius:16px;">
          <ion-card-content>
            <div
              style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center;margin-bottom:16px;"
            >
              <div style="background:#FFF0F5;border-radius:12px;padding:12px;">
                <p
                  style="font-family:Poppins;font-weight:700;color:#E91E63;font-size:18px;margin:0;"
                >
                  {{ maid.experience }}
                </p>
                <p style="color:#666;font-size:11px;margin:0;">Yrs Exp</p>
              </div>
              <div style="background:#FFF0F5;border-radius:12px;padding:12px;">
                <p
                  style="font-family:Poppins;font-weight:700;color:#E91E63;font-size:18px;margin:0;"
                >
                  ₹{{ maid.salaryExpectation }}
                </p>
                <p style="color:#666;font-size:11px;margin:0;">Per Day</p>
              </div>
              <div style="background:#FFF0F5;border-radius:12px;padding:12px;">
                <p
                  style="font-family:Poppins;font-weight:700;color:#E91E63;font-size:18px;margin:0;"
                >
                  {{ maid.totalReviews }}
                </p>
                <p style="color:#666;font-size:11px;margin:0;">Reviews</p>
              </div>
            </div>

            <h4
              style="font-family:Poppins;font-weight:600;color:#1E2A38;margin-bottom:8px;"
            >
              Skills
            </h4>
            <div
              style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;"
            >
              <ion-badge
                *ngFor="let skill of maid.skills"
                color="primary"
                style="padding:8px 12px;border-radius:20px;font-size:13px;"
                >{{ skill }}</ion-badge
              >
            </div>

            <ion-button
              expand="block"
              [routerLink]="['/user/booking', maid.uid]"
              style="--background:#E91E63;--border-radius:12px;height:50px;margin-top:8px;"
            >
              📅 Book Now
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
})
export class MaidProfilePage implements OnInit {
  maid: MaidModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private maidService: MaidService,
  ) {
    addIcons({ star, locationOutline, briefcaseOutline, cashOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.maidService.getMaidById(id).subscribe((m) => (this.maid = m));
  }
}

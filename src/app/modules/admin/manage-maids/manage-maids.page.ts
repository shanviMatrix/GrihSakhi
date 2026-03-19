import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonBadge,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonAvatar,
  ToastController,
} from '@ionic/angular/standalone';
import { MaidService } from '../../../core/services/maid.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { MaidModel } from '../../../core/models/maid.model';

@Component({
  selector: 'app-manage-maids',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonBadge,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonAvatar,
  ],
  template: `
    <ion-header>
      <ion-toolbar
        style="--background:linear-gradient(135deg,#E91E63,#1E2A38);"
      >
        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/admin/dashboard"
            style="color:white;"
          ></ion-back-button>
        </ion-buttons>
        <ion-title style="font-family:Poppins;color:white;"
          >Maid Approvals</ion-title
        >
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">
      <!-- Custom Tab Buttons - All Always Visible -->
      <div
        style="display:flex;gap:8px;padding:16px;background:white;margin:16px;border-radius:12px;box-shadow:0 2px 4px rgba(0,0,0,0.1);"
      >
        <button
          (click)="activeTab = 'pending'"
          [style.background]="
            activeTab === 'pending' ? '#E91E63' : 'transparent'
          "
          [style.color]="activeTab === 'pending' ? 'white' : '#666'"
          style="flex:1;padding:12px;border:none;border-radius:8px;font-family:Poppins;font-weight:500;font-size:13px;cursor:pointer;transition:all 0.3s;"
        >
          Pending
        </button>
        <button
          (click)="activeTab = 'approved'"
          [style.background]="
            activeTab === 'approved' ? '#E91E63' : 'transparent'
          "
          [style.color]="activeTab === 'approved' ? 'white' : '#666'"
          style="flex:1;padding:12px;border:none;border-radius:8px;font-family:Poppins;font-weight:500;font-size:13px;cursor:pointer;transition:all 0.3s;"
        >
          Approved
        </button>
        <button
          (click)="activeTab = 'rejected'"
          [style.background]="
            activeTab === 'rejected' ? '#E91E63' : 'transparent'
          "
          [style.color]="activeTab === 'rejected' ? 'white' : '#666'"
          style="flex:1;padding:12px;border:none;border-radius:8px;font-family:Poppins;font-weight:500;font-size:13px;cursor:pointer;transition:all 0.3s;"
        >
          Rejected
        </button>
      </div>

      <div style="padding:0 16px 16px;">
        <ion-card
          *ngFor="let maid of getFilteredMaids()"
          style="border-radius:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"
        >
          <ion-card-content style="padding:16px;">
            <div
              style="display:flex;gap:12px;align-items:center;margin-bottom:12px;"
            >
              <ion-avatar style="width:60px;height:60px;">
                <img
                  [src]="
                    maid.profileImage ||
                    'https://ionicframework.com/docs/img/demos/avatar.svg'
                  "
                />
              </ion-avatar>
              <div style="flex:1;">
                <h4
                  style="font-family:Poppins;font-weight:600;margin:0;font-size:16px;color:#1E2A38;"
                >
                  {{ maid.name }}
                </h4>
                <p style="color:#666;font-size:12px;margin:2px 0;">
                  📍 {{ maid.city }} • {{ maid.experience }} yrs exp
                </p>
                <p
                  style="color:#E91E63;font-weight:600;font-size:13px;margin:0;"
                >
                  ₹{{ maid.salaryExpectation }}/day
                </p>
              </div>
              <ion-badge
                [color]="
                  maid.isApproved === 'approved'
                    ? 'success'
                    : maid.isApproved === 'rejected'
                      ? 'danger'
                      : 'warning'
                "
                style="padding:6px 12px;border-radius:12px;"
              >
                {{ maid.isApproved | uppercase }}
              </ion-badge>
            </div>

            <div
              style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;"
            >
              <ion-badge
                *ngFor="let skill of maid.skills"
                color="light"
                style="color:#E91E63;padding:6px 10px;font-size:11px;border-radius:12px;"
                >{{ skill }}</ion-badge
              >
            </div>

            <!-- Approve / Reject -->
            <div
              *ngIf="maid.isApproved === 'pending'"
              style="display:flex;gap:8px;margin-bottom:8px;"
            >
              <ion-button
                expand="block"
                fill="solid"
                (click)="approveMaid(maid.uid)"
                style="flex:1;--background:#4CAF50;--border-radius:12px;height:44px;font-family:Poppins;"
              >
                ✅ Approve
              </ion-button>
              <ion-button
                expand="block"
                fill="outline"
                color="danger"
                (click)="rejectMaid(maid.uid)"
                style="flex:1;--border-radius:12px;height:44px;font-family:Poppins;"
              >
                ❌ Reject
              </ion-button>
            </div>

            <!-- Block / Unblock -->
            <ion-button
              *ngIf="!maid.isBlocked"
              expand="block"
              fill="outline"
              color="danger"
              (click)="blockMaid(maid.uid)"
              style="--border-radius:12px;height:44px;font-family:Poppins;"
            >
              🚫 Block Maid
            </ion-button>
            <ion-button
              *ngIf="maid.isBlocked"
              expand="block"
              fill="solid"
              (click)="unblockMaid(maid.uid)"
              style="--background:#4CAF50;--border-radius:12px;height:44px;font-family:Poppins;"
            >
              ✅ Unblock Maid
            </ion-button>
          </ion-card-content>
        </ion-card>

        <p
          *ngIf="getFilteredMaids().length === 0"
          style="text-align:center;padding:60px 20px;color:#999;font-family:Poppins;"
        >
          No maids in this category.
        </p>
      </div>
    </ion-content>
  `,
})
export class ManageMaidsPage implements OnInit {
  allMaids: MaidModel[] = [];
  activeTab = 'pending';

  constructor(
    private maidService: MaidService,
    private firestore: Firestore,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.maidService.getAllMaids().subscribe((m) => (this.allMaids = m));
  }

  getFilteredMaids() {
    return this.allMaids.filter((m) => m.isApproved === this.activeTab);
  }

  async approveMaid(uid: string) {
    await this.maidService.approveMaid(uid);
    const t = await this.toastCtrl.create({
      message: '✅ Maid approved!',
      duration: 2000,
      color: 'success',
    });
    t.present();
  }

  async rejectMaid(uid: string) {
    await this.maidService.rejectMaid(uid);
    const t = await this.toastCtrl.create({
      message: 'Maid rejected.',
      duration: 2000,
      color: 'danger',
    });
    t.present();
  }

  async blockMaid(uid: string) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), { isBlocked: true });
    await updateDoc(doc(this.firestore, `users/${uid}`), { isBlocked: true });
    const t = await this.toastCtrl.create({
      message: '🚫 Maid blocked.',
      duration: 2000,
      color: 'warning',
    });
    t.present();
  }

  async unblockMaid(uid: string) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), { isBlocked: false });
    await updateDoc(doc(this.firestore, `users/${uid}`), { isBlocked: false });
    const t = await this.toastCtrl.create({
      message: '✅ Maid unblocked.',
      duration: 2000,
      color: 'success',
    });
    t.present();
  }
}

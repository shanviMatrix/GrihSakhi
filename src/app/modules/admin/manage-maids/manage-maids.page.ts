import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonCard, IonCardContent, IonButton, IonBadge,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, banOutline } from 'ionicons/icons';
import { MaidService } from '../../../core/services/maid.service';
import { AuthService } from '../../../core/services/auth.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { MaidModel } from '../../../core/models/maid.model';

@Component({
  selector: 'app-manage-maids',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardContent, IonButton, IonBadge,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonSegment, IonSegmentButton, IonLabel, IonAvatar, IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"></ion-back-button></ion-buttons>
        <ion-title style="font-family:Poppins;">Maid Approvals</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">
      <ion-segment [(ngModel)]="activeTab" style="margin:16px;">
        <ion-segment-button value="pending"><ion-label>Pending</ion-label></ion-segment-button>
        <ion-segment-button value="approved"><ion-label>Approved</ion-label></ion-segment-button>
        <ion-segment-button value="rejected"><ion-label>Rejected</ion-label></ion-segment-button>
      </ion-segment>

      <div style="padding:0 16px 16px;">
        <ion-card *ngFor="let maid of getFilteredMaids()"
          style="border-radius:16px;margin-bottom:12px;">
          <ion-card-content>
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
              <ion-avatar>
                <img [src]="maid.profileImage || 'https://ionicframework.com/docs/img/demos/avatar.svg'">
              </ion-avatar>
              <div style="flex:1;">
                <h4 style="font-family:Poppins;font-weight:600;margin:0;">{{ maid.name }}</h4>
                <p style="color:#666;font-size:12px;margin:2px 0;">{{ maid.city }} • {{ maid.experience }} yrs exp</p>
                <p style="color:#E91E63;font-weight:600;font-size:12px;margin:0;">₹{{ maid.salaryExpectation }}/day</p>
              </div>
              <ion-badge [color]="maid.isApproved === 'approved' ? 'success' : maid.isApproved === 'rejected' ? 'danger' : 'warning'">
                {{ maid.isApproved }}
              </ion-badge>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">
              <ion-badge *ngFor="let skill of maid.skills" color="light"
                style="color:#E91E63;padding:4px 8px;">{{ skill }}</ion-badge>
            </div>

            <!-- Approve / Reject -->
            <div *ngIf="maid.isApproved === 'pending'" style="display:flex;gap:8px;margin-bottom:8px;">
              <ion-button expand="block" color="success"
                (click)="approveMaid(maid.uid)"
                style="flex:1;--border-radius:10px;">
                ✅ Approve
              </ion-button>
              <ion-button expand="block" color="danger"
                (click)="rejectMaid(maid.uid)"
                style="flex:1;--border-radius:10px;">
                ❌ Reject
              </ion-button>
            </div>

            <!-- Block / Unblock -->
            <ion-button *ngIf="!maid.isBlocked" expand="block" fill="outline" color="danger"
              (click)="blockMaid(maid.uid)"
              style="--border-radius:10px;">
              🚫 Block Maid
            </ion-button>
            <ion-button *ngIf="maid.isBlocked" expand="block" fill="outline" color="success"
              (click)="unblockMaid(maid.uid)"
              style="--border-radius:10px;">
              ✅ Unblock Maid
            </ion-button>
          </ion-card-content>
        </ion-card>

        <p *ngIf="getFilteredMaids().length === 0"
          style="text-align:center;padding:40px;color:#999;">
          No maids in this category.
        </p>
      </div>
    </ion-content>
  `
})
export class ManageMaidsPage implements OnInit {
  allMaids: MaidModel[] = [];
  activeTab = 'pending';

  constructor(
    private maidService: MaidService,
    private firestore: Firestore,
    private toastCtrl: ToastController
  ) {
    addIcons({ checkmarkCircleOutline, closeCircleOutline, banOutline });
  }

  ngOnInit() {
    this.maidService.getAllMaids().subscribe(m => this.allMaids = m);
  }

  getFilteredMaids() {
    return this.allMaids.filter(m => m.isApproved === this.activeTab);
  }

  async approveMaid(uid: string) {
    await this.maidService.approveMaid(uid);
    const t = await this.toastCtrl.create({
      message: '✅ Maid approved!', duration: 2000, color: 'success'
    });
    t.present();
  }

  async rejectMaid(uid: string) {
    await this.maidService.rejectMaid(uid);
    const t = await this.toastCtrl.create({
      message: 'Maid rejected.', duration: 2000, color: 'danger'
    });
    t.present();
  }

  async blockMaid(uid: string) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), { isBlocked: true });
    await updateDoc(doc(this.firestore, `users/${uid}`), { isBlocked: true });
    const t = await this.toastCtrl.create({
      message: '🚫 Maid blocked.', duration: 2000, color: 'warning'
    });
    t.present();
  }

  async unblockMaid(uid: string) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), { isBlocked: false });
    await updateDoc(doc(this.firestore, `users/${uid}`), { isBlocked: false });
    const t = await this.toastCtrl.create({
      message: '✅ Maid unblocked.', duration: 2000, color: 'success'
    });
    t.present();
  }
}
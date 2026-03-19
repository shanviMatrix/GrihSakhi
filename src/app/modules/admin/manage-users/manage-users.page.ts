import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {
  Firestore,
  collectionData,
  collection,
  doc,
  updateDoc,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
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
          >Manage Users</ion-title
        >
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">
      <div style="padding:16px;">
        <ion-card
          *ngFor="let user of users"
          style="border-radius:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"
        >
          <ion-card-content style="padding:16px;">
            <div
              style="display:flex;align-items:center;gap:12px;margin-bottom:12px;"
            >
              <ion-avatar style="width:60px;height:60px;">
                <img
                  [src]="
                    user.profileImage ||
                    'https://ionicframework.com/docs/img/demos/avatar.svg'
                  "
                />
              </ion-avatar>
              <div style="flex:1;">
                <h4
                  style="font-family:Poppins;font-weight:600;margin:0;font-size:16px;color:#1E2A38;"
                >
                  {{ user.name }}
                </h4>
                <p style="color:#666;font-size:12px;margin:2px 0;">
                  {{ user.email }}
                </p>
                <p style="color:#666;font-size:12px;margin:0;">
                  📍 {{ user.city }}
                </p>
              </div>
              <div style="text-align:right;">
                <ion-badge
                  [color]="user.isBlocked ? 'danger' : 'success'"
                  style="padding:6px 12px;border-radius:12px;margin-bottom:4px;"
                >
                  {{ user.isBlocked ? 'BLOCKED' : 'ACTIVE' }}
                </ion-badge>
                <p
                  style="color:#E91E63;font-size:11px;font-weight:600;margin:0;font-family:Poppins;"
                >
                  {{ user.role | uppercase }}
                </p>
              </div>
            </div>

            <ion-button
              *ngIf="!user.isBlocked"
              expand="block"
              fill="outline"
              color="danger"
              (click)="blockUser(user.uid)"
              style="--border-radius:12px;height:44px;font-family:Poppins;"
            >
              🚫 Block User
            </ion-button>
            <ion-button
              *ngIf="user.isBlocked"
              expand="block"
              fill="solid"
              (click)="unblockUser(user.uid)"
              style="--background:#4CAF50;--border-radius:12px;height:44px;font-family:Poppins;"
            >
              ✅ Unblock User
            </ion-button>
          </ion-card-content>
        </ion-card>

        <p
          *ngIf="users.length === 0"
          style="text-align:center;padding:60px 20px;color:#999;font-family:Poppins;"
        >
          No users found.
        </p>
      </div>
    </ion-content>
  `,
})
export class ManageUsersPage implements OnInit {
  users: any[] = [];

  constructor(
    private firestore: Firestore,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    collectionData(collection(this.firestore, 'users'), {
      idField: 'uid',
    }).subscribe((u: any[]) => {
      this.users = u.filter((x) => x.role === 'user');
    });
  }

  async blockUser(uid: string) {
    await updateDoc(doc(this.firestore, `users/${uid}`), { isBlocked: true });
    const t = await this.toastCtrl.create({
      message: '🚫 User blocked.',
      duration: 2000,
      color: 'warning',
    });
    t.present();
  }

  async unblockUser(uid: string) {
    await updateDoc(doc(this.firestore, `users/${uid}`), { isBlocked: false });
    const t = await this.toastCtrl.create({
      message: '✅ User unblocked.',
      duration: 2000,
      color: 'success',
    });
    t.present();
  }
}

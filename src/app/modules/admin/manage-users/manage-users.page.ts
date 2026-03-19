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
  templateUrl: './manage-users.page.html',
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

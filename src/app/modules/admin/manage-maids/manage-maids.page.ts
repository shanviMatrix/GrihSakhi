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
  templateUrl: './manage-maids.page.html',
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

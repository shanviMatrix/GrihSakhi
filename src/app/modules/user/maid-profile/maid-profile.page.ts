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
  templateUrl: './maid-profile.page.html',
  styleUrls: ['./maid-profile.page.scss'],
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

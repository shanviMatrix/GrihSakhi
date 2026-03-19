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
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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

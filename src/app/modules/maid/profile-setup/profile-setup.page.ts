import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonBackButton, ToastController
} from '@ionic/angular/standalone';
import { MaidService } from '../../../core/services/maid.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton
  ],
  templateUrl: './profile-setup.page.html',})
export class ProfileSetupPage implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  maidId = '';

  constructor(
    private fb: FormBuilder,
    private maidService: MaidService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      skills: ['', Validators.required],
      experience: [0, Validators.required],
      salaryExpectation: [0, Validators.required]
    });
  }

  async ngOnInit() {
    const user = await this.authService.getCurrentUserProfile();
    this.maidId = user.uid;
    this.maidService.getMaidById(this.maidId).subscribe(m => {
      this.profileForm.patchValue({
        name: m.name,
        phone: m.phone,
        city: m.city,
        address: m.address,
        skills: m.skills.join(', '),
        experience: m.experience,
        salaryExpectation: m.salaryExpectation
      });
    });
  }

  async saveProfile() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    try {
      const v = this.profileForm.value;
      await this.maidService.updateMaidProfile(this.maidId, {
        ...v,
        skills: v.skills.split(',').map((s: string) => s.trim())
      });
      const toast = await this.toastCtrl.create({
        message: '✅ Profile updated!', duration: 2000, color: 'success'
      });
      toast.present();
      this.router.navigate(['/maid/dashboard']);
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Update failed. Try again.', duration: 2000, color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
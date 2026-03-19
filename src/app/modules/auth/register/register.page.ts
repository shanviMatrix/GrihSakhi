import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonIcon,
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  selectedRole: 'user' | 'maid' = 'user';
  isLoading = false;
  showPassword = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      address: [''],
      skills: [''],
      experience: [0],
      salaryExpectation: [0],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async register() {
    this.isLoading = true;
    try {
      const v = this.registerForm.value;
      if (this.selectedRole === 'user') {
        await this.authService.registerUser(v);
        this.router.navigate(['/user/home']);
      } else {
        await this.authService.registerMaid({
          ...v,
          skills: v.skills.split(',').map((s: string) => s.trim()),
        });
        const toast = await this.toastCtrl.create({
          message: '✅ Registration submitted! Awaiting admin approval.',
          duration: 3000,
          color: 'success',
        });
        toast.present();
        this.router.navigate(['/auth/login']);
      }
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message || 'Registration failed.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}

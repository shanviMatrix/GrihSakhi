import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth/login',
    loadComponent: () => import('./modules/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./modules/auth/register/register.page').then(m => m.RegisterPage)
  },

  {
    path: 'user/home',
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' },
    loadComponent: () => import('./modules/user/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'user/maid-profile/:id',
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' },
    loadComponent: () => import('./modules/user/maid-profile/maid-profile.page').then(m => m.MaidProfilePage)
  },
  {
    path: 'user/booking/:id',
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' },
    loadComponent: () => import('./modules/user/booking/booking.page').then(m => m.BookingPage)
  },
  {
    path: 'user/booking-history',
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' },
    loadComponent: () => import('./modules/user/booking-history/booking-history.page').then(m => m.BookingHistoryPage)
  },
  {
    path: 'user/review/:id',
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' },
    loadComponent: () => import('./modules/user/review/review.page').then(m => m.ReviewPage)
  },

  {
    path: 'maid/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'maid' },
    loadComponent: () => import('./modules/maid/dashboard/dashboard.page').then(m => m.MaidDashboardPage)
  },
  {
    path: 'maid/profile-setup',
    canActivate: [authGuard, roleGuard],
    data: { role: 'maid' },
    loadComponent: () => import('./modules/maid/profile-setup/profile-setup.page').then(m => m.ProfileSetupPage)
  },

  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./modules/admin/dashboard/dashboard.page').then(m => m.AdminDashboardPage)
  },
  {
    path: 'admin/manage-maids',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./modules/admin/manage-maids/manage-maids.page').then(m => m.ManageMaidsPage)
  },
  {
    path: 'admin/manage-users',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./modules/admin/manage-users/manage-users.page').then(m => m.ManageUsersPage)
  },
  {
    path: 'admin/manage-bookings',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./modules/admin/manage-bookings/manage-bookings.page').then(m => m.ManageBookingsPage)
  },

  { path: '**', redirectTo: 'auth/login' }
];
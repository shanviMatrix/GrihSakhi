import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);
  const expectedRole = route.data['role'];

  return user(auth).pipe(
    take(1),
    switchMap(u => {
      if (!u) {
        router.navigate(['/auth/login']);
        return [false];
      }
      return from(getDoc(doc(firestore, `users/${u.uid}`))).pipe(
        map(snap => {
          const profile = snap.data() as any;
          if (profile?.role === expectedRole) return true;
          router.navigate(['/auth/login']);
          return false;
        })
      );
    })
  );
};
import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean => {
  const authService = inject(AuthService);
  /* COntrollo login
  if (authService.isLoggedIn || localStorage.getItem('manager')) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
  */
  
  if (1 == 1) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
};
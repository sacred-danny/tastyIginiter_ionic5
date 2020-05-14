import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/auth/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'set-location',
    loadChildren: () => import('./pages/auth/set-location/set-location.module').then(m => m.SetLocationPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule),
    canActivate: [ AuthGuard ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}

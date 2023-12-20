import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideMenuComponent } from './component/side-menu/side-menu.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { MonitoringComponent } from './component/monitoring/monitoring.component';
import { CreateMessageComponent } from './component/create-message/create-message.component';
import { SettingsComponent } from './component/settings/settings.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path : '', component: SideMenuComponent,  children: [   /*canActivate: [authGuard]*/
    { path: '', redirectTo: 'edit-profile', pathMatch: 'full'},
    //{ path: ':username/edit-profile', component: EditProfileComponent },
    { path: 'edit-profile', component: EditProfileComponent },
    { path: 'monitoring', component: MonitoringComponent },
    { path: 'create-message', component: CreateMessageComponent },
    { path: 'settings', component: SettingsComponent },
  ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

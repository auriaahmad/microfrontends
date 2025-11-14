import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { ReactWrapperComponent } from './react-wrapper.component';
import { RemoteHeaderComponent } from './remote-header.component';
import { RemoteLoginComponent } from './remote-login.component';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile.component';
import { RemoteLoaderService } from './remote-loader.service';

// Routes configuration - no need to import Routes type in JS
const routes = [
  { path: '', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    App,
    ReactWrapperComponent,
    RemoteHeaderComponent,
    RemoteLoginComponent,
    DashboardComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [RemoteLoaderService],
  bootstrap: [App]
})
export class AppModule {}

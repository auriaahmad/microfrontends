import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { ReactWrapperComponent } from './react-wrapper.component';
import { RemoteHeaderComponent } from './remote-header.component';
import { RemoteLoginComponent } from './remote-login.component';
import { RemoteLoaderService } from './remote-loader.service';

@NgModule({
  declarations: [
    App,
    ReactWrapperComponent,
    RemoteHeaderComponent,
    RemoteLoginComponent
  ],
  imports: [BrowserModule],
  providers: [RemoteLoaderService],
  bootstrap: [App]
})
export class AppModule {}

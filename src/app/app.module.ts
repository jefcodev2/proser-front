import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppComponent,
    LoginComponent,
    RouterModule
  ],
  exports: [    

  ]
})
export class AppModule { }

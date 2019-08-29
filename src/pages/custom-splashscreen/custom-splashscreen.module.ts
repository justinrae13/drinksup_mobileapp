import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomSplashscreenPage } from './custom-splashscreen.page';

const routes: Routes = [
  {
    path: '',
    component: CustomSplashscreenPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CustomSplashscreenPage]
})
export class CustomSplashscreenPageModule {}

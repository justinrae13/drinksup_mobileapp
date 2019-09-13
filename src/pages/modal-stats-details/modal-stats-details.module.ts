import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalStatsDetailsPage } from './modal-stats-details.page';

const routes: Routes = [
  {
    path: '',
    component: ModalStatsDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalStatsDetailsPage]
})
export class ModalStatsDetailsPageModule {}

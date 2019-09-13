import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalToSponsorPage } from './modal-to-sponsor.page';

const routes: Routes = [
  {
    path: '',
    component: ModalToSponsorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalToSponsorPage]
})
export class ModalToSponsorPageModule {}

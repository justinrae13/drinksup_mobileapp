import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalGetSponsoredPage } from './modal-get-sponsored.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGetSponsoredPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalGetSponsoredPage]
})
export class ModalGetSponsoredPageModule {}

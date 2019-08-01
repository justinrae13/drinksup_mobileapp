import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsadminPage } from './tabsadmin.page';
// import {OffersManagementPageModule} from '../offers-management/offers-management.module';
import {UsersPageModule} from '../users/users.module';
import {ProfilePageModule} from '../profile/profile.module';

const routes: Routes = [
    {
        path: '',
        component: TabsadminPage,
        children: [
            {
                path: 'users',
                children: [
                    { path: '', loadChildren: '../users/users.module#UsersPageModule' },
                ]
            },
            // {
            //     path: 'offers-management',
            //     children: [
            //         { path: '', loadChildren: '../offers-management/offers-management.module#OffersManagementPageModule' },
            //     ]
            // },
            {
                path: 'bar-admin',
                children: [
                    { path: '', loadChildren: '../bar-admin/bar-admin.module#BarAdminPageModule' },
                ]
            },
            {
                path: 'offers-admin',
                children: [
                    { path: '', loadChildren: '../offers-admin/offers-admin.module#OffersAdminPageModule' },
                ]
            },
            // {
            //     path: 'logout-admin',
            //     children: [
            //         { path: '', loadChildren: '../admin-logout/admin-logout.module#AdminLogoutPageModule' },
            //     ]
            // },
            // {
            //     path: 'profile',
            //     children: [
            //         { path: '', loadChildren: '../profile/profile.module#ProfilePageModule' },
            //     ]
            // },
        ]
    },
    {
        path: '',
        redirectTo: '/tabsadmin',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // OffersManagementPageModule,
    UsersPageModule,
    ProfilePageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsadminPage]
})
export class TabsadminPageModule {}

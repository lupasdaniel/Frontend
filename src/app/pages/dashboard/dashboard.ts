import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { SeatsIoComponent } from './components/seats-io';
import { GuestTable } from './components/guestTable';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget,GuestTable, NotificationsWidget,SeatsIoComponent],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 lg:col-span-12 xl:col-span-12">
                <app-seats-io/>
            </div>
            <div class="col-span-12 lg:col-span-12 xl:col-span-12">
                <app-table />
            </div>
            <!-- <div class="col-span-12 xl:col-span-6">
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div> -->
        </div>
    `
})
export class Dashboard {


}

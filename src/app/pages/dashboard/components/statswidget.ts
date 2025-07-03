import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventRequest, WeddingRequest } from '../../../methods/methods.service';
import { WeddingStatsDto } from '../../../models/models';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Invitati</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Total {{eventStats.TotalGuests}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <div  class="flex justify-between mb-4">
                <span class="text-primary font-medium"> {{eventStats.TotalSeatedGuests}}/{{eventStats.TotalGuests}}</span>
                <span class="text-muted-color">Asezati</span>
                </div>
                <div  class="flex justify-between mb-4">
                <span class="text-primary font-medium">  {{eventStats.TotalUnseatedGuests}}/{{eventStats.TotalGuests}} </span>
                <span class="text-muted-color">Neasezati</span>
                </div>


            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Meniuri</span>

                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <div  class="flex justify-between mb-4">
                <span class="text-primary font-medium">   {{eventStats.TotalNormalMenu}}/{{eventStats.TotalGuests}} </span>
                <span class="text-muted-color">Neasezati</span>
                </div>
                <div  class="flex justify-between mb-4">
                <span class="text-primary font-medium">   {{eventStats.TotalNormalMenu}}/{{eventStats.TotalGuests}} </span>
                <span class="text-muted-color">Neasezati</span>
                </div>
                <div  class="flex justify-between mb-4">
                <span class="text-primary font-medium">   {{eventStats.TotalNormalMenu}}/{{eventStats.TotalGuests}} </span>
                <span class="text-muted-color">Neasezati</span>
                </div>

            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Comments</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">85 </span>
                <span class="text-muted-color">responded</span>
            </div>
        </div>
        `
})
export class StatsWidget implements OnInit {
    constructor(
        private route: ActivatedRoute,
        public weddingRequest: WeddingRequest,
      ) {}
      eventId: string = '3e210ad6-acb6-4dcc-a54a-72c64ad42af4';
      eventStats: WeddingStatsDto = new WeddingStatsDto();

        ngOnInit() {
            this.route.params.subscribe((params) => {
            this.eventId = '3e210ad6-acb6-4dcc-a54a-72c64ad42af4'
            this.getStats();
            });
        }
    async getStats() {
        (await this.weddingRequest.getStats(this.eventId)).subscribe({
          next: (response: any) => {
            this.eventStats = new WeddingStatsDto({
              TotalGuests: response.totalGuests,
              TotalSeatedGuests: response.totalSeatedGuests,
              TotalUnseatedGuests: response.totalUnseatedGuests,
              TotalNormalMenu: response.totalNormalMenu,
              TotalVegetarianMenu: response.totalVegetarianMenu,
              TotalVeganMenu: response.totalVeganMenu,
              TotalKidsMenu: response.totalKidsMenu,
            });
            console.log(this.eventStats);
          },
          error: (err) => {
            console.error('Error fetching stats:', err);
          },
          complete: () => {
            console.log('Fetching event stats completed.');
          },
        });
      }

}

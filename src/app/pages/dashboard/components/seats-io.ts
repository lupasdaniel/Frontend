import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventRequest, WeddingRequest } from '../../../methods/methods.service';
import { Event, GuestDto, WeddingStatsDto } from '../../../models/models';
import { EmbeddableProps, SeatsioAngularModule } from '@seatsio/seatsio-angular';
import {
    ChartRendererConfigOptions,
    EventManagerConfigOptions,
    SelectableObject,
  } from '@seatsio/seatsio-types';
@Component({
    standalone: true,
    selector: 'app-seats-io',
    imports: [CommonModule,SeatsioAngularModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div
                tourAnchor="see-table"
                style="
                  height: 500px;
                  width: 100%;
                  background-color: #fff;
                  border-radius: 24px;
                "
              >
             <si-seatsio-seating-chart
                  [config]="config"
                ></si-seatsio-seating-chart>
              </div>
        </div>`
})
export class SeatsIoComponent implements OnInit {
    isActiveTickets: boolean = false;
    isActiveReservation: boolean = false;
    cdr: any;

    constructor(
        private route: ActivatedRoute,
        public weddingRequest: WeddingRequest,
        public eventRequest: EventRequest
      ) {}
      eventId: string = '3e210ad6-acb6-4dcc-a54a-72c64ad42af4';
      chart: any = {};
      currentIndex: number = 0;
      activeFilter: number = 2;
      eventGuests: GuestDto[] = [];
      filteredGuests: GuestDto[] = [];
      paginatedGuests: GuestDto[] = [];
      currentPage: number = 1;
      pageSize: number = 10;
      totalPages: number = 0;
      selectedTableId: string = '';
      selectedTableSeats: string = '';
      tablesFromSeats: {
        label: string;
        guests: GuestDto[];
      }[] = [];
      finalList: number[] = [];
      selectedGuest: GuestDto = new GuestDto();
      selectedTable: any = null;
      previewTable: any = null;
      event: Event =  new Event();
      setSelectedTable(table: any): void {
        if (this.selectedTable === table) {
          this.selectedTable = null;
          this.selectedGuest = new GuestDto(); // Resetare la o instanță nouă
        } else {
          this.selectedTable = table;
        }
      }
        ngOnInit() {

            this.route.params.subscribe((params) => {
            this.eventId = '3e210ad6-acb6-4dcc-a54a-72c64ad42af4'
            });
            this.route.paramMap.subscribe(async (params) => {
                this.eventId = params.get('id') ?? '3e210ad6-acb6-4dcc-a54a-72c64ad42af4';
                if (this.eventId) {
                  (await this.eventRequest.loadEvent(this.eventId)).subscribe((event) => {
                    this.event = event;
                    this.updateConfig(this.event.chartKey);
                    // this.getAvailableTables(this.numberOfPeople);
                    // this.automaticSelection(this.availableTables);
                  });
                }
              });
        }
        updateConfig(chartKey: string) {
            this.event.chartKey = chartKey;
            this.isActiveTickets = false;
            this.isActiveReservation = false;
            this.cdr.detectChanges();
            this.config = {
              ...this.config,
              extraConfig: {
                availableTables: this.finalList,
              },
              event: chartKey,
            };
            this.isActiveReservation = true;
          }

        async getGuests(): Promise<void> {
            this.currentIndex = 0;
            (
              await this.weddingRequest.getGuestsOrdered(
                this.eventId,
                this.activeFilter
              )
            ).subscribe({
              next: (response: any[]) => {
                this.eventGuests = response.map(
                  (guest: any) =>
                    new GuestDto({
                      id: guest.id,
                      eventId: guest.eventId,
                      lastName: guest.lastName,
                      firstName: guest.firstName,
                      menuPreference: guest.menuPreference,
                      notes: guest.notes ? guest.notes : 'N/A',
                      tableNumber: guest.tableNumber,
                      tableCapacity: guest.tableCapacity,
                      numberOfGuests: guest.numberOfGuests,
                      participatingInAGroup: false,
                      groupId: guest.groupId,
                    })
                );
                this.filteredGuests = [...this.eventGuests];
                this.paginatedGuests = this.eventGuests.slice(0, this.pageSize);
                this.currentIndex = this.pageSize;
              },
              error: (err) => {
                console.error('Eroare la obținerea listei de invitați:', err);
              },
              complete: () => {
                console.log('Obținerea listei de invitați s-a finalizat.');
              },
            });
          }

        config: EmbeddableProps<ChartRendererConfigOptions> = {
            region: 'eu',
            workspaceKey: 'ef991bcc-79e7-4a31-9fea-a138161dbc64',
            event: '0af2831f-3311-4a2d-8c65-92a574d6c7e8',
            maxSelectedObjects: 1,
            onRenderStarted: (createdChart: any) => {
              this.chart = createdChart;
              this.getGuests();
            },
            onObjectMouseOver: async (obj: any) => {
              const tableId = obj.label;

              let existingTable = this.tablesFromSeats.find(
                (table) => table.label === tableId
              );

              if (!existingTable) {
                (
                  await this.weddingRequest.getGuestsByTable(this.eventId, tableId)
                ).subscribe((guests: GuestDto[]) => {
                  const mappedGuests = guests.map((guest) => ({
                    firstName: guest.firstName,
                    lastName: guest.lastName,
                    notes: guest.notes,
                    menuPreference: guest.menuPreference,
                    tableNumber: guest.tableNumber,
                    tableCapacity: guests.length,
                  }));

                  existingTable = {
                    label: tableId,
                    guests:
                      mappedGuests.length > 0
                        ? mappedGuests
                        : Array(guests.length).fill({
                            name: 'Introdu Invitatul',
                            surname: '',
                            email: '',
                            notes: '',
                          }),
                  };

                  this.tablesFromSeats.push(existingTable);
                  this.previewTable = existingTable;
                });
              } else {
                this.previewTable = existingTable;
              }
            },

            onObjectMouseOut: () => {
              this.previewTable = null;
            },
            onObjectSelected: async (object: SelectableObject) => {
              if (object.objectType === 'Table') {
                this.setSelectedTable(this.previewTable);
                this.previewTable = null;
              }
            },
            onObjectDeselected: (object: SelectableObject) => {
              if (object.objectType === 'Table') {
                this.tablesFromSeats = this.tablesFromSeats.filter(
                  (table) => table.label !== object.label
                );

                this.selectedTable = null;
                this.selectedTableId = '';
                this.selectedTableSeats = '';
              }
            },
            extraConfig: {
              availableTables: this.finalList,

            },
            objectColor: function (object, defaultColor, extraConfig) {
              if (extraConfig && extraConfig['availableTables']) {
                for (const table of extraConfig['availableTables']) {
                  if (parseInt(object.labels.displayedLabel) === table) {
                    return 'red';
                  }
                }
              }
              extraConfig['flag'] = false;
              return defaultColor;
            },
          };

}

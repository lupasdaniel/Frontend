import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { EmbeddableProps } from '@seatsio/seatsio-angular';
import { lastValueFrom } from 'rxjs';
import saveAs from  'file-saver'
import { EventRequest, WeddingRequest } from '../../../methods/methods.service';
import { NewReservationDto, WeddingStatsDto, CouplesDto, GuestDto, TableDto, MenuPreference, Event } from '../../../models/models';
import { DropdownModule } from 'primeng/dropdown';
interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        DropdownModule
    ],
    template: `<div class="card w-full">
    <div class="font-semibold text-xl mb-4">Lista invitați</div>

    <!-- Filtre -->
    <div class="flex  items-center flex-wrap gap-4">
        <button pButton class="p-button-outlined weddingty" [class.active-button]="activeFilter === 0"
            (click)="setActiveFilter(0)">
            <i class="pi pi-filter"></i> Nume
        </button>
        <button pButton class="p-button-outlined weddingty" [class.active-button]="activeFilter === 1"
            (click)="setActiveFilter(1)">
            <i class="pi pi-filter"></i> Mese
        </button>
        <button pButton class="p-button-outlined weddingty" [class.active-button]="activeFilter === 2"
            (click)="setActiveFilter(2)">
            <i class="pi pi-filter"></i> Data adăugare
        </button>
        <button pButton class="p-button-outlined" (click)="downloadReport()">
            Descarcă lista invitaților
        </button>
    </div>

    <!-- Căutare -->
    <div class="p-inputgroup mt-4 flex  items-center flex-wrap gap-4">
        <span class="p-inputgroup-addon">
            <i class="pi pi-search"></i>
        </span>
        <input type="text" pInputText placeholder="Caută invitat" [(ngModel)]="searchQuery" (input)="filterGuests()" />
    </div>

    <!-- Tabelul cu invitați -->
    <p-table #dt [value]="eventGuests" dataKey="id" [rows]="10" [loading]="loading" [paginator]="true"
        [globalFilterFields]="['paginatedGuests.lastName', 'firstName', 'menuPreference', 'notes', 'tableNumber']"
        responsiveLayout="scroll">
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem">Nr.</th>
                <th style="min-width: 12rem">Nume  <p-columnFilter type="text" field="paginatedGuests.lastName" display="menu" placeholder="Search by name"></p-columnFilter></th>
                <th style="min-width: 12rem">Prenume</th>
                <th style="min-width: 8rem">Grup</th>
                <th style="min-width: 8rem">Meniu</th>
                <th style="min-width: 14rem">Notițe</th>
                <th style="min-width: 10rem">Masa aleasă</th>
                <th style="min-width: 10rem">Acțiuni</th>
            </tr>
        </ng-template>

        <ng-template #body let-guest let-i="index">
            <tr [ngClass]="{ 'group-row': guest.numberOfGuests > 1 && selectedGroupId === guest.groupId,
                            'highlighted-row': guest.groupId === selectedGroupId }">
                <td (click)="highlightGroup(guest.groupId)">
                    {{ (currentPage - 1) * pageSize + i + 1 }}
                </td>
                <td (click)="highlightGroup(guest.groupId)">
                    {{ guest.lastName || 'Invitat' }}
                </td>
                <td (click)="highlightGroup(guest.groupId)">
                    {{ guest.firstName || '' }}
                </td>
                <td style="text-align: center;">
                    <span *ngIf="guest.numberOfGuests > 1">{{ guest.numberOfGuests }}</span>
                    <span *ngIf="guest.numberOfGuests == 1">Singur</span>
                    <i class="pi pi-users" *ngIf="guest.numberOfGuests > 1"
                        (click)="openPopover('popover-' + i, guest.groupId)"></i>
                </td>
                <td (click)="highlightGroup(guest.groupId)">
                    {{ translateMenuPreferences(guest.menuPreference) }}
                </td>
                <td (click)="highlightGroup(guest.groupId)">
                    {{ guest.notes }}
                </td>
                <td>
               <p-dropdown [(ngModel)]="guest.tableId" (onChange)="assignTable(guest)"
    [options]="availableTables" optionLabel="tableNumber" optionValue="id"
    [placeholder]="guest.tableNumber ? 'Masa  ' + guest.tableNumber : 'Selectează Masa'">
    <ng-template let-table pTemplate="item">
        {{ table.tableNumber }} ({{
            table.tableAvailableSeats > guest.numberOfGuests ?
            'Locuri disponibile: ' + table.tableAvailableSeats :
            'Masa nu se poate alege' }})
    </ng-template>
    <ng-template let-table pTemplate="selectedItem">
        {{ getTableLabel(table) }}
    </ng-template>
</p-dropdown>
                </td>
                <td class="text-center">
                    <button pButton icon="pi pi-trash" class="p-button-danger p-button-text"
                        (click)="openCongratsModal(guest.id)"></button>
                    <button pButton icon="pi pi-pencil" class="p-button-primary p-button-text"
                        (click)="openEdit(guest)"></button>
                </td>
            </tr>
        </ng-template>

        <ng-template #emptymessage>
            <tr>
                <td colspan="8">Niciun invitat găsit.</td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [ConfirmationService, MessageService]
})
export class GuestTable implements OnInit {
openPopover(arg0: string,arg1: any) {
throw new Error('Method not implemented.');
}
openCongratsModal(arg0: any) {
throw new Error('Method not implemented.');
}


        @ViewChild('objectSelectedModal', { static: false })
        checkboxValue!: boolean
        isActiveTickets: boolean = false;
        finalReservation: NewReservationDto = new NewReservationDto();
        isActiveReservation: boolean = true;
        event: Event = new Event();
        chart: any = {};
        sumaToatala: number = 0;
        eventStats: WeddingStatsDto = new WeddingStatsDto();
        selectedTable: any = null;
        previewTable: any = null;
        couplesNames: CouplesDto[] = [];
        reservationToken: string = '';
        selectedTableLabels: string[] = [];
        numberOfPeople: number = 0;
        eventId: string = '3e210ad6-acb6-4dcc-a54a-72c64ad42af4';
        currentIndex: number = 0;
loading: unknown;
        setSelectedTable(table: any): void {
          if (this.selectedTable === table) {
            this.selectedTable = null;
            this.selectedGuest = new GuestDto(); // Resetare la o instanță nouă
          } else {
            this.selectedTable = table;
          }
        }

        couplesCache = new Map<string, { data: CouplesDto[]; timestamp: number }>();
        cacheExpirationTime = 5 * 60 * 1000; // 5 minute



        async getCouples(groupId: string): Promise<void> {
          const now = Date.now();

          // Dacă există deja date valabile în cache, le folosim și forțăm re-randarea UI-ului
          if (this.couplesCache.has(groupId)) {
            const cachedData = this.couplesCache.get(groupId);
            if (cachedData && now - cachedData.timestamp < this.cacheExpirationTime) {
              this.cdr.detectChanges(); // Asigură că UI-ul este actualizat
              return;
            }
          }

          try {
            const observable = await this.weddingRequest.getCouples(groupId);
            const response = await lastValueFrom(observable);

            const couples = response.map(
              (couple: any) => new CouplesDto({ fullName: couple.fullName })
            );

            // Stocăm rezultatul în cache cu timestamp
            this.couplesCache.set(groupId, { data: couples, timestamp: now });

            this.cdr.detectChanges(); // Forțăm UI-ul să se actualizeze
          } catch (err) {
            console.error('Error fetching couples:', err);
            throw err;
          }
        }


        tablesFromSeats: {
          label: string;
          guests: GuestDto[];
        }[] = [];
        activeFilter: number = 2;

        selectedGuest: GuestDto = new GuestDto();
        setActiveFilter(filter: number) {
          this.activeFilter = filter;
          this.getGuests();
          console.log(this.activeFilter);
        }
        availableTables: TableDto[] = [];
        async getAvailableTables(numberOfPeople: number) {
          (
            await this.weddingRequest.getTablesAvailable('3e210ad6-acb6-4dcc-a54a-72c64ad42af4', numberOfPeople)
          ).subscribe({
            next: (tables: TableDto[]) => {
              this.availableTables = tables;
              this.automaticSelection(this.availableTables);
            },
            error: (error: any) => {
              console.error('Error loading available tables:', error);
            },
          });
        }
        flag: boolean = false;
        finalList: number[] = [];
        automaticSelection(tables: TableDto[]) {
          tables.forEach((table: TableDto) => {
            if (table.tableAvailableSeats == 1 && table.tableNumber) {
              this.finalList.push(table.tableNumber);
            }
          });
          return this.finalList;
        }

        availableTags: { name: string; color: string }[] = [
          { name: 'Familie', color: '#FFD700' },
          { name: 'Prieteni', color: '#1E90FF' },
          { name: 'Colegii', color: '#32CD32' },
          { name: '18-30 ani', color: '#FF69B4' },
          { name: '30-50 ani', color: '#FF8C00' },
          { name: '1-18 ani', color: '#8A2BE2' },
          { name: 'Din partea mirelui', color: '#00CED1' },
          { name: 'Din partea miresei', color: '#FF6347' },
        ];
        selectedTags: string[] = [];

        toggleTag(tag: { name: string; color: string }) {
          if (this.selectedTags.includes(tag.name)) {
            this.selectedTags = this.selectedTags.filter((t) => t !== tag.name);
          } else {
            this.selectedTags.push(tag.name);
          }
        }

        removeTag(tag: string) {
          this.selectedTags = this.selectedTags.filter((t) => t !== tag);
        }
        getTagColor(tag: string): string {
          return this.availableTags.find(t => t.name === tag)?.color || 'transparent';
        }

        loadMoreGuests(event?: any, i?: number): void {
          if (i == null) {
            const nextGuests = this.filteredGuests.slice(
              this.currentIndex,
              this.currentIndex + this.pageSize
            );
            this.paginatedGuests = [...this.paginatedGuests, ...nextGuests];
            this.currentIndex = this.paginatedGuests.length;

            if (event) {
              event.target.complete();
            }

            if (this.currentIndex >= this.filteredGuests.length && event) {
              event.target.disabled = true;
            }
          }
        }
        constructor(
          private route: ActivatedRoute,
          public eventRequest: EventRequest,
          public weddingRequest: WeddingRequest,
          private cdr: ChangeDetectorRef,
        ) {}

        selectedTableId: string = '';

        getTableLabel(table: TableDto): string {
            return `Masa ${table.tableNumber} `;
        }
        selectedTableSeats: string = '';
        selectedMenu: string = '';
        showChangeTableOptions = false;
        newTableId = '';

        changeAllGuestsToNewTable(newTableId: string) {
          if (!newTableId) {
            console.error('Nicio masă selectată pentru pivotare');
            return;
          }

          const guests = this.selectedTable
            ? this.selectedTable.guests
            : this.previewTable.guests;

          guests.forEach(
            (guest: { tableId: string; firstName: any; lastName: any }) => {
              guest.tableId = newTableId;
              console.log(
                `Invitatul ${guest.firstName} ${guest.lastName} mutat la masa ${newTableId}`
              );
            }
          );

          this.showChangeTableOptions = false;
          this.selectedTable = null;
          this.previewTable = null;
        }

        toggleChangeTableOptions(): void {
          this.showChangeTableOptions = !this.showChangeTableOptions;
        }

        changeTable(newTableId: string): void {
          if (!newTableId) {
            alert('Selectează o masă validă.');
            return;
          }
          console.log('Masa schimbată la:', newTableId);
          this.showChangeTableOptions = false;
        }
        selectMenu(menu: string): void {
          this.selectedMenu = menu;
        }
        translateMenuPreferences(menu: number) {
          if (menu == 0) return 'Normal';
          else if (menu == 1) return 'Vegetarian';
          else if (menu == 2) return 'Vegan';
          else if (menu == 3) return 'Copil';
          else return 'Alege Meniul';
        }

        guestsList: GuestDto[] = [];

        async ionViewWillEnter() {
          this.tablesFromSeats = [];

          this.route.paramMap.subscribe(async (params) => {
            this.eventId = params.get('id') ?? '3e210ad6-acb6-4dcc-a54a-72c64ad42af4';
            if (this.eventId) {
              (await this.eventRequest.loadEvent(this.eventId)).subscribe((event) => {
                this.event = event;
                this.getAvailableTables(this.numberOfPeople);
                this.automaticSelection(this.availableTables);
              });
            }
          });
          await this.getStats();
          (
            await this.weddingRequest.getGuestsOrdered(
              '3e210ad6-acb6-4dcc-a54a-72c64ad42af4',
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
                    notes: guest.notes,
                    tableNumber: guest.tableNumber,
                    tableCapacity: guest.tableCapacity,
                  })
              );
              this.filteredGuests = [...this.eventGuests];
              this.calculateTotalPages();
              this.updatePaginatedGuests();
            },
            error: (err) => {
              console.error('Eroare la obținerea listei de invitați:', err);
            },
            complete: () => {
              console.log('Obținerea listei de invitați s-a finalizat.');
            },
          });
          console.log('Lista invitați:', this.eventGuests);
        }
        async ngOnInit() {
          this.tablesFromSeats = [];

          this.route.paramMap.subscribe(async (params) => {
            this.eventId = params.get('id') ?? '3e210ad6-acb6-4dcc-a54a-72c64ad42af4';
            if (this.eventId) {
              (await this.eventRequest.loadEvent(this.eventId)).subscribe((event) => {
                this.event = event;
                this.getAvailableTables(this.numberOfPeople);
                this.automaticSelection(this.availableTables);
              });
            }
          });
          await this.getStats();
          (
            await this.weddingRequest.getGuestsOrdered(
              '3e210ad6-acb6-4dcc-a54a-72c64ad42af4',
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
                    notes: guest.notes,
                    tableNumber: guest.tableNumber,
                    tableCapacity: guest.tableCapacity,
                  })
              );
              this.filteredGuests = [...this.eventGuests];
              this.calculateTotalPages();
              this.updatePaginatedGuests();
            },
            error: (err) => {
              console.error('Eroare la obținerea listei de invitați:', err);
            },
            complete: () => {
              console.log('Obținerea listei de invitați s-a finalizat.');
            },
          });

        }
        selectedGroupId: string | null = null; // Variabilă pentru stocarea grupului selectat

        highlightGroup(groupId: string | null): void {
          if (this.selectedGroupId === groupId) {
            // Deselectează grupul dacă faci clic din nou
            this.selectedGroupId = null;
          } else {
            // Selectează noul grup
            this.selectedGroupId = groupId;
          }
        }

        async getStats() {
          (await this.weddingRequest.getStats('3e210ad6-acb6-4dcc-a54a-72c64ad42af4')).subscribe({
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
        async downloadReport() {
          (await this.weddingRequest.getGuestReport(this.eventId)).subscribe(
            (data) => {
              const byteCharacters = atob(data.fileData);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: data.contentType });
              const fileName = data.fileName;
              saveAs(blob, fileName);
            }
          );
        }
        currentPage: number = 1;
        pageSize: number = 10;
        totalPages: number = 0;
        paginatedGuests: GuestDto[] = [];
        updatePaginatedGuests(): void {
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.paginatedGuests = this.filteredGuests.slice(startIndex, endIndex);
        }
        async getGuests(): Promise<void> {
          this.currentIndex = 0;
          (
            await this.weddingRequest.getGuestsOrdered(
             '3e210ad6-acb6-4dcc-a54a-72c64ad42af4',
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
        nextPage(): void {
          if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedGuests();
            this.scrollToGuests(); // Fix scroll-ul
          }
        }

        previousPage(): void {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedGuests();
            this.scrollToGuests(); // Fix scroll-ul
          }
        }
        hasGroup(groupId: string): boolean {
          // Verifică dacă există alți invitați cu același groupId
          return this.paginatedGuests.some(
            (guest) => guest.groupId === groupId && guest.participatingInAGroup
          );
        }
        scrollToGuests(): void {
          const element = document.querySelector('.pagination-controls');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        guests: GuestDto[] = [new GuestDto()];


        addEmptyGuest(lastName: string) {
          const newGuest = new GuestDto({
            lastName: lastName,
            menuPreference: MenuPreference.Normal, // Default menu preference
            // Alte câmpuri rămân neinitialize sau initializează-le aici dacă este necesar
          });
          this.guests.push(newGuest);
        }
        addPairChecked: boolean = false; // Starea inițială a checkbox-ului

        handleCheckboxChange(lastname: string) {
          if (this.addPairChecked) {
            this.addEmptyGuest(lastname);
            console.log('Checkbox is checked, do something');
          } else {
            this.guests.pop();
            console.log('Checkbox is unchecked, do something else');
          }
        }
        addPair(index: number) {
          const guest = this.guests[index];
          const newGuest = { ...guest }; // Clone the guest object
          this.guests.push(newGuest); // Add the new guest to the array
        }
        calculateTotalPages(): void {
          this.totalPages = Math.ceil(this.filteredGuests.length / this.pageSize);
        }
        onScroll() {
          const container = document.querySelector('.scroll-container');
          if (container) {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1) {
              this.loadMoreGuests();
            }
          }
        }
        fillForm(guest: GuestDto): void {
          this.selectedGuest = { ...guest };
        }

        isDescriptionExpanded = false;

        toggleDescription() {
          this.isDescriptionExpanded = !this.isDescriptionExpanded;
        }
        getDescription(description: string): string {
          if (!description) {
            return 'No description available';
          }
          if (this.isDescriptionExpanded || description.length <= 200) {
            return description;
          }
          return description.substring(0, 200) + '...';
        }


        isvalid(): boolean {
          if (this.chart.selectedObjects > 0) return true;
          return false;
        }


        eventGuests: GuestDto[] = [];
        filteredGuests: GuestDto[] = [];
        searchQuery: any = null;

        filterGuests(): void {
          if (!this.searchQuery.trim()) {
            this.filteredGuests = [...this.eventGuests];
          } else {
            const query = this.searchQuery.toLowerCase();
            this.filteredGuests = this.eventGuests.filter(
              (guest) =>
                (guest.firstName && guest.firstName.toLowerCase().includes(query)) ||
                (guest.lastName && guest.lastName.toLowerCase().includes(query))
            );
          }
          this.currentIndex = this.pageSize;
          this.paginatedGuests = this.filteredGuests.slice(0, this.pageSize);
        }
        trackByGuest(index: number, guest: GuestDto) {
          return guest.id;
        }
        async assignTable(guest: GuestDto) {
          await (
            await this.weddingRequest.AssignTable(
              guest.id,
              this.eventId,
              guest.lastName,
              guest.firstName,
              Number(guest.menuPreference),
              guest.notes,
              guest.tableId === '' ? null : guest.tableId,
              Number(guest.numberOfGuests)
            )
          ).subscribe(async (data: any) => {
            console.log(data);
            await this.getAvailableTables(this.numberOfPeople);
            await this.getStats();
          });
        }

        selectGuest(guest: any) {
          this.selectedGuest = guest;
        }
        getButtonText(): string {
          if (
            this.selectedGuest &&
            (this.selectedGuest.lastName ||
              this.selectedGuest.firstName ||
              this.selectedGuest.notes)
          ) {
            return 'Modifică Invitat';
          }
          return 'Adaugă Invitat';
        }

        async submitForm(): Promise<void> {
          if (this.guests && this.guests.length > 0) {
            const guestDtos = this.guests.map((guest) => ({
              eventId: this.eventId,
              lastName: guest.lastName,
              firstName: guest.firstName,
              menuPreference: Number(guest.menuPreference),
              notes: guest.notes,
              numberOfGuests: guest.numberOfGuests,
            }));

            await (
              await this.weddingRequest.saveGuest(guestDtos)
            ).subscribe(async (data: any) => {
              console.log(data);
              await this.getStats();
              await this.getGuests();
            });
          } else {
            const newGuest = { ...this.selectedGuest };
            this.selectedTable.guests.push(newGuest);
            console.log('Invitat adăugat:', newGuest);
          }
          this.addPairChecked = false;
          this.resetFormCreate();
        }
        async updateGuest(updatedGuest: GuestDto) {
          if (
            updatedGuest &&
            (updatedGuest.lastName || updatedGuest.firstName || updatedGuest.notes)
          ) {
            console.log('Invitatul a fost modificat:', this.selectedGuest);
            await (
              await this.weddingRequest.updateGuest(
                updatedGuest.id,
                this.eventId,
                updatedGuest.lastName,
                updatedGuest.firstName,
                Number(updatedGuest.menuPreference),
                updatedGuest.notes,
                updatedGuest.tableId === '' ? null : updatedGuest.tableId,
                Number(updatedGuest.numberOfGuests)
              )
            ).subscribe(async (data: any) => {
              console.log(data);
              await this.getGuests();
              await this.getStats();
              await this.getAvailableTables(this.numberOfPeople);
            });
          } else {
            const newGuest = { ...this.selectedGuest };
            this.selectedTable.guests.push(newGuest);
            console.log('Invitat adăugat:', newGuest);
          }
          this.isEditing = false;
          this.resetForm();
        }
        resetFormCreate(): void {
          this.guests = [new GuestDto()];
        }
        resetForm(): void {
          this.selectedGuest = {
            id: '',
            eventId: '',
            lastName: '',
            firstName: '',
            menuPreference: 0,
            notes: '',
            tableNumber: 0,
            numberOfGuests: 0,
            tableId: '',
            participatingInAGroup: false,
            groupId: '',
            tags: [],
          };
        }
        shouldHighlight(
          guest: { participatingInAGroup: any; groupId: string },
          index: number
        ): boolean {
          if (!guest.participatingInAGroup) {
            return false;
          }

          if (
            index > 0 &&
            this.paginatedGuests[index - 1].groupId === guest.groupId &&
            this.paginatedGuests[index - 1].participatingInAGroup
          ) {
            return true;
          }

          if (
            index < this.paginatedGuests.length - 1 &&
            this.paginatedGuests[index + 1].groupId === guest.groupId &&
            this.paginatedGuests[index + 1].participatingInAGroup
          ) {
            return true;
          }

          return false;
        }
        isEditing = false;
        toUpdateGuest: GuestDto = new GuestDto();

        openEdit(guest: GuestDto) {
          this.selectedGuest = { ...guest };
          this.isEditing = true;
        }

        closeEdit() {
          this.isEditing = false;
        }

        saveGuest() {
          console.log('Guest saved', this.selectedGuest);
          this.closeEdit();
        }


        customAlertOptions = {
          header: 'Atentie!',
          subHeader: 'Sunteti sigur ca vreti sa schimbati masa intregului grup?',
          translucent: true,
        };
        getInterfaceOptions(numberOfGuests: number) {
          if (numberOfGuests !== 1) {
            return this.customAlertOptions; // Returnăm opțiunile pentru alert dacă nu sunt 1 invitat
          } else {
            return {}; // Dacă sunt 1 invitat, nu se aplică opțiuni suplimentare
          }
        }


}

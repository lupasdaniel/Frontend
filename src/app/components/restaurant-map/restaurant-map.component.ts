import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { EditReservationPopupComponent } from '../edit-reservation-popup/edit-reservation-popup.component';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UserDto } from '../../models/user.model';
import { TableService } from '../../services/table.service';
import { TableDto } from '../../models/table.model';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { GetTablesQuery } from '../../queries/table-queries.model';
import { UpdateTablesCommand } from '../../commands/table-commands.model';
import { AuthService } from '../../services/auth.service';
import { AddMapComponent } from '../add-map/add-map.component';

@Component({
  selector: 'app-restaurant-map',
  standalone: true,
  imports: [
    CommonModule, ToastModule, DialogModule, ButtonModule, EditReservationPopupComponent, CalendarModule,
    InputTextModule, FormsModule, DatePickerModule, FloatLabelModule, OverlayPanelModule, AddMapComponent
  ],
  providers: [MessageService],
  templateUrl: './restaurant-map.component.html',
  styleUrls: ['./restaurant-map.component.scss']
})
export class RestaurantMapComponent implements OnChanges {
  @Input() roomId!: string;

  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;

  hoveredTable: TableDto | null = null;
  selectedTableId: string | null = null;
  editMode: boolean = false;
  dialogVisible: boolean = false;
  selectedTable: TableDto | null = null;
  reservationPopupVisible = false;
  selectedDate: Date | null = null;
  selectedHour: Date | null = null;
  user: UserDto = new UserDto();
  tables!: TableDto[];
  editTableDialogVisible: boolean = false;
  editedPersonsNr: number = 0;

  dateError: string = '';
  timeError: string = '';

  constructor(
    private messageService: MessageService,
    private tableService: TableService,
    private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loadTables();
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) =>{
        this.user = user;
      },
    })
    this.loadTables();
  }

  selectTable(tableId: string, event: MouseEvent) {
    event.stopPropagation();
    const table = this.tables.find(t => t.id === tableId);
    if (!table) return;
    if (this.editMode) {
      this.selectedTableId = tableId;
      this.selectedTable = table;
      this.editedPersonsNr = table.personsNr;
      this.editTableDialogVisible = true;
      return;
    }
    if (this.editMode) {
      this.selectedTableId = tableId;
    } else {
      this.selectedTable = table;
      this.reservationPopupVisible = true;
    }
  }

  saveEditedTablePersonsNr() {
    if (this.selectedTable) {
      this.selectedTable.personsNr = this.editedPersonsNr;

      const command: UpdateTablesCommand = {
        roomId: this.roomId,
        tables: this.tables
      };

      this.tableService.updateTables(command).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizat',
            detail: `Masa ${this.selectedTable?.tableNumber} a fost actualizată.`,
          });
          this.editTableDialogVisible = false;
        },
        error: (err) => {
          let detail = 'Nu s-a putut actualiza masa.';

          if (err?.error?.message) {
            detail = err.error.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail,
          });
        }
      });
    }
  }

  onMapClick(event: MouseEvent) {
    if (this.editMode && this.selectedTableId !== null) {
      const container = event.currentTarget as HTMLElement;
      const rect = container.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const table = this.tables.find(t => t.id === this.selectedTableId);
      if (table) {
        table.x = Math.round(x - 30);
        table.y = Math.round(y - 30);
      }

      this.selectedTableId = null;
    }
  }


  savePositions() {
    this.editMode = false;
    this.selectedTableId = null;

    const command: UpdateTablesCommand = {
      roomId: this.roomId,
      tables: this.tables
    };

    this.tableService.updateTables(command).subscribe({
      next: (res) => {
        this.loadTables();
      },
      error: (err) => {
        let detail = 'Nu s-a putut actualiza masa.';

        if (err?.error?.message) {
          detail = err.error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail,
        });
      }


    });
    this.messageService.add({
      severity: 'success',
      summary: 'Salvat',
      detail: 'Pozițiile meselor au fost salvate.'
    });
  }

  enableEdit() {
    this.editMode = !this.editMode;
  }

  deleteTable(tableId: string, event: Event) {
    event.stopPropagation(); // Prevent table selection when clicking delete

    // Here you can implement the actual delete logic
    // For now, we'll just log it and you can integrate it later
    console.log('Delete table with ID:', tableId);

    // Example of how you might want to implement it:
    // this.tableService.deleteTable(tableId).subscribe({
    //   next: () => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Masa a fost ștearsă cu succes'
    //     });
    //     this.loadTables(); // Reload tables
    //   },
    //   error: (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Eroare la ștergerea mesei'
    //     });
    //   }
    // });
  }

  openTableDialog(table: TableDto) {
    this.selectedTable = table;
    this.dialogVisible = true;
  }

  reserveTable(table: TableDto) {
    this.messageService.add({
      severity: 'success',
      summary: 'Rezervare efectuată',
      detail: `Masa ${table.tableNumber} a fost rezervată.`,
    });
  }

  showOverlay(event: MouseEvent, table: TableDto) {
    this.hoveredTable = table;

    if (this.overlayPanel) {
      this.overlayPanel.show(event);
    }
  }

  applyFilters(): void {
    this.loadTables();
  }

  addNewTable(): void {
    const defaultX = 100;
    const defaultY = 100;

    const maxTableNumber = this.tables.length > 0
      ? Math.max(...this.tables.map(t => t.tableNumber))
      : 0;
    let newTable: TableDto = {} as TableDto;
    newTable.roomID = this.roomId;
    newTable.personsNr = 4;
    newTable.statusId = '1';
    newTable.x = defaultX;
    newTable.y = defaultY;
    newTable.tableNumber = maxTableNumber + 1;

    this.tables.push(newTable);
    this.editMode = true;
    this.messageService.add({
      severity: 'info',
      summary: 'Masa adăugată',
      detail: `Masa ${newTable.tableNumber} a fost adăugată la coordonatele (${defaultX}, ${defaultY}).`
    });
  }

  public validateDateTime(): void {
    const today = new Date();
    this.dateError = '';
    this.timeError = '';

    if (this.selectedDate && this.selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      this.dateError = 'Nu poți selecta o dată din trecut.';
    }

    if (this.selectedDate && this.selectedHour) {
      const selectedDateTime = new Date(this.selectedDate);
      selectedDateTime.setHours(this.selectedHour.getHours(), this.selectedHour.getMinutes());

      if (selectedDateTime < today) {
        this.timeError = 'Ora selectată este în trecut.';
      }
    }
  }

  public loadTables(): void {
    if (!this.roomId )  return;

    if(this.selectedDate === null && this.selectedHour === null){
        const now = new Date();
        this.selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.selectedHour = this.getNextQuarterHour(now);
    }

    const query: GetTablesQuery = {
      roomId: this.roomId,
      date: this.formatDateForQuery(this.selectedDate!),
      time: this.formatTimeForQuery(this.selectedHour!),
    };

    this.tableService.getTables(query).subscribe({
      next: (res) => {
        this.tables = res as TableDto[];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Eroare', detail: 'Nu s-au putut încărca mesele' });
      }
    });
  }
  onTablesDetected(newTables: TableDto[]) {
    this.tables = [...this.tables, ...newTables];
  }

  private formatDateForQuery(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} 00:00:00.0000000`;
  }

  private formatTimeForQuery(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.0000000`;
  }

  private getNextQuarterHour(date: Date): Date {
    const rounded = new Date(date);
    const minutes = date.getMinutes();
    const nextQuarter = Math.ceil(minutes / 15) * 15;

    if (nextQuarter === 60) {
      rounded.setHours(date.getHours() + 1, 0, 0, 0);
    } else {
      rounded.setHours(date.getHours(), nextQuarter, 0, 0);
    }
    return rounded;
  }
}

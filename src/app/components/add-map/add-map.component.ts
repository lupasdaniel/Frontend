import { Component, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableDto } from '../../models/table.model';
import { TableService } from '../../services/table.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-map',
  imports: [ButtonModule],
  templateUrl: './add-map.component.html',
  styleUrls: ['./add-map.component.scss'],
})
export class AddMapComponent {
  @Output() tablesDetected = new EventEmitter<TableDto[]>();
  @Input() roomId!: string;

  @ViewChild('mapInput') mapInput!: ElementRef<HTMLInputElement>;

  constructor(
    private tableService: TableService,
    private messageService: MessageService
  ) {}

  openFileDialog(): void {
    this.mapInput.nativeElement.click();
  }

  onMapImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const imageFile = input.files[0];
      this.uploadMapImage(imageFile);
    }
  }

  uploadMapImage(imageFile: File): void {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('roomId', this.roomId);

    this.tableService.detectTablesFromImage(formData).subscribe({
      next: (tables) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mese detectate',
          detail: `${tables.length} mese detectate.`,
        });
        this.tablesDetected.emit(tables);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail: 'Nu s-a putut procesa imaginea.',
        });
      },
    });
  }
}

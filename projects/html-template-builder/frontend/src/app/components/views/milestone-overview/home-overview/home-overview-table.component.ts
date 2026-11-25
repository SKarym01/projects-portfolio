import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TableComponent } from '../../../elements/table/table/table.component';
import { TableHeaderComponent } from '../../../elements/table/table-header/table-header.component';
import { TableRowComponent } from '../../../elements/table/table-row/table-row.component';
import { TableDataComponent } from '../../../elements/table/table-data/table-data.component';
import { ButtonComponent } from '../../../elements/buttons/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ButtonSize } from '../../../elements/buttons/button-enum';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencilSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EmailTemplateService } from '../../../../email-template.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailTemplate } from '../../../../utils/email-template.model';

@Component({
  selector: 'app-home-overview-table',
  standalone: true,
  imports: [
    TableComponent,
    TableHeaderComponent,
    TableRowComponent,
    TableDataComponent,
    ButtonComponent,
    FaIconComponent,
    MatIconModule,
    CommonModule,
    FontAwesomeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-overview-table.component.html',
  styleUrl: './home-overview-table.component.scss',
})
export class HomeOverviewTableComponent implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private emailTemplateService = inject(EmailTemplateService);

  // Icons for UI buttons
  pencilIcon = faPencilSquare;
  trashIcon = faTrash;

  // List of templates shown in the table
  protected templates: EmailTemplate[] = [];

  // Reactive form group for possible filtering or inline editing
  group: FormGroup;

  constructor(
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder
  ) {
    // Define the structure and validators for the form
    this.group = this.formBuilder.group({
      templateTitle: ['', Validators.required],
      description: ['', Validators.required],
      emailFrom: ['', [Validators.required, Validators.email]],
      emailTo: ['', [Validators.required, Validators.email]],
      subjectLine: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTemplates();

    // Register a custom SVG icon (optional for extended UI)
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/edit.svg')
    );
  }

  // Loads all templates and filters out the outdated ones
  private loadTemplates() {
    this.emailTemplateService.getAllTemplates().subscribe({
      next: (data) => {
        this.templates = data.filter((template) => template.status !== 'outdated');
        this.cd.detectChanges(); // Trigger view update
      },
      error: (error) => console.error('Error loading templates:', error),
    });
  }

  // Handles editing action by navigating with state and query params
  onEdit(templateId: number): void {
    console.log('Editing template with ID:', templateId);
    this.emailTemplateService.getTemplateById(templateId).subscribe({
      next: (template) => {
        this.router.navigate(['/addnewtemp'], {
          state: { templateData: template },
          queryParams: { id: templateId, mode: 'edit' },
        });
      },
      error: (error) => {
        console.error('Template konnte nicht geladen werden:', error);
      },
    });
  }

  // Soft-delete a template after confirmation
  onDelete(templateId: number): void {
    if (
      confirm('Bist du sicher, dass du das Template als gelöscht markieren möchtest?')
    ) {
      this.emailTemplateService.deleteTemplate(templateId).subscribe({
        next: () => {
          this.templates = this.templates.filter((t) => t.templateId !== templateId);
          this.cd.markForCheck(); // Trigger UI refresh
        },
        error: (error) => console.error('Error during soft delete:', error),
      });
    }
  }

  // Handle row click and navigate to detailed view or editor
  onRowClick(templateId: string): void {
    this.router.navigate(['/addnewtemp', templateId]);
  }

  // Enum binding for button sizes in the template
  protected readonly ButtonSize = ButtonSize;
}

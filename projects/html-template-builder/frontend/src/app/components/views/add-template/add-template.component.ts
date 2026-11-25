import {
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor as NgxEditor } from 'ngx-editor';
import { Editor as TiptapEditor } from '@tiptap/core';

// Ngx-Editor Imports
import { NgxEditorModule, Toolbar } from 'ngx-editor';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
// Fontawesome und Material Imports
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

// Eigene Komponenten
import { ButtonComponent } from '../../elements/buttons/button/button.component';
import { ButtonSize } from '../../elements/buttons/button-enum';
import { CardComponent } from '../../elements/card/card.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { EmailTemplateService } from '../../../email-template.service';
import { PlaceholderService } from '../../../placeholders.service';
import { EmailTemplate } from '../../../utils/email-template.model';
import { Placeholder } from '../../../utils/placeholder.model';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FontAwesomeModule,
    MatTooltipModule,
    ButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CardComponent,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTemplateComponent implements OnInit, OnDestroy {
  categories: { name: string; expanded: boolean }[] = [];
  protected readonly ButtonSize = ButtonSize;
  isEditMode = false;
  currentTemplateId: number | null = null;
  ngxEditor!: NgxEditor;
  tiptapEditor!: TiptapEditor;

  toolbar: Toolbar;
  group: FormGroup;
  isSaving = false;

  private emailTemplateService = inject(EmailTemplateService);
  placeholders: Placeholder[] = [];
  private placeholderService = inject(PlaceholderService);
  read = false;
  showErrors = false;
  currentField = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private injector: Injector
  ) {
    // Initialize reactive form with required fields and validators
    this.group = this.formBuilder.group({
      templateTitle: ['', Validators.required],
      description: ['', Validators.required],
      emailFrom: ['', [Validators.required, Validators.email]],
      emailTo: ['', [Validators.required, Validators.email]],
      subjectLine: ['', Validators.required],
      content: ['', Validators.required],
    });

    // Initialize the ngx editor
    this.ngxEditor = new NgxEditor();
    this.toolbar = this.configureToolbar();
  }

  ngOnInit() {
    this.loadPlaceholders();

    // Load template data if in edit mode
    this.route.queryParams.subscribe((params) => {
      if (params['id'] && params['mode'] === 'edit') {
        this.isEditMode = true;
        this.currentTemplateId = params['id'];
        this.loadTemplateData(params['id']);
      }
    });
  }

  // Toggle visibility of a category in the placeholder list
  toggleCategory(index: number): void {
    if (this.categories && this.categories[index]) {
      this.categories[index].expanded = !this.categories[index].expanded;
      this.cd.detectChanges();
    }
  }

  // Load existing template data and populate the form
  private loadTemplateData(id: number) {
    this.emailTemplateService.getTemplateById(id).subscribe({
      next: (template) => {
        this.group.patchValue({
          templateTitle: template.templateTitle,
          description: template.description,
          emailFrom: template.emailFrom,
          emailTo: template.emailTo,
          subjectLine: template.subject,
          content: template.content,
        });
        this.cd.markForCheck();
      },
      error: (error) => console.error('Error loading template:', error),
    });
  }

  // Clean up editor instances when component is destroyed
  ngOnDestroy(): void {
    this.ngxEditor.destroy();
    this.tiptapEditor.destroy();
  }

  // Save or update a template
  private saveTemplate(templateData: EmailTemplate) {
    const operation =
      this.isEditMode && this.currentTemplateId
        ? this.emailTemplateService.updateTemplate(this.currentTemplateId, templateData)
        : this.emailTemplateService.createTemplate(templateData);

    operation.subscribe({
      next: (response) => {
        console.log('Template saved:', response);
        this.router.navigate(['/overview']);
      },
      error: (error) => console.error('Error:', error),
    });
  }

  // Load placeholders and organize them by category
  private loadPlaceholders(): void {
    this.placeholderService.getPlaceholders().subscribe({
      next: (data) => {
        console.log('Loaded placeholders:', data);
        this.placeholders = data;

        // Extract unique categories from placeholders
        const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
        this.categories = uniqueCategories.map((category) => ({
          name: category,
          expanded: false,
        }));

        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading placeholders:', error);
      },
    });
  }

  // Define the toolbar options for the ngx editor
  private configureToolbar(): Toolbar {
    return [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
      ['horizontal_rule'],
    ];
  }

  // Handle insertion of a placeholder selected from the dropdown
  onPlaceholderSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    if (selectedValue && this.ngxEditor) {
      console.log('Inserting placeholder:', selectedValue);
      this.tiptapEditor
        .chain()
        .focus()
        .insertContent({
          type: 'placeholder',
          attrs: { placeholder: selectedValue },
        })
        .run();
    }
  }

  // Track which input field is currently focused
  onEditorFocus(): void {
    this.currentField = 'content';
  }

  onEditorSelectionChange(): void {
    this.currentField = 'content';
  }

  // Insert a placeholder into the appropriate form field or editor
  insertPlaceholder(placeholder: string): void {
    if (!this.currentField) {
      alert('Bitte zuerst in ein Feld klicken, bevor du einen Platzhalter einfügst.');
      return;
    }

    if (this.currentField === 'content' && this.ngxEditor) {
      this.tiptapEditor
        .chain()
        .focus()
        .insertContent({
          type: 'placeholder',
          attrs: { placeholder },
        })
        .run();
    } else {
      const control = this.group.get(this.currentField);
      if (control) {
        const currentValue = control.value || '';
        control.setValue(currentValue + ' ' + placeholder);
      }
    }
  }

  // Save handler (draft status by default)
  onSave(): void {
    if (!this.currentTemplateId) {
      console.error('Fehler: Template-ID ist nicht gesetzt.');
      return;
    }

    const templateData: EmailTemplate = {
      templateId: this.currentTemplateId,
      templateTitle: this.group.get('templateTitle')?.value ?? '',
      description: this.group.get('description')?.value ?? '',
      emailFrom: this.group.get('emailFrom')?.value ?? '',
      emailTo: this.group.get('emailTo')?.value ?? '',
      subject: this.group.get('subjectLine')?.value ?? '',
      content: this.group.get('content')?.value ?? '',
      status: 'draft',
    };

    this.emailTemplateService.createTemplate(templateData).subscribe({
      next: (response) => {
        console.log('Template saved:', response);
        this.router.navigate(['/overview']);
      },
      error: (error) => {
        console.error('Error saving template:', error);
      },
    });
  }

  // Navigate away without saving
  onCancel(): void {
    this.router.navigate(['/overview']);
  }

  // Shortcut for returning to studies overview
  goBackToStudies(): void {
    this.router.navigate(['/overview']);
  }

  // Save as draft with status flag
  onSaveAsDraft(): void {
    try {
      const templateData: EmailTemplate = {
        ...this.getFormData(),
        status: 'draft',
      };
      this.saveTemplate(templateData);
    } catch (error) {
      console.error(error);
    }
  }

  // Save and release with status flag
  onSaveAndRelease(): void {
    try {
      const templateData: EmailTemplate = {
        ...this.getFormData(),
        status: 'released',
      };
      this.saveTemplate(templateData);
    } catch (error) {
      console.error(error);
    }
  }

  // Helper method to get form values in correct structure
  private getFormData() {
    return {
      templateTitle: this.group.get('templateTitle')?.value,
      description: this.group.get('description')?.value,
      emailFrom: this.group.get('emailFrom')?.value,
      emailTo: this.group.get('emailTo')?.value,
      subject: this.group.get('subjectLine')?.value,
      content: this.group.get('content')?.value,
    };
  }
}

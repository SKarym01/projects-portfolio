import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { EmailTemplate } from './utils/email-template.model'; // Import email template model

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService {
  // Inject HttpClient for making HTTP requests
  private http = inject(HttpClient);

  // Base URL for the backend API
  private apiUrl = 'http://localhost:3000/email-template';

  // Create a new email template
  createTemplate(templateData: EmailTemplate): Observable<EmailTemplate> {
    console.log('Service sending data:', templateData);
    return this.http.post<EmailTemplate>(`${this.apiUrl}/newTemp`, templateData);
  }

  // Get all existing email templates
  getAllTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`${this.apiUrl}/allTemplates`);
  }

  // Fetch a specific template by its ID
  getTemplateById(templateId: number): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`${this.apiUrl}/${templateId}`);
  }

  // Update an existing template partially by ID
  updateTemplate(
    id: number,
    templateData: Partial<EmailTemplate>
  ): Observable<EmailTemplate> {
    return this.http.patch<EmailTemplate>(`${this.apiUrl}/${id}`, templateData);
  }

  // Soft-delete or remove a template by ID
  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

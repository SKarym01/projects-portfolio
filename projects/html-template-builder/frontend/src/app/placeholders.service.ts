import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for placeholder data structure
interface Placeholder {
  id: string; // Unique identifier
  key: string; // Placeholder key used in templates
  description: string; // Description shown to the user
  category: string; // Category used for grouping in the UI
  display_order: number; // Order for displaying in lists
}

@Injectable({
  providedIn: 'root',
})
export class PlaceholderService {
  // Backend API URL for retrieving placeholders
  private apiUrl = 'http://localhost:3000/placeholders'; // Backend-URL

  constructor(private http: HttpClient) {}

  // Fetches all placeholders from the backend
  getPlaceholders(): Observable<Placeholder[]> {
    return this.http.get<Placeholder[]>(this.apiUrl);
  }
}

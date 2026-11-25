// Core Angular component import
import { Component } from '@angular/core';

// UI components and directives
import { CardComponent } from '../../elements/card/card.component';
import { CardListDirective } from '../../elements/card/card-list.directive';
import { HomeOverviewTableComponent } from './home-overview/home-overview-table.component';
import { HomeOverviewTableComponent as HomeOverviewTableComponent_1 } from './home-overview/home-overview-table.component';
import { AddTemplateComponent } from '../add-template/add-template.component';
import { ButtonComponent } from '../../elements/buttons/button/button.component';
import { ButtonSize } from '../../elements/buttons/button-enum';

// Router and common module
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    HomeOverviewTableComponent,
    CardComponent,
    CardListDirective,
    HomeOverviewTableComponent_1,
    AddTemplateComponent,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  // Enum used in button template
  protected readonly ButtonSize = ButtonSize;

  // Controls whether the email form is shown
  showEmailForm = false;

  constructor(private router: Router) {}

  // Navigates to the route for creating a new email template
  navigateToNewTemplate(): void {
    this.router.navigate(['/addnewtemp']);
  }

  // Cancels the current form and hides it
  onCancel(): void {
    this.showEmailForm = false;
  }

  // Navigates to the overview and hides the form
  navigateToOverview(): void {
    this.showEmailForm = false;
    this.router.navigate(['/overview']);
  }
}

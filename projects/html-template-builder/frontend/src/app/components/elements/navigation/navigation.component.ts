import { Component, OnInit } from '@angular/core';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonPriority } from '../buttons/button-enum';
import { ButtonComponent } from '../buttons/button/button.component';
import { ButtonSize } from '../../elements/buttons/button-enum';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    RouterLinkActive,
    ButtonComponent,
  ],
})
export class NavigationComponent implements OnInit {
  isLoading = false;
  protected readonly ButtonSize = ButtonSize;
  protected readonly nctIitPortfolioUrl = environment.nctIitPortfolioUrl;

  constructor(
    private library: FaIconLibrary,
    private router: Router
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // TODO replace with final Auth service when available
  protected userAuth!: string;
  protected readonly ButtonPriority = ButtonPriority;

  isActiveRoute(): boolean {
    return (
      this.router.url.includes('/overview') || this.router.url.includes('/addnewtemp')
    );
  }

  navigateToNewTemplate(): void {
    if (this.nctIitPortfolioUrl) {
      window.open(this.nctIitPortfolioUrl, '_blank', 'noopener,noreferrer');
    }
  }
}

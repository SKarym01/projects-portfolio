import { Component, Input } from '@angular/core';

/**
 * A simple card component with an optional header.
 *
 * TIP: Use the appCardList directive on a surrounding div to arrange multiple cards with proper spacing
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  /** if not provided, then no header will be rendered */
  @Input({ required: false }) headerText?: string;
}

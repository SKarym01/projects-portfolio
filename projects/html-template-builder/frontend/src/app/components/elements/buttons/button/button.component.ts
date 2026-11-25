import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonPriority, ButtonSize } from '../button-enum';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: '../button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() className?: string;
  @Input() priority: ButtonPriority = ButtonPriority.PRIMARY;
  @Input() size: ButtonSize = ButtonSize.MEDIUM;
  @Input() disabled?: boolean;
  @Input() expanded?: boolean;
  @Output() btnClick = new EventEmitter<Event>();
  @Input() link?: string;

  constructor(private router: Router) {}
  get buttonClass(): string {
    return [
      'btn',
      `btn--${this.priority}`,
      `btn--${this.size}`,
      this.expanded && 'btn--expanded',
      this.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  handleClick(event: Event) {
    this.btnClick.emit(event);
    const externalLink = this.link?.includes('https://');

    if (this.link) {
      if (externalLink) {
        window.location.href = this.link as string;
      } else {
        const route = Array.isArray(this.link) ? this.link : [this.link];
        this.router.navigate(route);
      }
    }
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonPriority, ButtonSize } from '../button-enum';

@Component({
  selector: 'app-button-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button-link.component.html',
  styleUrl: '../button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLinkComponent {
  @Input() className?: string;
  @Input() priority: ButtonPriority = ButtonPriority.PRIMARY;
  @Input() size: ButtonSize = ButtonSize.MEDIUM;
  @Input() disabled?: boolean;
  @Input() expanded?: boolean;
  @Output() btnClick = new EventEmitter<void>();
  @Input() link?: string;

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

  handleClick() {
    console.log('button link clicked');
  }
}

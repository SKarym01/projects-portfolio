import { Component } from '@angular/core';
import { AngularNodeViewComponent } from 'ngx-tiptap';

@Component({
  selector: 'app-placeholder-node',
  template: `<span class="placeholder-node">{{ node.attrs['placeholder'] }}</span>`,
  styles: [
    `
      .placeholder-node {
        background-color: #e0e0e0;
        border: 1px solid #ccc;
        padding: 2px 4px;
        border-radius: 4px;
        user-select: none;
        font-weight: bold;
        color: gray;
      }
    `,
  ],
})
export class PlaceholderNodeComponent extends AngularNodeViewComponent {}

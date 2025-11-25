import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-skeleton.component.html',
})
export class LoadingSkeletonComponent {
  @Input() count = 3;
  @Input() avatar = true;
  @Input() lines = 3;
  @Input() className = ''; // extra styling
  @Input() text = ''; // Optional loading text

  get lineArray(): number[] {
    return Array.from({ length: this.lines }, (_, i) => i);
  }

  get skeletonArray(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}


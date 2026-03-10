import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGroup, FilterState } from './filter.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.css'
})
export class FilterPanelComponent {
  @Input() groups: FilterGroup[] = [];
  @Input() state: FilterState = {};

  @Output() stateChange = new EventEmitter<FilterState>();
  @Output() clear = new EventEmitter<void>();

  collapsed = false;
  
  ngOnInit() {
    //Collapse on small screens by default
    if (window.innerWidth <= 768) {
      this.collapsed = true;
    }
  }

  ngOnChanges() {
    const tagsGroup = this.groups.find(g => g.key === 'tags');
    const typesGroup = this.groups.find(g => g.key === 'types');
    if (tagsGroup) {
      tagsGroup.options.sort((a, b) => a.label.localeCompare(b.label));
    }
    if (typesGroup) {
      typesGroup.options.sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  toggle(groupKey: string, value: string) {
    const current: string[] = this.state[groupKey] ?? [];

    const updated: string[] = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];

    this.stateChange.emit({
      ...this.state,
      [groupKey]: updated
    });
  }

  isSelected(groupKey: string, value: string): boolean {
    return this.state[groupKey]?.includes(value) ?? false;
  }
}

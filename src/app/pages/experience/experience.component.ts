import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience, ExperienceType } from '../../interfaces/experience.interface';
import { FilterGroup, FilterState } from '../../shared/filter-panel/filter.model';
import { FilterPanelComponent } from '../../shared/filter-panel/filter-panel.component';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, FilterPanelComponent, MarkdownModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  experiences: Experience[] = [];
  expandedCards: Set<Experience> = new Set();

  // filter state object
  filterState: FilterState = {};

  constructor(private titleService: Title, private dataService: DataService) {
    this.titleService.setTitle('Experience | Evan Brooks Portfolio');
  }

  ngOnInit() {
    this.dataService.getExperiences().subscribe((data) => {
      //sort experiences by endDate descending ('Present' is newest)
      this.experiences = data.sort((a, b) => {
        const getDate = (d: string) =>
          d.toLowerCase() === 'present' ? new Date() : new Date(d);
        return getDate(b.endDate).getTime() - getDate(a.endDate).getTime();
      });
    });
  }

  toggleCard(exp: Experience) {
    if (this.expandedCards.has(exp)) {
      this.expandedCards.delete(exp);
    } else {
      this.expandedCards.add(exp);
    }
  }

  isExpanded(exp: Experience): boolean {
    return this.expandedCards.has(exp);
  }

  get filterGroups(): FilterGroup[] {
    return [
      {
        key: 'type',
        label: 'Experience Type',
        multi: true,
        options: (['job', 'research', 'teaching', 'education'] as ExperienceType[])
          .map((t: ExperienceType) => ({ label: t, value: t }))
      },
      {
        key: 'tags',
        label: 'Tags',
        multi: true,
        options: Array.from(
          new Set(this.experiences.flatMap(e => e.tags ?? []))
        ).map((t: string) => ({ label: t, value: t }))
      }
    ];
  }

  get filteredExperiences(): Experience[] {
    return this.experiences.filter(exp => {
      const types = this.filterState['type'] as ExperienceType[] | undefined;
      const tags = this.filterState['tags'] as string[] | undefined;

      if (types?.length && !types.includes(exp.type)) return false;
      if (tags?.length && !tags.some(t => exp.tags?.includes(t))) return false;

      return true;
    });
  }
}

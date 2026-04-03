import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../interfaces/project.interface';
import { ProjectCarouselComponent } from '../project-carousel/project-carousel.component';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, ProjectCarouselComponent, MarkdownModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
})
export class ProjectCardComponent {
  @HostListener('document:keydown.escape')
  onEscape() {
    this.expandedProject = null;
  }
  
  @Input() projects: Project[] = [];
  expandedProject: Project | null = null;

  stop(e: Event) {
    e.stopPropagation();
  }

  toggleCard(proj: Project) {
    if (this.expandedProject === proj) {
      this.expandedProject = null; 
    } else {
      this.expandedProject = proj; 
    }
  }

  isExpanded(proj: Project): boolean {
    return this.expandedProject === proj;
  }

  getTypeClass(type: string): string {
    return 'type-' + type.toLowerCase().replace(/[\s\/]/g, '-');
  }

  get expandedProjectMarkdown(): string {
    const p = this.expandedProject;
    if (!p) return '';

    const sections: string[] = [];

    if (p.overview)      sections.push(`## Overview\n${p.overview}`);
    if (p.motivation)    sections.push(`## Motivation\n${p.motivation}`);
    if (p.plan)          sections.push(`## Plan\n${p.plan}`);
    if (p.architecture)  sections.push(`## Architecture\n${p.architecture}`);
    if (p.hardware?.length) sections.push(`## Hardware\n${p.hardware.map(h => `- ${h}`).join('\n')}`);
    if (p.design)        sections.push(`## Design\n${p.design}`);
    if (p.features?.length) sections.push(`## Features\n${p.features.map(f => `- ${f}`).join('\n')}`);
    if (p.challenges?.length) {
      const lines = p.challenges.map((c, i) =>
        `${i + 1}. **Problem:** ${c.problem}\n\n   **Solution:** ${c.solution}`
      ).join('\n\n');
      sections.push(`## Challenges\n${lines}`);
    }
    if (p.learned)       sections.push(`## What I Learned\n${p.learned}`);

    return `---\n${sections.join('\n\n')}\n\n---`;
  }
}

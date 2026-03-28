export type Category =
  | 'core'
  | 'knowledge'
  | 'satellite'
  | 'agent'
  | 'evolving'
  | 'external'
  | 'low-confidence';

export type Status =
  | 'built'
  | 'built-partial'
  | 'in-development'
  | 'specced'
  | 'deferred'
  | 'existing-partial';

export interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  category: Category;
  status: Status;
  badge?: string;
  parent?: string;
  position: { x: number; y: number };
  what?: string;
  why?: string;
  how?: string;
  why_deferred?: string;
  strategic_context?: string;
  decisions?: string[];
  open_questions?: string[];
  status_detail?: string;
  style?: 'dashed';
}

export interface ArchConnector {
  id: string;
  from: string;
  to: string;
  label?: string;
  description?: string;
  style?: 'dashed' | 'highlighted' | 'curved';
}

export interface NarrativeChapter {
  title: string;
  body: string;
}

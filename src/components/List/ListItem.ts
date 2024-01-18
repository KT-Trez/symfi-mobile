import type { BaseListItem } from 'types';

export class ListItem implements BaseListItem {
  constructor(public id: string) {}
}

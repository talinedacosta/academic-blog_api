/**
 * Post Entity
 */
export class Post {
  id?: number;
  title: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
  updated_by?: number;
  created_by_name?: string;
  updated_by_name?: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
}

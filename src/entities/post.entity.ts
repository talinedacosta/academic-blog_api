export class Post {
  id?: number;
  title: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
  updated_by?: number;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
}

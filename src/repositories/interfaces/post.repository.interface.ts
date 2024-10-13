import { Post } from "@/entities/post.entity";
import { User } from "@/entities/user.entity";

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  findByIdentifier(id: number): Promise<Post | null>;
  findAll(): Promise<Array<Post>>;
  findBySearch(search: string): Promise<Array<Post>>;
  create(post: Post, user: User): Promise<Post>;
  update(post: Post, user: User): Promise<Post | null>;
  remove(id: number): Promise<boolean>;
}

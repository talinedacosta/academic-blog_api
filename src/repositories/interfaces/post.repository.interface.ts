import { Post } from "@/entities/post.entity";
import { User } from "@/entities/user.entity";

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  findAll(): Promise<Array<Post>>;
  create(post: Post, user: User): Promise<Post>;
  update(post: Post, user: User): Promise<Post | null>;
  delete(id: number): Promise<boolean>;
}

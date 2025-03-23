import { User } from "./User";

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  author: User;
  authorId: number;
  comment_count: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  postId: string;
}

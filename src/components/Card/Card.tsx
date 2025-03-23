import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../types/Blog";

const Card = React.memo(({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="min-w-[155px] md:min-w-[170px] lg:min-w-[180px] flex flex-col bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-sm md:text-base truncate text-slate-900 mb-1 sm:mb-2">{post.title}</h2>
          <p className="text-xs md:text-sm text-slate-500">{post.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm text-slate-500">{new Date(post.createdAt).getFullYear()}</p>
            <div className="flex items-center gap-1">
              <p className="text-xs md:text-sm text-slate-500">{post.comment_count}</p>
              <img src="/icon/comment.svg" alt="comment" className="w-4 h-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
});

export default Card;

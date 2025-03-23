import { useEffect } from "react";
import { useBlog } from "../src/context/BlogContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { posts, fetchPosts, error } = useBlog();
  const [featuredPost, ...latestPosts] = posts;

  useEffect(() => {
    fetchPosts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (posts.length === 0) return <div>No posts found</div>;

  return (
    <section className="py-10">
      <div className="pb-12">
        <h1 className="text-3xl md:text-[42px] font-semibold font-integralCF text-center pb-6">Blogs</h1>
        {featuredPost && (
          <div key={featuredPost.id} className="w-full flex gap-7">
            <div className="basis-1/2">
              <Link to={`/blog/${featuredPost.id}`} className="w-full">
                <img src={"/images/blog.webp"} width={500} height={500} alt={featuredPost.title} className="w-full rounded-xl" />
              </Link>
            </div>
            <div className="max-w-[450px] flex flex-col justify-center basis-1/2">
              <Link to={`/blog/${featuredPost.id}`} className="text-2xl font-bold">
                {featuredPost.title}
              </Link>
              <p className="text-base text-slate-500">{featuredPost.description}</p>
            </div>
          </div>
        )}
      </div>
      <hr className="bg-gray-400" />
      <div className="pt-10">
        <h2 className="text-3xl md:text-[42px] font-semibold font-integralCF text-center pb-6">Latest Article</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {latestPosts.map((post) => (
            <div key={post.id}>
              <Link to={`/blog/${post.id}`} className="w-full">
                <img src={"/images/blog.webp"} width={500} height={500} alt={post.title} className="w-full rounded-xl" />
              </Link>
              <Link to={`/blog/${post.id}`} className="text-lg font-semibold">
                {post.title}
              </Link>
              <p className="text-sm text-slate-500">{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../src/context/BlogContext";
import { useAuth } from "../src/context/AuthContext";
// import Review from "../src/components/Review/Review";

export default function BlogDetails() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const { currentPost, loading, fetchPost, deletePost } = useBlog();
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleDelete = async () => {
    if (postId) {
      await deletePost(postId);
      navigate("/");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!currentPost) return <div>No post details found</div>;

  const formattedDate = new Date(currentPost?.createdAt || "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-10">
      <div className="max-w-3xl mx-auto px-0 sm:px-6">
        <h1 className="mt-2 mb-4 text-2xl md:text-4xl text-center leading-8 font-bold tracking-tight">{currentPost?.title}</h1>
        {user && (
          <div className="flex gap-2">
            <Link to={`/edit/${postId}`} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Edit
            </Link>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        )}
        <p className="text-center text-sm text-gray-500">{formattedDate}</p>
        <div className="px-5 flex flex-col items-center">
          <img src={"/images/blog.webp"} width={750} height={750} alt={currentPost?.title} className="mt-8 rounded-lg" />

          <div className="mt-8 max-w-[750px]">
            <p>{currentPost?.description}</p>
          </div>
        </div>
      </div>
      {/* <Review allReview={currentPost?.reviews} productId={currentPost?.id} userId={user?.id} userName={user?.name} /> */}
    </section>
  );
}

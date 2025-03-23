import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBlog } from "../src/context/BlogContext";
import { useAuth } from "../src/context/AuthContext";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function EditPost() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { currentPost, loading, error, fetchPost, updatePost, clearCurrentPost } = useBlog();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Memoize the reset function to prevent unnecessary re-renders
  const resetForm = useCallback(() => {
    if (currentPost) {
      reset({
        title: currentPost.title,
        description: currentPost.description,
        content: currentPost.content,
      });
    }
  }, [currentPost, reset]);

  // Fetch post data when component mounts or postId changes
  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
    return () => {
      clearCurrentPost();
    };
  }, [postId, fetchPost, clearCurrentPost]);

  // Reset form when currentPost changes
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Check if user is authorized to edit the post
  useEffect(() => {
    if (currentPost && user && Number(user.id) !== currentPost.authorId) {
      navigate("/");
    }
  }, [currentPost, user, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!postId || !user) return;

    try {
      await updatePost(postId, {
        ...data,
        authorId: Number(user.id),
      });
      navigate(`/blog/${postId}`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!currentPost) return <div className="text-center">Post not found</div>;
  if (user && Number(user.id) !== currentPost.authorId) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              {...register("description")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              rows={10}
              {...register("content")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/blog/${postId}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

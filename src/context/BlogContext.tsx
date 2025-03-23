import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import { BlogPost } from "../types/Blog";

interface BlogContextType {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  setCurrentPost: (post: BlogPost | null) => void;
  clearCurrentPost: () => void;
  fetchPosts: (page?: number) => Promise<void>;
  fetchPost: (id: string) => Promise<void>;
  createPost: (data: Omit<BlogPost, "id" | "author" | "createdAt">) => Promise<void>;
  updatePost: (id: string, data: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const clearCurrentPost = useCallback(() => {
    setCurrentPost(null);
  }, []);

  const fetchPosts = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts?page=${page}`);
      setPosts(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch posts");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPost = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      setCurrentPost(response.data.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch post");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data: Omit<BlogPost, "id" | "author" | "createdAt">) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, data, {
        withCredentials: true,
      });
      setPosts((prev) => [response.data.data, ...prev]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create post");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(
    async (id: string, data: Partial<BlogPost>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, data, {
          withCredentials: true,
        });
        setPosts((prev) => prev.map((post) => (post.id === id ? response.data : post)));
        if (currentPost?.id === id) {
          setCurrentPost(response.data);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to update post");
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentPost]
  );

  const deletePost = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
          withCredentials: true,
        });
        setPosts((prev) => prev.filter((post) => post.id !== id));
        if (currentPost?.id === id) {
          setCurrentPost(null);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to delete post");
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentPost]
  );

  // Only fetch posts on initial mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <BlogContext.Provider
      value={{
        posts,
        currentPost,
        loading,
        error,
        totalPages,
        setCurrentPost,
        clearCurrentPost,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}

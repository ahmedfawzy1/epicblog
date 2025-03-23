import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const BlogPost = lazy(() => import("../pages/BlogPost"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const CreatePost = lazy(() => import("../pages/CreatePost"));
const EditPost = lazy(() => import("../pages/EditPost"));

export default function Router() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:postId" element={<EditPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Suspense>
  );
}

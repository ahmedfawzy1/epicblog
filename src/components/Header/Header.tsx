import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  {
    label: "Home",
    href: "/",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const authLinks = user ? (
    <>
      <Link to="/create" className="block px-8 py-4 text-white hover:bg-gray-800 transition-colors rounded-t-lg">
        Create Post
      </Link>
      <button onClick={logout} className="block px-8 py-4 text-white hover:bg-gray-800 transition-colors rounded-t-lg">
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="block px-8 py-4 text-white hover:bg-gray-800 transition-colors rounded-t-lg">
        Login
      </Link>
      <Link to="/register" className="block px-8 py-4 text-white hover:bg-gray-800 transition-colors rounded-t-lg">
        Register
      </Link>
    </>
  );

  return (
    <header className="w-full bg-[#032541] text-white flex justify-between items-center px-8 py-4 sticky top-0 z-10 shadow-lg">
      <div className="flex items-center">
        <Link to={"/"} className="text-2xl font-bold hover:text-gray-300 transition-colors">
          Blog
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-4">
        {links.map((link) => (
          <Link key={link.label} to={link.href} className="text-white hover:text-gray-300 transition-colors">
            {link.label}
          </Link>
        ))}
        <div className="flex items-center space-x-4 ml-4">{authLinks}</div>
      </nav>
      <button
        className="md:hidden text-white hover:text-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <div
        className={`md:hidden absolute top-16 right-0 w-64 bg-[#032541] shadow-lg rounded-lg transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block px-8 py-4 text-white hover:bg-gray-800 transition-colors rounded-t-lg"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-700 flex flex-col gap-2">{authLinks}</div>
        </div>
      </div>
    </header>
  );
}

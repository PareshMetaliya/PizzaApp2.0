
import { useState } from "react";
import { Link, useNavigate } from "react-router"; // Fix: Updated import path
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { selectCart } from "@/redux/slices/cartSlice";
import { AppDispatch } from "@/redux/store";
import { getUserThunk } from "@/redux/thunk/authThunks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import cart from "../assets/cart.png";
import { Menu, X } from "lucide-react"; // Import icons for the hamburger menu
import toast from 'react-hot-toast';

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items } = useSelector(selectCart);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle mobile menu

  const itemCount = items.reduce((total, item) => total + item.quantity, 0); // Sum up item quantities

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(getUserThunk());
    }
  }, [dispatch]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 container  bg-slate-50 shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h2 className="h2-bold text-customBrown">
              Pizza{" "}
              <span className="text-customYellow bg-customBrown rounded-sm px-2">
                Rush
              </span>
            </h2>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/menu"
              className="text-customGreen font-semibold hover:text-customBrown text-xl ease-in-out hover:scale-105 transition-all duration-300 hover:border-b-2 border-customYellow"
            >
              Menu
            </Link>
            <Link
              to="/cart"
              className="relative text-customGreen font-semibold text-lg ease-in-out hover:scale-105 transition-all duration-300"
            >
              <img src={cart} alt="cart" width={20} height={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Avatar Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/men/10.jpg"
                      alt="logo"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logout());
                      toast.success('Log Out Successfully !')
                    }}
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login/nav" className="text-customGreen font-semibold">
                Log In
              </Link>
            )}
          </div>

          {/* Mobile Navigation (Cart and Avatar/Login) */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Cart Icon (Always Visible) */}
            <Link
              to="/cart"
              className="relative text-customGreen font-semibold text-lg ease-in-out hover:scale-105 transition-all duration-300"
            >
              <img src={cart} alt="cart" width={20} height={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Avatar/Login (Always Visible) */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/men/10.jpg"
                      alt="logo"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logout());
                    }}
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login/nav" className="text-customGreen font-semibold">
                Log In
              </Link>
            )}

            {/* Hamburger Menu (Toggles Menu and Profile/Login Links) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-customGreen focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Collapsible) */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/menu"
                className="text-customGreen font-semibold hover:text-customBrown text-xl ease-in-out hover:scale-105 transition-all duration-300 hover:border-b-2 border-customYellow"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>

              {/* Profile/Logout or Login Links (Only for Mobile) */}
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="text-customGreen font-semibold text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setIsMenuOpen(false);
                    }}
                    className="text-customGreen font-semibold text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login/nav"
                  className="text-customGreen font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router";
import { LoginInput, loginSchema } from "@/schema/userSchema";
import { loginUserApi } from "@/api/authAPI";
import { useDispatch } from "react-redux";
import { getUserThunk } from "@/redux/thunk/authThunks";
import { AppDispatch } from "@/redux/store";
import toast from 'react-hot-toast';

export default function Login() {

  const { path } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await loginUserApi(data);

      if (response.success) {
        localStorage.setItem("token", response.token); // Store JWT token
        toast.success('Login Successfully !')
        dispatch(getUserThunk());

        if (path === "nav") {
          navigate("/");
        }

        if (path === "cart") {
          navigate("/cart");
        }

      } else {
        setErrorMessage(response.message || "Login failed!");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded-md"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}

            <Link to="/signup" className="text-blue-500 font-bold"> Sign Up</Link>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-evenly mt-2 border-t-2 border-gray-400">
          <div className="mt-4">
            <h2 className="text-gray-800 text-sm font-semibold">
              Admin
            </h2>
            <p className="text-gray-600 text-xs">
              Email: admin@gmail.com
            </p>
            <p className="text-gray-600 text-xs">
              password: admin
            </p>
          </div>

          <div className="mt-4">
            <h2 className="text-gray-800 text-sm font-semibold">
              User
            </h2>
            <p className="text-gray-600 text-xs">
              Email: user@gmail.com
            </p>
            <p className="text-gray-600 text-xs">
              password: user
            </p>
          </div>

        </div>
       


      </div>
    </div>
  );
}

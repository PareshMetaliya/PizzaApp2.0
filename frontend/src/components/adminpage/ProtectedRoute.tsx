import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";

const ProtectedRoute = () => {

    const user = useSelector(selectUser);

  if (!user?.isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Admin Only</h1>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

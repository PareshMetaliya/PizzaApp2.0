
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getAllPizzaThunk } from "@/redux/thunk/pizzaThunks";
import { selectpizzas } from "@/redux/slices/pizzaSlice";
import { GetPizzasQueryParams, PizzaResponse } from "@/schema/pizzaSchema";
import ProductCard from "./landingpage/ProductCard";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import ProductCardSkeleton from "@/skeleton/ProductCardSkeleton";

const Menu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const { pizzas, totalPages, currentPage, loading } = useSelector(selectpizzas);

  const query: GetPizzasQueryParams = {
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "6", 10),
    sortBy: (searchParams.get("sortBy") as "priceAsc" | "priceDesc") || undefined,
    category: (searchParams.get("category") as "Veg" | "Non-Veg") || undefined,
    size: (searchParams.get("size") as "Small" | "Medium" | "Large") || undefined,
    minPrice: searchParams.has("minPrice") ? parseInt(searchParams.get("minPrice") || "100", 10) : undefined,
    maxPrice: searchParams.has("maxPrice") ? parseInt(searchParams.get("maxPrice") || "500", 10) : undefined,
  };

  useEffect(() => {
    dispatch(getAllPizzaThunk(query));
  }, [searchParams]);

  const updateQuery = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams);

    // Reset page to 1 whenever any query parameter is updated
    params.set("page", "1");

    if (value === "all" || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
    navigate(`?${params.toString()}`);
  };

  // Custom debounce function
  const debounce = (callback: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId); // Clear the previous timeout
      timeoutId = setTimeout(() => callback(...args), delay); // Set a new timeout
    };
  };

  // Debounced version of updateQuery
  const debouncedUpdateQuery = debounce(updateQuery, 500); // 500ms delay

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const skeletonNumber = ["0","1","2","3","4","5","6","7","8","9"]

  return (
    <div className="container flex flex-col md:flex-row gap-4 p-4 container mt-20">
      {/* Sort and Filters on Small Screens */}
      <div className="flex justify-between items-center w-full md:hidden">
        <div className="flex gap-2">
          <label className="mr-2">Sort by Price:</label>
          <select
            className="p-2 border rounded"
            onChange={(e) => updateQuery("sortBy", e.target.value)}
            value={searchParams.get("sortBy") || "priceAsc"}
          >
            <option value="priceAsc">Low to High</option>
            <option value="priceDesc">High to Low</option>
          </select>
        </div>

        <button
          className="p-2 bg-gray-300 rounded-lg"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Sidebar Filters for Larger Screens */}
      <aside
        className={`hidden md:block md:w-1/4 bg-gray-100 p-4 rounded-lg shadow`}
      >
        <h2 className="font-bold mb-2">Filters</h2>
        <div>
          <label>Type:</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => updateQuery("category", e.target.value)}
            value={searchParams.get("category") || "all"}
          >
            <option value="all">All</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>
        <div>
          <label>Size:</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => updateQuery("size", e.target.value)}
            value={searchParams.get("size") || "all"}
          >
            <option value="all">All</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <div>
          <label>Min Price: {searchParams.get("minPrice") || 100}</label>
          <input
            type="range"
            min="100"
            max="500"
            value={searchParams.get("minPrice") || 100}
            onChange={(e) => debouncedUpdateQuery("minPrice", e.target.value)} // Debounced
            className="w-full"
          />
        </div>
        <div>
          <label>Max Price: {searchParams.get("maxPrice") || 500}</label>
          <input
            type="range"
            min="100"
            max="500"
            value={searchParams.get("maxPrice") || 500}
            onChange={(e) => debouncedUpdateQuery("maxPrice", e.target.value)} // Debounced
            className="w-full"
          />
        </div>
      </aside>

      {/* Mobile Filters (Dropdown beside Sort) */}
      {showFilters && (
        <aside className="absolute top-24 right-4 md:hidden bg-white border p-4 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Filters</h2>
            <button
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={() => setShowFilters(false)}
            >
              <CloseIcon size={20} />
            </button>
          </div>
          <div>
            <label>Type:</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => updateQuery("category", e.target.value)}
              value={searchParams.get("category") || "all"}
            >
              <option value="all">All</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>
          <div>
            <label>Size:</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => updateQuery("size", e.target.value)}
              value={searchParams.get("size") || "all"}
            >
              <option value="all">All</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div>
            <label>Min Price: {searchParams.get("minPrice") || 100}</label>
            <input
              type="range"
              min="100"
              max="500"
              value={searchParams.get("minPrice") || 100}
              onChange={(e) => debouncedUpdateQuery("minPrice", e.target.value)} // Debounced
              className="w-full"
            />
          </div>
          <div>
            <label>Max Price: {searchParams.get("maxPrice") || 500}</label>
            <input
              type="range"
              min="100"
              max="500"
              value={searchParams.get("maxPrice") || 500}
              onChange={(e) => debouncedUpdateQuery("maxPrice", e.target.value)} // Debounced
              className="w-full"
            />
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="w-full md:w-3/4">
        {/* Sort By */}
        <div className="flex justify-end mb-4 hidden md:block">
          <label className="mr-2">Sort by Price:</label>
          <select
            className="p-2 border rounded"
            onChange={(e) => updateQuery("sortBy", e.target.value)}
            value={searchParams.get("sortBy") || "priceAsc"}
          >
            <option value="priceAsc">Low to High</option>
            <option value="priceDesc">High to Low</option>
          </select>
        </div>

        {/* Pizza Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {loading ?

            skeletonNumber.map((i) => (

              <ProductCardSkeleton key={i} />

            ))
            :
            pizzas.map((pizza: PizzaResponse) => (
              <ProductCard key={pizza._id} pizza={pizza} />
            ))

          }





        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage <= 1}
            onClick={() => updateQuery("page", currentPage - 1)}
          >
            Previous
          </Button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            disabled={currentPage >= totalPages}
            onClick={() => updateQuery("page", currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Menu;

import { Link } from "react-router"; // Fix: Updated import path

interface ProductCardProps {
  pizza: {
    _id: string;
    name: string;
    description?: string;
    image: string;
    category: "Veg" | "Non-Veg";
    sizes: { size: "Small" | "Medium" | "Large"; price: number }[];
  };
}

function ProductCard({ pizza }: ProductCardProps) {
  const { _id, name, description, image, category, sizes } = pizza;

  // Convert size names to short form (S, M, L)
  const sizeMap: Record<string, string> = {
    Small: "S",
    Medium: "M",
    Large: "L",
  };

  // Get the base price from the first available size
  const basePrice = sizes.length > 0 ? sizes[0].price : 0;

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Pizza Image */}
      <div className="flex justify-center p-4 h-40">
        <img
          src={image}
          alt={name}
          className="w-[160px] h-[160px] object-cover rounded-lg" // Fixed height for image
        />
      </div>

      {/* Pizza Details */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        {/* Name and Category */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            {name}
          </h2>
          <span
            className={`px-2 py-1 text-sm rounded-md ${
              category === "Veg"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {category === "Veg" ? "✅" : "🔴"}
          </span>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600 h-12 overflow-hidden truncate w-[200px]">
          {description || "Delicious pizza made with fresh ingredients."}
        </div>

        {/* Sizes and Prices */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Sizes & Prices
          </h3>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {sizeMap[size.size] || size.size}: ₹{size.price}
              </span>
            ))}
          </div>
        </div>

        {/* Base Price */}
        <p className="text-lg font-bold text-gray-900 mt-2">
          From ₹{basePrice}
        </p>

        {/* Order Now Button */}
        <Link
          to={`/menu/${_id}`}
          className="mt-4 w-full text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
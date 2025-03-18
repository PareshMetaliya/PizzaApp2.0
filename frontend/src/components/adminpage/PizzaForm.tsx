import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { CreatePizzaInput } from "@/schema/pizzaSchema";


const baseURL = import.meta.env.VITE_API_BASE_URL; // Load from .env

// Zod Schema
const sizeSchema = z.object({
  size: z.enum(["Small", "Medium", "Large"]),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

const extraToppingSchema = z.object({
  name: z.string().min(1, { message: "Topping name is required" }),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

const createPizzaSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  image: z.string().url({ message: "Invalid image URL" }),
  category: z.enum(["Veg", "Non-Veg"]),
  sizes: z.array(sizeSchema).min(1, { message: "At least one size must be provided" }),
  extraToppings: z.array(extraToppingSchema).optional(),
});

const PizzaForm = ({ onSubmit, defaultValues, onClose, type }:any) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<CreatePizzaInput>({
    resolver: zodResolver(createPizzaSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      image: "",
      category: "Veg",
      sizes: [{ size: "Medium", price: 0 }],
      extraToppings: [],
    },
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: "sizes",
  });

  const {
    fields: toppingFields,
    append: appendTopping,
    remove: removeTopping,
  } = useFieldArray({
    control,
    name: "extraToppings",
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event:any) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file); // Key should match the backend expectation

    try {
      // Upload image to backend
      const response = await axios.post(`${baseURL}/api/pizzas/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Set the image URL in the form
      setValue("image", response.data.imageUrl);
    } catch (error) {
    
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFormSubmit = (data:CreatePizzaInput) => {

    onSubmit({ data, type, id: defaultValues?._id })

  }



  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        {defaultValues ? "Edit Pizza" : "Add Pizza"}
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-white mb-2">Pizza Name</label>
        <input
          {...register("name")}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter pizza name"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-white mb-2">Description</label>
        <textarea
          {...register("description")}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter pizza description"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-white mb-2">Pizza Image</label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="w-full p-2 rounded bg-gray-700 text-white"
          disabled={isUploading}
        />
        {isUploading && <p className="text-sm text-gray-400 mt-1">Uploading image...</p>}
        {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image.message}</p>}
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-white mb-2">Category</label>
        <select
          {...register("category")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>
        {errors.category && (
          <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Sizes */}
      <div className="mb-4">
        <label className="block text-white mb-2">Sizes</label>
        {sizeFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <select
              {...register(`sizes.${index}.size`)}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <input
              type="number"
              {...register(`sizes.${index}.price`, { valueAsNumber: true })}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              placeholder="Price"
            />
            <button
              type="button"
              onClick={() => removeSize(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendSize({ size: "Medium", price: 0 })}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Size
        </button>
        {errors.sizes && (
          <p className="text-red-400 text-sm mt-1">{errors.sizes.message}</p>
        )}
      </div>

      {/* Extra Toppings */}
      <div className="mb-4">
        <label className="block text-white mb-2">Extra Toppings</label>
        {toppingFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              {...register(`extraToppings.${index}.name`)}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              placeholder="Topping Name"
            />
            <input
              type="number"
              {...register(`extraToppings.${index}.price`, { valueAsNumber: true })}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              placeholder="Price"
            />
            <button
              type="button"
              onClick={() => removeTopping(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendTopping({ name: "", price: 0 })}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Topping
        </button>
        {errors.extraToppings && (
          <p className="text-red-400 text-sm mt-1">{errors.extraToppings.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {defaultValues ? "Update Pizza" : "Add Pizza"}
        </button>
      </div>
    </form>
  );
};

export default PizzaForm;
import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      required: true,
    },
    sizes: {
      type: [
        {
          size: {
            type: String,
            enum: ["Small", "Medium", "Large"],
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      validate: {
        validator: function (sizes) {
          return sizes.length > 0;
        },
        message: "At least one size must be provided",
      },
    },

    extraToppings: [
      {
        name: {
          type: String,

          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Pizza = mongoose.models.Pizza || mongoose.model("Pizza", pizzaSchema);

export default Pizza;

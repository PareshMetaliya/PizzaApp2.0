import { useForm,FieldError } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

const CheckoutModal = ({ isOpen, onClose, onSubmit }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Address */}
          <div>
            <textarea
              placeholder="Full Address"
              {...register("address", { required: "Address is required" })}
              className="w-full p-2 border rounded"
            />
            
{errors.address && (
  <p className="text-red-500 text-sm">{(errors.address as FieldError).message}</p>
)}

          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block font-semibold mb-2">Payment Method</label>
            <select
              {...register("paymentMethod")}
              className="w-full p-2 border rounded"
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          {/* Confirm Order Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Confirm Order
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;

import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getAllPizzaThunk } from "@/redux/thunk/pizzaThunks";
import { selectpizzas } from "@/redux/slices/pizzaSlice";
import { GetPizzasQueryParams } from "@/schema/pizzaSchema";
import { useEffect } from "react";
import ProductCardSkeleton from "@/skeleton/ProductCardSkeleton";

function PopularItems() {
  const dispatch = useDispatch<AppDispatch>();
  const { pizzas, loading } = useSelector(selectpizzas);

  const query: GetPizzasQueryParams = {
    page: 1,
    limit: 4,
  };

  const skeletonNumber = ["1", "2", "3", "4"];

  useEffect(() => {
    dispatch(getAllPizzaThunk(query));
  }, []);

  const pizzadata = pizzas;
  return (
    <>
      <section className="container flex flex-col mt-10 justify-center items-center ">
        <div
          className="flex flex-col items-center justify-center gap-4 pb-[8px] mb-4 "
          data-aos="zoom-in"
          data-aos-delay="850"
        >
          <h2 className="h2-bold text-customGray">Exclusive Menu For You!</h2>

          <p className="paragraph-small text-customDark text-center">
            Experience the epitome of luxury dining with our exclusive menu, a
            carefully<br></br> curated selection for our discerning patrons
          </p>
        </div>

        <div className="  grid grid-cols-4 max-xs:grid-cols-1 max-sm:grid-cols-2 max-md:grid-cols-2 max-lg:grid-cols-4 gap-2 mt-6">
          {loading
            ?
            
            skeletonNumber.map((i, index) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={`${index * 200 + 850}`}
              >
                <ProductCardSkeleton />
              </div>
            ))
            :
            pizzadata.map((pizza, index) => (
                <div
                  key={pizza._id}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 200 + 850}`}
                >
                  <ProductCard key={pizza._id} pizza={pizza} />
                </div>
              ))
            
              
              }
        </div>
      </section>
    </>
  );
}

export default PopularItems;

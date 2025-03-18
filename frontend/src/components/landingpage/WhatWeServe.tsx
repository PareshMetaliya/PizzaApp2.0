import { whatWeServeData } from "@/constants/constants";

import WhatWeServeCard from "./WhatWeServeCard";

function WhatWeServe() {
  return (
    <section className="container py-4 ">
      <div className=" bg-light-yellow ">
        <div
          className="flex flex-col justify-center items-center text-center p-4 gap-4  "
               data-aos="zoom-out"
          data-aos-delay="750"
        >
          <h3 className="h3-bold text-customBrown ">
            WHAT WE{" "}
            <span className="text-customYellow bg-customBrown rounded-sm px-2 pt-0.5">
              SERVE
            </span>
          </h3>

          <h2 className="h2-bold text-customBrown">
            Your Favourite Food Delivery Partner
          </h2>

          <p className="max-md:hidden paragraph-small text-customBrown">
            We offer a diverse and delectable selection of culinary delights
            through our online food ordering website,<br></br> ensuring a
            seamless and savory dining experience delivered right to your
            doorstep.
          </p>
        </div>

        <div className=" justify-items-center grid grid-cols-3 max-sm:grid-cols-1 h-auto px-8 mt-4 gap-8">
          {whatWeServeData.map((item, index) => (
            <div
              key={item.id}
              data-aos="zoom-in"
              data-aos-delay={`${index * 200 + 700}`}
            >
              <WhatWeServeCard
                key={item.id}
                title={item.title}
                desc={item.desc}
                desc2={item.desc2}
                imgsrc={item.imgsrc}
                id={item.id}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeServe;

import heroPizzaImage from "../../assets/heroPizzaImage.png";
import coriender from "../../assets/coriender.png";
import garlic from "../../assets/garlic.png";
import tomatoCoriender from "../../assets/tomatoCoriender.png";
import leaf_tomato from "../../assets/leaf tomato.png";
import leaf_3 from "../../assets/leaf-3.png";
import vector from "../../assets/Vector.png";
import { Link } from "react-router";

function HeroSection() {
  return (
    <header className=" bg-hero bg-cover bg-center h-auto  mt-[10vh] max-md:mt-[8vh] container  ">
      <div className="max-md:flex-col-reverse flex items-center justify-between  ">
        <aside
          className="flex items-start flex-col md:gap-6 max-md:gap-3 md:pl-10 m-2 max-md:mt-20 max-md:justify-center max-md:items-center max-md:text-center"
          data-aos="fade-right"
          data-aos-delay="800"
        >
          <h1 className="h1-bold text-customBrown">
            Your Cravings, our <br></br>
            <span className="text-customYellow">Command.</span>{" "}
          </h1>
          <p className="paragraph-regular text-customBrown">
            Savor the convenience of culinary magic!<br></br> Browse, order, and
            relish - <br></br>all in one seamless app
          </p>

          <Link to="/menu" className="btn">
            
            Explorer Menu
          </Link>
        </aside>
        <section className="flex-between relative md:mr-3 md:mt-12  max-md:justify-center max-md:items-center max-md:text-center max-md:mt-2 ">
          <img
            src={heroPizzaImage}
            alt="pizza image"
            height={420}
            width={420}
            className=" z-10 max-md:w-3/4 max-md:h-2/3 "
            // priority
            data-aos="zoom-in"
            data-aos-delay="400"
          ></img>

          <img
            src={coriender}
            alt="pizza image"
            height={80}
            width={80}
            className="absolute -top-5 left-0 max-md:w-1/2 max-md:h-1/2"
            data-aos="fade-down"
            data-aos-delay="500"
          ></img>

          <img
            src={garlic}
            alt="pizza image"
            height={80}
            width={80}
            className="absolute top-[60px] -left-[45px] "
            data-aos="fade-down-right"
            data-aos-delay="650"
          ></img>
          <img
            src={tomatoCoriender}
            alt="pizza image"
            height={150}
            width={150}
            className="absolute -top-10 -right-10 rotate-25 "
            data-aos="fade-down"
            data-aos-delay="700"
          ></img>
          <img
            src={leaf_tomato}
            alt="pizza image"
            height={120}
            width={120}
            className="absolute -bottom-12 right-2 "
             data-aos="fade-left"
            data-aos-delay="300"
          ></img>

          <img
            src={garlic}
            alt="pizza image"
            height={70}
            width={70}
            className="absolute -bottom-[50px] right-[130px] "
             data-aos="fade-left"
            data-aos-delay="400"
          ></img>
          <img
            src={leaf_3}
            alt="pizza image"
            height={140}
            width={140}
            className="absolute -bottom-[50px] -left-[30px] rotate-45 max-md:w-1/2 max-md:h-2/3
            "
            data-aos="fade-up"
            data-aos-delay="700"
          ></img>
          <img
            src={vector}
            alt="pizza image"
            height={80}
            width={80}
            className="absolute bottom-[15px] -left-[95px] rotate-40"
            data-aos="fade-up"
            data-aos-delay="700"
          ></img>
        </section>
      </div>
    </header>
  );
}

export default HeroSection;

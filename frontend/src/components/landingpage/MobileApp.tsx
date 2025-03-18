import { Link } from "react-router";
import Mobile from "../../assets/Mobile.png";
import Android from "../../assets/Android app.png";
import appleApp from "../../assets/appleApp.png";

function MobileApp() {
  return (
    <section className="container">
      <div className="bg-light-yellow flex p-20 items-center justify-evenly max-md:flex-col">
        <div
          className="flex justify-center flex-2 items-center relative m-6"
               data-aos="flip-right"
          data-aos-delay="750"
        >
          <img
            src={Mobile}
            alt="mobile"
            height={150}
            width={150}
            className="z-10"
          />

          <div className="w-64 h-64  absolute rounded-full border-[18px] border-yellow-500 flex justify-center items-center"></div>
          <div className="w-48 h-48  absolute rounded-full border-[18px] border-yellow-500 flex justify-center items-center"></div>
        </div>
        <div
          className="flex justify-center gap-6 flex-1 flex-col items-center max-md:mt-6 max-xs:mt-12 p-4"
              data-aos="zoom-in"
          data-aos-delay="550"
        >
          <h2 className="h2-bold text-customBrown text-center w-auto">
            Download our Mobile App
          </h2>
          <p className="paragraph-small text-customDark max-w-72  text-center">
            Elevate your dining experience with our mobile app. Download now for
            easy ordering and exclusive perks
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
            <Link to="/">
              <img
                src={Android}
                alt="logo"
                height={150}
                width={150}
                className=""
              />
            </Link>

            <Link to="/">
              <img
                src={appleApp}
                alt="logo"
                height={150}
                width={150}
                className=""
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileApp;

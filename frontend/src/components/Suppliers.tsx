import logo1 from "../assets/blogo.png";
import logo2 from "../assets/blogo2.png";

function Suppliers() {
  return (
    <div className="container mx-auto mt-[100px] text-white ">
      <p   data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine"
          data-aos-once="false"
           className="text-center xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl  font-normal">
        Join Leading Suppliers Powering{" "}
      </p>
      <p  data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine"
          data-aos-once="false"
           className="text-center xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl mt-3 font-light">
        {" "}
        Smarter Projects
      </p>
      <div className="sm:grid sm:grid-cols-3 gap-4 flex flex-col place-items-center mt-10">
        <div
          data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine"
          data-aos-once="false"
          className="bg-[#151414] w-full h-[100px] flex items-center justify-center"
        >
          <img src={logo1} alt="logo " />
        </div>
        <div
          data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine"
          data-aos-once="false"
          className="bg-[#151414] w-full h-[100px] flex items-center justify-center"
        >
          <img src={logo2} alt="logo " />
        </div>
        <div
          data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine"
          data-aos-once="false"
          className="bg-[#151414] w-full h-[100px] flex items-center justify-center"
        >
          <p>Majestic Aluminum</p>
        </div>
      </div>
    <p  data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
           className="text-center xl:text-2xl lg:text-xl md:text-lg sm:text-base text-sm font-light mt-10 leading-normal w-[80%] mx-auto">
  Aluminum suppliers, glass vendors, and accessory manufacturers 
  list your materials on our platform so builders and installers can
  instantly generate accurate, professional quotes for their clients.
</p>

    </div>
  );
}

export default Suppliers;

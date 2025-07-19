import img1 from "../assets/im5.png";
import img2 from "../assets/im8.png";
import img3 from "../assets/im9.png";

function SecondSection() {
  return (
    <div className="container  text-white mt-[60px] pt-[50px] mx-auto w-fit">
      <FirstBox />
      <SecondBox />
    </div>
  );
}

export default SecondSection;

function FirstBox() {
  return (
    <div className="grid sm:grid-cols-2 sm:grid-rows-3 grid-cols-1 grid-rows-1 gap-4  max-w-[80%] mx-auto  ">
      <div
        data-aos="fade-right"
        data-aos-delay="200"
        data-aos-duration="1000"
        data-aos-easing="ease-in-sine"
        data-aos-once="false"
        className="sm:row-span-2  row-span-1"
      >
        <p className="xl:text-6xl lg:text-5xl md:text-4xl sm:text-3xl font-thin">
          Take control of your sketches and material planning — with smart tools
          that maximize precision and minimize waste.
        </p>
      </div>
      <div
        data-aos="fade-left"
        data-aos-delay="200"
        data-aos-duration="1000"
        data-aos-easing="ease-in-sine"
        data-aos-once="false"
        className="sm:row-span-2 sm:col-start-2 sm:row-start-2 "
      >
        <img src={img1} alt="alum" />
      </div>
    </div>
  );
}

function SecondBox() {
  return (
    <div className="max-w-[80%] mx-auto mt-[150px] ">
      <div
        data-aos="fade-rigth"
        data-aos-delay="200"
        data-aos-once="false"
        data-aos-easing="ease-in-sine"
        data-aos-duration="1000"
        className="max-w-[60%] xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl font-normal mb-20"
      >
        <p>
          {" "}
          From sketch to structure, we combine shape detection, OCR, and
          real-time estimation to help you build faster & waste less.
        </p>
      </div>
      <div className="sm:grid sm:grid-cols-2 sm:grid-rows-3 flex flex-col sm:gap-10 gap-3 text-[20px] ">
        <div
          data-aos="fade-right"
          data-aos-delay="200"
          data-aos-once="false"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
          className="row-span-2 col-start-1 row-start-2 lg:pr-24 pr-0 "
        >
          <p>Supercharge your team</p>
          <img src={img2} alt="team" className="rounded" />
        </div>
        <div
          data-aos="fade-left"
          data-aos-once="false"
          data-aos-easing="ease-in-sine"
          data-aos-delay="200"
          data-aos-duration="1000"
          className="row-span-2 col-start-2 lg:pl-24 pl-0"
        >
          <p>Build from scratch</p>
          <img src={img3} alt="groupe" className="rounded" />
        </div>
        <div
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-once="false"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
          className="col-start-2 row-start-3 text-[16px] font-thin leading-relaxed pb-4 "
        >
          <p>
            Smart aluminum insights from hand-drawn plans — designed with
            builders in mind. Sketch, scan, and build. Smarter, faster, and
            without the hassle. Built for makers. Loved by doers. Powered by
            precision.
          </p>
        </div>
      </div>
    </div>
  );
}

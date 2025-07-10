import im1 from "../assets/im1.png";
import im2 from "../assets/im2.png";
import im3 from "../assets/im3.png";
import im4 from "../assets/im4.png";

function FeaturesSection() {
  return (
    <div>
      <div className="container  text-white mt-[60px] pt-[50px] mx-auto w-fit ">
        <FeatureBox
          image={im1}
          text="Automatically detect shapes from your drawings"
        />
        <ReveseFeatureBox
          image={im2}
          text="Read handwritten dimensions with AI."
        />

        <FeatureBox image={im3} text="Instantly calculate aluminum needed" />

        <ReveseFeatureBox
          image={im4}
          text="Optimize frame layouts for less waste."
        />
      </div>
    </div>
  );
}

export default FeaturesSection;

type props = {
  text: string;
  image: string;
};

function FeatureBox(props: props) {
  return (
    <div
      data-aos="fade-right"
      data-aos-delay="200"
      data-aos-duration="1000"
      data-aos-once="false"
      data-aos-easing="ease-in-sine"
      className="flex  xl:text-6xl lg:text-5xl md:text-4xl sm:text-3xl font-normal uppercase  max-w-[80%] gap-10 justify-between mx-auto  mb-28 flex-col-reverse	 sm:flex-row"
    >
      <div className=" max-w-full sm:max-w-[50%]">
        <img src={props.image} alt="feature imag" className="w-full" />
      </div>
      <div className="sm:max-w-1/3 max-w-full ">
        <p>{props.text}</p>
      </div>
    </div>
  );
}
function ReveseFeatureBox(props: props) {
  return (
    <div
      data-aos="fade-left"
      data-aos-delay="200"
      data-aos-once="false"
      data-aos-duration="1000"
      data-aos-easing="ease-in-sine"
      className="flex  xl:text-6xl lg:text-5xl md:text-4xl sm:text-3xl font-normal uppercase  max-w-[80%] gap-10 mx-auto  justify-between mb-28 flex-col	 sm:flex-row"
    >
      <div className="sm:max-w-1/3 max-w-full ">
        <p>{props.text}</p>
      </div>

      <div className=" max-w-full sm:max-w-[50%]">
        <img src={props.image} alt="feature imag" className="w-full" />
      </div>
    </div>
  );
}

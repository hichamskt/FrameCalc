import windowimg from "../assets/image1.png";

function FirstSection() {
  return (
    <div className="mt-[150px] mb-[150px]">
      <Heading />
      <div className="mt-[150px] mb-[150px] w-full">
        <img src={windowimg} alt="window image " className="w-[100%]" />
      </div>
    </div>
  );
}

export default FirstSection;

function Heading() {
  return (
    <div
      data-aos="fade-up"
      data-aos-once="false"
      data-aos-delay="200"
      data-aos-easing="ease-in-sine"
      data-aos-duration="1000"
      className="container text-white mt-[60px] pt-[50px] sm:mx-auto mx-[5px] text-center 
             text-2xl sm:text-3xl md:text-5xl font-normal 
             leading-tight sm:leading-snug md:leading-normal lg:leading-relaxed"
    >
      <p>Simplify your workflow. Power it with</p>
      <p>Vision and precision.</p>

      <button
        className="mt-6 bg-white text-black px-10 py-2 text-xl md:text-2xl font-medium 
               rounded transition-all duration-300 hover:bg-[#7E89AC]"
      >
        Get started today
      </button>
    </div>
  );
}

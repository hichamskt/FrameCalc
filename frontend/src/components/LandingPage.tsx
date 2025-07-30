import sketch from "../assets/Container.png";
import round from "../assets/SVG.png";

function LandingPage() {




  return (
    <div className="">
      <div className="container  text-white mt-[60px] pt-[50px] sm:mx-auto mx-[5px]">
        <div className="pt-10">
          <p className="text-2xl lg:text-8xl sm:text-4xl md:text-6xl    opacity-0 translate-y-4 animate-fade-in-up ">
            SKETCH SMARTER.
          </p>
        </div>
        <div className="flex gap-3 items-center justify-end pt-10 ">
          <div className="opacity-0 translate-y-4 animate-fade-in-up">
            <img src={round} alt="roundtext" />
          </div>
          <p className="text-2xl lg:text-8xl sm:text-4xl md:text-6xl   opacity-0 translate-y-4 animate-fade-in-up ">
            BUILD FASTER.
          </p>
        </div>
        <div></div>
        <div className="pt-10 pb-8 flex gap-6 flex-col lg:flex-row">
          <div>
            <p className="text-2xl lg:text-8xl sm:text-4xl md:text-6xl  opacity-0 translate-y-4 animate-fade-in-up">
              BUILD IN ALUMINUM.
            </p>
            <img
              src={sketch}
              alt="sketch"
              className="mx-auto object-cover  sm:w-auto w-[300px] opacity-0 translate-y-4 animate-fade-in-up"
            />
          </div>
          <div className="max-w-lg  md:max-w-[400px] opacity-0 translate-y-4 animate-fade-in-up">
            <p className="text-[16px] font-thin leading-relaxed pb-4 ">
              The first intelligent sketch analysis platform for aluminum
              windows and doors — detect shapes, read handwritten dimensions,
              and instantly calculate the materials you need to build. Designed
              to save time, reduce errors, and streamline your construction
              workflow.
            </p>
            <button className="bg-[#47D055] text-black px-10 py-2 cursor-pointer hover:text-white hover:bg-[#47d055bf] transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>


      
    </div>
  );
}

export default LandingPage;



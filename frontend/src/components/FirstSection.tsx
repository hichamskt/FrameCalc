import windowimg from "../assets/image1.png"
import { useEffect, useRef } from "react";


function FirstSection() {
  return (
    <div className="mt-[150px] mb-[150px]">
        <Heading />
        <div className="mt-[150px] mb-[150px] w-full">
        <img src={windowimg} alt="window image " className="w-[100%]" />
        </div>

    </div>
  )
}

export default FirstSection



function Heading (){

 const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("animate-fade-in-up");
        observer.unobserve(el);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);


return(
      <div ref={ref} className="container  text-white mt-[60px] pt-[50px] sm:mx-auto mx-[5px] text-center md:text-5xl sm:text-3xl text-2xl leading-tight sm:leading-snug md:leading-normal lg:leading-relaxed  font-normal  opacity-0 translate-y-4 animate-fade-in-up  ">
        <p>Simplify your workflow. Power it with </p>
        <p>Vision and precision..</p>
        <button className="bg-white text-black px-10 py-2 cursor-pointer  hover:bg-[#7E89AC] text-3xl font-normal rounded transition-all duration-300">Get started today</button>
    </div>
)
}
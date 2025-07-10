
import { useState } from "react";
import { FaPlus , FaMinus } from "react-icons/fa";

function Faqs() {

    const faqs = [
        {
            title:"How accurate is the shape and measurement detection from a sketch?",
            content:"We use advanced image processing and OCR (handwriting recognition) to detect geometric shapes and dimensions. While results are highly accurate on clean, clear sketches, better lighting and contrast can further improve detection quality."
        },
        {
            title:"Do I need special equipment or a scanner to use the platform?",
            content:"No. You can simply upload a photo or scan of your sketch using your phone or computer. As long as the sketch is visible and legible, the system will process it."
        },
        {
            title:"What materials can the system calculate?",
            content:"Our platform focuses on aluminum framing for windows and doors. Based on your sketch and measurements, it calculates the amount of aluminum profile required, helping reduce material waste and cost."
        },
        {
            title:"Can I save and edit my projects later?",
            content:"Yes. Every scan can be saved to your account. You can revisit your projects anytime, view the original sketch, update measurements, or export results as structured data or PDFs."
        }
    ]


  return (
    <div  
       
    
    className="container mx-auto text-white w-[90%] mt-[300px] ">
        <div className="">
            <p
            data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine"
          data-aos-anchor-placement="top-center"
           data-aos-once="false"
            className="xl:text-3xl lg:text-2xl md:text-lg sm:text-base text-sm font-light mt-10 leading-normal">Frequently asked questions</p>
            
            {
                faqs.map((faq,index)=>(
                    <Faq key={index} title={faq.title} content={faq.content} />
                ))
            }

        </div>
    </div>
  )
}

export default Faqs

type props = {
title:string;
content:string
}


function Faq({ title, content }: props) {
  const [show, setShow] = useState<boolean>(false);
  const contentId = `faq-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      data-aos-duration="1000"
      data-aos-easing="ease-in-sine"
      data-aos-anchor-placement="top-center"
      data-aos-once="false"
      className="border-b border-gray-600 mt-4 p-4 transition-all duration-200"
    >
      <button
        onClick={() => setShow(!show)}
        className="flex items-center justify-between w-full group"
        aria-expanded={show}
        aria-controls={contentId}
      >
        <p className="text-left text-base sm:text-lg md:text-xl font-medium text-white transition-colors">
          {title}
        </p>
        {show ? (
          <FaMinus className="text-white ml-4" />
        ) : (
          <FaPlus className="text-white ml-4" />
        )}
      </button>

      <div
        id={contentId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          show ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm sm:text-base text-white font-light pb-2">
          {content}
        </p>
      </div>
    </div>
  );
}


import img1 from "../assets/im5.png"
function SecondSection() {
  return (
    <div className="container  text-white mt-[60px] pt-[50px] mx-auto w-fit">
        <FirstBox/>
    </div>
  )
}

export default SecondSection



function FirstBox (){

    return(
        <div className="grid sm:grid-cols-2 sm:grid-rows-3 grid-cols-1 grid-rows-1 gap-4  max-w-[80%] mx-auto  ">
            <div data-aos="fade-right"
      data-aos-delay="200"
      data-aos-duration="1000"
       className="sm:row-span-2  row-span-1" >
                <p className="xl:text-6xl lg:text-5xl md:text-4xl sm:text-3xl font-thin">Take control of your sketches and material planning — with smart tools that maximize precision and minimize waste.</p>
            </div>
            <div
            data-aos="fade-left"
      data-aos-delay="200"
      data-aos-duration="1000"
            className="sm:row-span-2 sm:col-start-2 sm:row-start-2 ">
                <img src={img1} alt="alum" />
            </div>

        </div>
    )
}



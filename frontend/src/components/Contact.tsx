function Contact() {
  return (
    <div
     data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out-cubic"
          data-aos-anchor-placement="top-center"
           data-aos-once="false"

    className="container mx-auto  bg-[#C8C7C6] w-full rounded-2xl mt-16 p-5 ">
      <div className="flex flex-col gap-8">
        <p className="xl:text-8xl lg:text-6xl text-5xl  font-normal">
          Start your
        </p>
        <p className="xl:text-8xl lg:text-6xl text-5xl  font-normal">
          Journy whith Us
        </p>
        <div className="flex items-center sm:gap-8 gap-2 flex-wrap ">
          <button
            className="mt-6 bg-white text-black hover:text-white px-10 py-2 text-xl md:text-2xl font-medium 
               rounded transition-all duration-300 hover:bg-black cursor-pointer"
          >
            Speak with our team
          </button>
          <button
            className="mt-6 bg-black text-white px-10 py-2 text-xl md:text-2xl font-medium 
               rounded transition-all duration-300 hover:bg-[#7E89AC] cursor-pointer"
          >
            Get started
          </button>
        </div>
        <div className="flex w-full md:gap-6 gap-2 md:justify-end flex-wrap">
          <p className="border-2 border-black rounded-2xl p-2">
            No implementation fees
          </p>
          <p className="border-2 border-black rounded-2xl p-2">No minimums</p>
          <p className="border-2 border-black rounded-2xl p-2 ">
            All features included
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;

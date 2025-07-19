import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Header from "../components/Header";

function ContactPage() {
  return (
    <div className="bg-[#F5F5F5]">
      <Header />
      <div className="flex items-center justify-center   flex-col gap-6 mb-20">
        <TitleBox />
        <ContactForm />
      </div>
      <div className="bg-black">
        <Footer />
      </div>
    </div>
  );
}

export default ContactPage;

function TitleBox() {
  return (
    <div className="container mx-auto text-center text-black  mt-48">
      <h1 className="font-bold text-5xl mb-2.5">Contact Us</h1>
      <p className="text-[#71717] ">
        Any question or remarks? Just write us a message!
      </p>
    </div>
  );
}

import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Header from "../components/Header";
import  { useEffect } from 'react';
import { useAuth } from "../context/AuthContext";

function ContactPage() {

  const {user} = useAuth();

  useEffect(() => {
    const userId = "e04fdae3-5042-4491-8ddd-7c5e629ce36b";
const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/`);

   

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('New notification:', data);

    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

   
    return () => {
      ws.close();
    };
  }, [user?.id]);




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

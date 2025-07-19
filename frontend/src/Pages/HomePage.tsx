import Contact from "../components/Contact"
import Faqs from "../components/Faqs"
import FeaturesSection from "../components/FeaturesSection"
import FirstSection from "../components/FirstSection"
import Footer from "../components/Footer"
import Header from "../components/Header"
import LandingPage from "../components/LandingPage"
import SecondSection from "../components/SecondSection"
import Suppliers from "../components/Suppliers"



function HomePage() {
  return (
    <div className="bg-black w-full overflow-hidden">
        <Header />
        <LandingPage />
        <FirstSection />
        <FeaturesSection />
        <SecondSection />
        <Suppliers />
        <Faqs />
        <Contact />
        <Footer/>
    </div>
  )
}

export default HomePage
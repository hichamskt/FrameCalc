import FeaturesSection from "../components/FeaturesSection"
import FirstSection from "../components/FirstSection"
import Header from "../components/Header"
import LandingPage from "../components/LandingPage"
import SecondSection from "../components/SecondSection"
import Suppliers from "../components/Suppliers"



function HomePage() {
  return (
    <div className="bg-black ">
        <Header />
        <LandingPage />
        <FirstSection />
        <FeaturesSection />
        <SecondSection />
        <Suppliers />

    </div>
  )
}

export default HomePage
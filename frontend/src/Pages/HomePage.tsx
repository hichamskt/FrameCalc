import FeaturesSection from "../components/FeaturesSection"
import FirstSection from "../components/FirstSection"
import Header from "../components/Header"
import LandingPage from "../components/LandingPage"



function HomePage() {
  return (
    <div className="bg-black ">
        <Header />
        <LandingPage />
        <FirstSection />
        <FeaturesSection />
    </div>
  )
}

export default HomePage
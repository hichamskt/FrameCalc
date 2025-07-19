import { NavLink } from "react-router-dom"
import logo from "../assets/logo 1.png"
function Footer() {
  return (
    <div 
    className="container mx-auto text-white font-bold p-6  mt-10 ">
        <div
        className="flex gap-6 items-center justify-center ">

        <NavLink to="/" >
        Home
        </NavLink>
        <NavLink to="/contact" >
        Contact
        </NavLink>
        <NavLink to="/login" >
        Login
        </NavLink>
        <NavLink to="/login" >
        Signup
        </NavLink>
        </div>
        <div className="flex gap-6 items-center justify-center mt-5" >
            <img src={logo} alt="logo" />
        </div>
    </div>
  )
}

export default Footer
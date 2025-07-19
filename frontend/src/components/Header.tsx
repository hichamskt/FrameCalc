import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo 1.png";
import { useEffect, useRef, useState } from "react";

function Header() {
  const [links] = useState([ "Contact", "Login"]);


const headerRef = useRef<HTMLDivElement | null>(null);
const navigate = useNavigate()

  useEffect(() => {
  const handleScroll = () => {
    
    if (!headerRef.current) return;

    if (window.scrollY > 100) {
      headerRef.current.style.background = "#bg-black";
      headerRef.current.style.padding = "20px 0";
    } else {
        headerRef.current.style.padding = "10px 0";
     
    }
  };

 
  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll); 
  };
}, []);





  return (
    <div  ref={headerRef} className="text-white pt-[10px] pb-[10px] fixed z-50 top-0 left-0 w-full transition-all duration-300 bg-black">
      <div   className="container flex justify-between items-center mx-auto  sm:gap-0  flex-col sm:flex-row ">
        <Link to="/">
          <img src={logo} alt="framclick" className="w-[150px] object-cover" />
        </Link>
        <ul className="flex justify-between items-center gap-4">
             <NavLink
           
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "font-bold border-b-2 border-white"
                  : "text-gray-300 hover:text-[#7E89AC]"
              }
            >
              Home
            </NavLink>
          {links.map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase()}`}
              className={({ isActive }) =>
                isActive
                  ? "font-bold border-b-2 border-white"
                  : "text-gray-300 hover:text-[#7E89AC]"
              }
            >
              {link}
            </NavLink>
          ))}
          <li>
            <button className="bg-white font-bold text-black px-4 py-2 rounded cursor-pointer"
            onClick={()=>navigate('/signup')}
            >
              Sign up
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;

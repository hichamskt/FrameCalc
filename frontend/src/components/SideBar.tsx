import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo 1.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { RiSketching } from "react-icons/ri";
import { LuTextQuote } from "react-icons/lu";
import { TbTableShortcut } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { SiCodeclimate } from "react-icons/si";
import { FaBarsProgress } from "react-icons/fa6";
import { IoMdGitPullRequest } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { GrUserSettings } from "react-icons/gr";
import { TbFileSettings } from "react-icons/tb";
import { useEffect, useState } from "react";
import profile from "../assets/person.jpg";
import { Button } from "./ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { BiLogoMicrosoft } from "react-icons/bi";
import { RiUserCommunityLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { BiLogOutCircle } from "react-icons/bi";
import { useAxios } from "../api/axios";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
};


type user = {
  username:string;
  profile_image:string;
}


const navItems: NavItem[] = [
  {
    title: "New Sketch",
    Icon: RiSketching,
    to: "/dash/newsketsh",
  },
  {
    title: "Sketches",
    Icon: FaStar,
    to: "/",
  },
  {
    title: "Quotations",
    Icon: LuTextQuote,
    to: "/",
  },
  {
    title: "Alucobond Cutting",
    Icon: TbTableShortcut,
    to: "/",
  },
  {
    title: "Commonty",
    Icon: RiUserCommunityLine,
    to: "/",
  },
];




const CompanyNavItems: NavItem[] = [
  { title: "Products", Icon: AiFillProduct, to: "/" },
  { title: "Alum Profiles", Icon: SiCodeclimate, to: "/" },
  { title: "Accessories", Icon: FaBarsProgress, to: "/" },
  { title: "Material requirements", Icon: IoMdGitPullRequest, to: "/" },
];
const SettingNavItems: NavItem[] = [
  {
    title: "Profile settings",
    Icon: GrUserSettings,
    to: "/profile-settings",
  },
  {
    title: "Company settings",
    Icon: TbFileSettings,
    to: "/company-settings",
  },
];

function SideBar() {
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [userCompany, setUserCompany] = useState<boolean>(false);
  const axios = useAxios();
  const { accessToken , logout } = useAuth();
  const [user,setUser]=useState<user>();
  const navigate = useNavigate();




const handleLogout = async () => {
  try {
    await logout();            
    navigate("/login");       
  } catch (error) {
    console.error("Logout failed:", error);
  }
};





useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get("/profile/");
      console.log("User fetched:", response.data);
      setUser(response.data); 
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      console.log("Fetch complete");
    }
  };

  
  if ( accessToken) {
    fetchUser();
  }
}, [userCompany, accessToken]);



  useEffect(() => {
    if (!accessToken) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get("/companies/");

        const companies = response?.data;

        if (Array.isArray(companies) && companies.length > 0) {
          setUserCompany(true);
        }

        console.log("Company data:", response.data.length);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        console.log("Fetch complete");
      }
    };

    fetchProfile();
  }, [accessToken]);




  return (
    <div
      className={`text-white p-7 h-screen  flex flex-col gap-6 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth md:relative top-0 fixed shrink-0  z-20 ${
        !expand? "items-center left-[-80px] top-3  md:top-auto md:left-auto ":"bg-[#081028]"
      }
      
      `}
    >
      <button
        onClick={() => setExpand(!expand)}
        className="absolute top-0 right-0 cursor-pointer text-2xl"
      >
        {expand ? (
          <TbLayoutSidebarRightExpandFilled />
        ) : (
          <TbLayoutSidebarLeftExpandFilled />
        )}
      </button>
      <div className="mb-3">
        <img
          src={logo}
          alt="logo"
          className={`smooth-transition ${
            expand
              ? "max-w-40 opacity-100 translate-x-0 "
              : "max-w-0 opacity-0 -translate-x-2 absolute"
          }`}
        />
        <div
          className={` smooth-transition ${
            !expand
              ? "max-w-40 opacity-100 translate-x-0 text-2xl rounded bg-[#7E89AC] p-1 mr-[11px]"
              : "max-w-0 opacity-0 -translate-x-2"
          }`}
        >
          <BiLogoMicrosoft />
        </div>
      </div>

      {navItems.map(({ title, Icon, to }) => (
        <Navblock
          key={title}
          title={title}
          Icon={Icon}
          to={to}
          expand={expand}
        />
      ))}

      <hr
        className={`smooth-transition ${
          expand
            ? "max-w-40 opacity-100 translate-x-0"
            : "max-w-0 opacity-0 -translate-x-2"
        }`}
      />

      {userCompany && (
        <div className="flex flex-col gap-6">
          {CompanyNavItems.map(({ title, Icon, to }) => (
            <Navblock
              key={title}
              title={title}
              Icon={Icon}
              to={to}
              expand={expand}
            />
          ))}
        </div>
      )}

      <div className="text-sm" onClick={() => setShowSetting(!showSetting)}>
        <div
          className={`cursor-pointer flex justify-between items-center hover:text-[#AEB9E1] `}
        >
          <div
            className={`
            flex gap-3 items-center 
            `}
          >
            <div
              className={`
                    ${!expand && "text-2xl rounded bg-[#7E89AC] p-1"}
                    `}
            >
              <IoMdSettings />
            </div>
            <p
              className={`smooth-transition ${
                expand
                  ? "max-w-40 opacity-100 translate-x-0"
                  : "max-w-0 opacity-0 -translate-x-2 "
              }`}
            >
              Settings
            </p>
          </div>
          <div
            className={`smooth-transition ${
              expand
                ? "max-w-40 opacity-100 translate-x-0"
                : "max-w-0 opacity-0 -translate-x-2 "
            }`}
          >
            <MdKeyboardArrowRight />
          </div>
        </div>
        <div
          className={` py-4 flex gap-5 flex-col smooth-transition ${
            showSetting
              ? "max-h-40 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          } ${expand && " pl-3"}`}
        >
          {SettingNavItems.filter((_, index) => {
            if (!userCompany) return index === 0;
            return true;
          }).map(({ title, Icon, to }) => (
            <Navblock
              key={title}
              title={title}
              Icon={Icon}
              to={to}
              expand={expand}
            />
          ))}
        </div>

        {!userCompany && <div
          className={`smooth-transition ${
            !expand
              ? "max-w-40 opacity-100 translate-x-0 text-2xl rounded  p-1 w-fit"
              : "hidden"
          } 

            
            `}
          style={{
            background: "linear-gradient(90deg, #CB3CFF 20%, #7F25FB 68%)",
          }}
        >
          <FaPlus />
        </div>}
      </div>
      <div className="flex gap-3 items-center">
        <img
          src={user?.profile_image?`${user?.profile_image}`:profile}
          alt="user"
          className="rounded-[50%] w-[40px] h-[40px] object-cover shadow-md"
        />
        <p
          className={`${
            expand
              ? "max-w-40 opacity-100 translate-x-0"
              : "max-w-0 opacity-0 -translate-x-2"
          }`}
        >
          {user?.username}
        </p>
      </div>
      {!userCompany && (
        <Button
          className={`cursor-pointer smooth-transition ${
            expand
              ? "max-w-40 opacity-100 translate-x-0"
              : "max-w-0 opacity-0 -translate-x-2 hidden"
          }`}
          style={{
            background: "linear-gradient(90deg, #CB3CFF 20%, #7F25FB 68%)",
          }}
        >
          <p>Add Company</p> <FaArrowRightLong />
        </Button>
      )}
      <div onClick={()=>handleLogout()}
        className={`flex gap-3 items-center cursor-pointer hover:text-[#AEB9E1] transition-colors  
            `}
      >
        <div
          className={`smooth-transition ${
            !expand &&
            "max-w-40 opacity-100 translate-x-0 text-2xl rounded bg-[#FD312A] p-1 mr-[11px]"
          }  `}
        >
          <BiLogOutCircle />
        </div>
        <p
          className={`
                ${
                  expand
                    ? "max-w-40 opacity-100 translate-x-0"
                    : "max-w-0 opacity-0 -translate-x-2 hidden smooth-transition"
                }
                `}
        >
          LogOut
        </p>
      </div>
    </div>
  );
}

export default SideBar;

type nav = {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
  expand: boolean;
};

function Navblock({ title, Icon, to, expand }: nav) {
  return (
    <div>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex justify-between items-center text-sm cursor-pointer transition-colors ${
            isActive
              ? "font-bold text-[#F712D1]"
              : "font-normal hover:text-[#AEB9E1]"
          }`
        }
      >
        <div className="flex gap-3 items-center">
          <div className={`${!expand && "text-2xl rounded bg-[#7E89AC] p-1"}`}>
            <Icon />
          </div>
          <p
            className={`smooth-transition ${
              expand
                ? "max-w-40 opacity-100 translate-x-0"
                : "max-w-0 opacity-0 -translate-x-2"
            }`}
          >
            {title}
          </p>
        </div>
        <div
          className={`smooth-transition ${
            expand
              ? "max-w-40 opacity-100 translate-x-0"
              : "max-w-0 opacity-0 -translate-x-2"
          }`}
        >
          <MdKeyboardArrowRight />
        </div>
      </NavLink>
    </div>
  );
}

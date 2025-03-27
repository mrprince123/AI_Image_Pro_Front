import {
  AlignLeft,
  DiamondPlus,
  ImageDown,
  Images,
  PackagePlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddImage from "./AddImage";
import AllImages from "./AllImages";
import AddCategory from "./AddCategory";
import AddSubCategory from "./AddSubCategory";
import { NavLink, useNavigate } from "react-router-dom";
import { baseUrl } from "../../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/AuthSlice";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
}

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<
    "allImages" | "addImages" | "addCategory" | "addSubCategory"
  >("allImages");

  const [theme] = useState(
    localStorage.getItem("aiImageProTheme") || "light"
  );

  const [mobile, setMobile] = useState(false);
  const [profile, setProfile] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the User Details
  const [user] = useState<User | null>(() => {
    const user = localStorage.getItem("wallpaper_user");
    return user ? JSON.parse(user) : null;
  });

  const toggelMobileFilter = () => {
    setMobile((prev) => !prev);
  };

  const toggleProfile = () => {
    setProfile((prev) => !prev);
  };

  // Close Sidebar on Outside Click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close Profile Dropdown on Outside Click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Write Logout Function
  const handleLogout = async () => {
    try {
      const url = `${baseUrl}/auth/logout`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      dispatch(logout());
      toast.success(response.data.message);
      console.log("Logout Response ", response);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };


 // Handle Theme Changes
 useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem("aiImageProTheme", theme);
}, [theme]);


  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              onClick={toggelMobileFilter}
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <AlignLeft />
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <NavLink to="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ImageDown className="size-4" />
              </div>
              AI Wallpaper Image Pro
            </NavLink>
          </div>
          <div className="flex items-center lg:order-2">
            <button
              type="button"
              className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={toggleProfile}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
                alt="user photo"
              />
            </button>

            {profile && (
              <div
                ref={profileRef}
                className="absolute right-0 top-12 z-50 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow-lg dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
              >
                <div className="py-3 px-4">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                  <span className="block text-sm text-gray-900 truncate dark:text-white">
                    {user?.email}
                  </span>
                </div>
                <ul className="py-1 text-gray-700 dark:text-gray-300">
                  <li>
                    <button
                      onClick={() => handleLogout()}
                      className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {mobile && (
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
            mobile ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Sidenav"
          id="drawer-navigation"
        >
          <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedTab("allImages")}
                  className={`flex items-center w-full p-2 text-base rounded-lg ${
                    selectedTab === "allImages"
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Images />
                  <span className="ml-3">All Images</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("addImages")}
                  className={`flex items-center w-full p-2 text-base  rounded-lg ${
                    selectedTab === "addImages"
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ImageDown />
                  <span className="ml-3">Add Images</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("addCategory")}
                  className={`flex items-center w-full p-2 text-base rounded-lg ${
                    selectedTab === "addCategory"
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <PackagePlus />
                  <span className="ml-3">Add Category</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("addSubCategory")}
                  className={`flex items-center w-full p-2 text-base  rounded-lg ${
                    selectedTab === "addSubCategory"
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <DiamondPlus />
                  <span className="ml-3">Add Sub Category</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      )}

      {/* For big Screen */}
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setSelectedTab("allImages")}
                className={`flex items-center w-full p-2 text-base rounded-lg ${
                  selectedTab === "allImages"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Images />
                <span className="ml-3">All Images</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("addImages")}
                className={`flex items-center w-full p-2 text-base  rounded-lg ${
                  selectedTab === "addImages"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ImageDown />
                <span className="ml-3">Add Images</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("addCategory")}
                className={`flex items-center w-full p-2 text-base rounded-lg ${
                  selectedTab === "addCategory"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <PackagePlus />
                <span className="ml-3">Add Category</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedTab("addSubCategory")}
                className={`flex items-center w-full p-2 text-base  rounded-lg ${
                  selectedTab === "addSubCategory"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <DiamondPlus />
                <span className="ml-3">Add Sub Category</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="p-4 md:ml-64 h-auto pt-20">
        {selectedTab === "allImages" && <AllImages />}
        {selectedTab === "addImages" && <AddImage />}
        {selectedTab === "addCategory" && <AddCategory />}
        {selectedTab === "addSubCategory" && <AddSubCategory />}
      </main>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Index;

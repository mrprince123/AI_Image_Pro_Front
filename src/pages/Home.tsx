import { Download, ImageDown, Moon, Search, SunMoon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { baseUrl } from "../App";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { NavLink } from "react-router-dom";
import { Skeleton } from "../components/ui/skeleton";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

interface Image {
  id: string;
  image_name: string;
  image_url: string;
  image_alt: string;
  sub_category_id: string;
  size: string; // LANDSCAPE , PORTRAIT
}

interface Category {
  id: string;
  category_name: string;
  category_description: string;
}

interface SubCategory {
  id: string;
  sub_category_name: string;
  sub_category_description: string;
  category_id: string;
}

// Fetching all images Outside
const fetchImages = async () => {
  const url = `${baseUrl}/image/get`;
  const { data } = await axios.get(url, {
    withCredentials: true,
  });
  return data.data;
};

const Home = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("aiImageProTheme") || "light"
  );

  const [filterImage, setFilterImage] = useState<Image[]>([]);
  const [searchImage, setSearchImage] = useState<string>("");
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Using the React Query
  const { data: images, isLoading: imageLoading } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
  });

  useEffect(() => {
    getAllCategory();
    getAllSubCategory("1");
  }, []);

  useEffect(() => {
    if (images) setFilterImage(images);
  }, [images]);

  // Handle Image Filter
  const handleImageFilter = () => {
    if (images) {
      const filterValue = images.filter((item: any) =>
        item.image_name.toLowerCase().includes(searchImage.toLowerCase())
      );
      setFilterImage(filterValue);
    }
  };

  // Fetch all Category
  const getAllCategory = async () => {
    try {
      const url = `${baseUrl}/category/get`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Response ", response);
      setCategory(response.data.data);
    } catch (error) {
      console.log("Error Response while Category", error);
    }
  };

  // Fetch all Subcategory
  const getAllSubCategory = async (catId: string) => {
    try {
      const url = `${baseUrl}/subCategory/subCat/${catId}`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Response Sub Category", response);
      setSubCategory(response.data.data);
    } catch (error) {
      console.log("Error Response while Sub Category", error);
    }
  };

  // Filter Based on the Category
  const handleCategoryFilter = (categoryId: any) => {
    try {
      const subCategoryIds = subCategory
        .filter((sub) => sub.category_id == categoryId)
        .map((sub) => sub.id);

      const filterImages = images.filter((img: any) =>
        subCategoryIds.includes(img.sub_category_id)
      );

      setFilterImage(filterImages);
    } catch (error) {}
  };

  // Run filter logic after subCategory is updated
  useEffect(() => {
    if (selectedCategoryId) {
      handleCategoryFilter(selectedCategoryId);
    }
  }, [subCategory]);

  // Handle Category Click
  const handleCategoryClick = (categoryId: any) => {
    setActiveCategoryId(categoryId); // Mark the clicked category as active
    setSelectedCategoryId(categoryId); // Store selected category
    getAllSubCategory(categoryId); // This updates subCategory state
  };

  // Handle Sub Category Filter
  const handleSubCategoryFilter = (subCatId: any) => {
    try {
      console.log("Working this Funciton");
      console.log("Cat Id ", subCatId);
      const filterImages = images.filter(
        (img: any) => Number(img.sub_category_id) === Number(subCatId)
      );
      setFilterImage(filterImages);
    } catch (error) {}
  };

  // Handle Download
  const handleImageDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = imageName || "ai-image-pro-download"; // Set the filename

      // Append to DOM, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
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
    <div>
      {/* Hero Section  */}
      <div className="relative w-full min-h-[60vh] md:h-[60vh]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1433888104365-77d8043c9615?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>

        {/* Black Shadow Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Content */}
        <div className="relative flex flex-col justify-between">
          <header className="w-full md:w-4/5 mx-auto flex flex-wrap items-center justify-between p-4 text-white">
            {/* <h2 className="text-lg italic font-medium">AI Image Pro</h2> */}

            <NavLink to="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ImageDown className="size-4" />
              </div>
              AI Wallpaper Image Pro
            </NavLink>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-2 md:mt-0">
              <Button
                variant="secondary"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <SunMoon /> : <Moon />}
              </Button>
              <Button variant="secondary">
                <NavLink to="/admin">Admin</NavLink>
              </Button>
            </div>
          </header>

          {/* Search Box */}
          <div className=" mt-30 w-11/12 md:w-1/3 mx-auto">
            <h3 className="text-xl md:text-3xl text-white font-semibold mb-5 text-center">
              The best free stock, AI photos, royalty-free images shared by
              admin.
            </h3>
            <div className="bg-white flex gap-2 items-center mx-auto p-2 rounded-lg w-full">
              <Button className="flex gap-2 items-center bg-gray-100 p-4 md:p-6 rounded-lg">
                <ImageDown className="text-gray-400" />
                <h2 className="text-gray-700 font-medium">Image</h2>
              </Button>
              <Input
                className="p-4 md:p-6 bg-gray-100 border-0 w-full"
                type="text"
                onChange={(e) => setSearchImage(e.target.value)}
                placeholder="Search for free Photo"
              />
              <Button
                onClick={() => handleImageFilter()}
                className="bg-gray-50 p-4 md:p-6 rounded-lg"
              >
                <Search className="text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 md:w-4/5 mx-auto mt-10 md:mt-20 mb-10 md:mb-20">
        {/* Category */}
        <ScrollArea>
          <div className="flex gap-4 items-center justify-center w-full">
            {category.map((item) => (
              <button
                onClick={() => handleCategoryClick(item.id)}
                key={item.id}
                className={`text-md md:text-lg px-4 py-2 rounded-full cursor-pointer font-medium transition-all 
                ${
                  activeCategoryId === item.id
                    ? "bg-black text-white dark:bg-neutral-800"
                    : "text-gray-700 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {item.category_name}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Sub Category & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 mb-5 gap-4">
          <h4 className="text-xl md:text-2xl font-medium text-center md:text-left">
            {searchImage ? searchImage : "Free AI Generate Stock Photos"}
          </h4>

          <Select onValueChange={handleSubCategoryFilter}>
            <SelectTrigger className="w-full md:w-auto">
              <SelectValue placeholder="Sub category" />
            </SelectTrigger>
            <SelectContent className="w-full md:w-auto">
              {subCategory.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.sub_category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show the Images Grid */}
        {imageLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mx-auto mt-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden ${
                  index % 3 === 0
                    ? "col-span-1 row-span-2 h-[600px]"
                    : "col-span-1 row-span-1 h-[300px]"
                }`}
              >
                <Skeleton className="w-full h-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mx-auto mt-4">
            {filterImage
              .slice()
              .sort(() => Math.random() - 0.5)
              .map((image) => (
                <div
                  key={image.id}
                  className={`relative rounded-xl overflow-hidden cursor-pointer group ${
                    image.size === "PORTRAIT"
                      ? "col-span-1 row-span-2"
                      : "col-span-1 row-span-1"
                  }`}
                >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <img
                        src={image.image_url}
                        alt={image.image_alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </AlertDialogTrigger>

                    {/* Download Button (Initially Hidden) */}
                    <Button
                      onClick={() =>
                        handleImageDownload(image.image_url, image.image_name)
                      }
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2
  opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </Button>

                    <AlertDialogContent className="p-4">
                      <AlertDialogHeader>
                        <div className="flex justify-between">
                          <AlertDialogTitle>
                            {image.image_name}
                          </AlertDialogTitle>
                          <AlertDialogCancel>
                            <X />
                          </AlertDialogCancel>
                        </div>

                        <AlertDialogDescription>
                          <img
                            src={image.image_url}
                            alt={image.image_alt}
                            className="rounded-lg"
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>
                          <button
                            onClick={() =>
                              handleImageDownload(
                                image.image_url,
                                image.image_name
                              )
                            }
                            className="flex gap-2  items-center"
                          >
                            <Download />
                            Download
                          </button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

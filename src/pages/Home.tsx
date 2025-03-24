import { ImageDown, Search} from "lucide-react";
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

const Home = () => {
  const [image, setImage] = useState<Image[]>([]);
  const [filterImage, setfilterImage] = useState<Image[]>([]);
  const [searchImage, setSearchImage] = useState<string>("");
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    getAllCategory();
    getAllImages();
    getAllSubCategory("1");
  }, []);

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

  // Fetch all Images
  const getAllImages = async () => {
    try {
      const url = `${baseUrl}/image/get`;
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("Image Response ", response);
      setImage(response.data.data);
      setfilterImage(response.data.data);
    } catch (error) {
      console.log("Error while Image Response ", error);
    }
  };

  // Filter based on the Search
  const handleImageFilter = () => {
    try {
      const filterValue = image.filter((item) =>
        item.image_name.toLowerCase().includes(searchImage.toLowerCase())
      );
      setfilterImage(filterValue);
    } catch (error) {}
  };

  // Filter Based on the Category
  const handleCategoryFilter = (categoryId: any) => {
    try {
      const subCategoryIds = subCategory
        .filter((sub) => sub.category_id == categoryId)
        .map((sub) => sub.id);

      const filterImages = image.filter((img) =>
        subCategoryIds.includes(img.sub_category_id)
      );

      setfilterImage(filterImages);
    } catch (error) {}
  };

  // Run filter logic AFTER subCategory is updated
  useEffect(() => {
    if (selectedCategoryId) {
      handleCategoryFilter(selectedCategoryId);
    }
  }, [subCategory]); // Watch for subCategory updates

  const handleCategoryClick = (categoryId: any) => {
    setSelectedCategoryId(categoryId); // Store selected category
    getAllSubCategory(categoryId); // This updates subCategory state
  };

  const handleSubCategoryFilter = (subCatId: any) => {
    try {
      console.log("Working this Funciton");
      console.log("Cat Id ", subCatId);
      const filterImages = image.filter(
        (img) => Number(img.sub_category_id) === Number(subCatId)
      );
      setfilterImage(filterImages);
    } catch (error) {}
  };

  return (
    <div>
      {/* Hero Section  */}
      <div className="relative w-full min-h-[50vh] md:min-h-[60vh]">
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
        <div className="relative z-10">
          <header className="w-11/12 md:w-3/4 mx-auto flex flex-col md:flex-row items-center justify-between p-4 text-white">
            <h2 className="text-lg italic font-medium">AI Image Pro</h2>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-2 md:mt-0">
              <h4 className="text-white font-medium text-lg">About</h4>
              <h4 className="text-white font-medium text-lg">Documentation</h4>
              <Button variant="secondary">
                <NavLink to="/admin">Admin</NavLink>
              </Button>
            </div>
          </header>

          {/* Search Box */}
          <div className="mt-10 w-11/12 md:w-1/3 mx-auto">
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
        <div className="flex flex-wrap gap-4 items-center justify-center m-5">
          {category.map((item) => (
            <button
              onClick={() => handleCategoryClick(item.id)}
              key={item.id}
              className="text-md md:text-lg text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              {item.category_name}
            </button>
          ))}
        </div>

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto mt-4">
          {filterImage
            .slice()
            .sort(() => Math.random() - 0.5)
            .map((image) => (
              <div
                key={image.id}
                className={`relative rounded-xl overflow-hidden ${
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
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{image.image_name}</AlertDialogTitle>
                      <AlertDialogDescription>
                        <img src={image.image_url} alt={image.image_alt} />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        <a target="_blank" href={image.image_url}>
                          Download
                        </a>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

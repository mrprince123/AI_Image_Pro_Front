import { ImageDown, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { baseUrl } from "../App";
import axios from "axios";

interface Image {
  id: string;
  image_name: string;
  image_url: string;
  image_alt: string;
  sub_category_id: string;
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Open Modal with Image
  const openModal = (image_url: string, image_name: string) => {
    setSelectedImage(image_url);
    setSelectedName(image_name);
    setIsOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setSelectedName(null);
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

  useEffect(() => {
    getAllCategory();
    getAllImages();
    getAllSubCategory("1");
  }, []);

  // Filter Search
  const handleImageFilter = () => {
    try {
      const filterValue = image.filter((item) =>
        item.image_name.toLowerCase().includes(searchImage.toLowerCase())
      );
      // return filterValue;
      console.log("Filter vAlue ", filterValue);
      setfilterImage(filterValue);
    } catch (error) {}
  };

  return (
    <div>
      <div className="relative w-full min-h-[60vh]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1433888104365-77d8043c9615?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>

        {/* Black Shadow Overlay */}
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* Content */}
        <div className="relative z-10">
          <header className="w-3/4 mx-auto flex items-center justify-between p-4 text-white">
            <h2 className="text-lg italic font-medium ">AI Image Pro</h2>
            <div className="flex items-center gap-4">
              <h4 className="text-white font-medium text-lg">About</h4>
              <h4 className="text-white font-medium text-lg">Category</h4>
              <button className="bg-white text-md  font-medium text-gray-600 p-2 rounded-lg">
                Admin
              </button>
            </div>
          </header>

          {/* Search Box */}
          <div className="mt-30 w-1/3 mx-auto">
            <h3 className="text-3xl text-white font-semibold mb-5 text-center">
              The best free stock and AI photos, royalty free images shared by
              admin.
            </h3>
            <div className="bg-white flex gap-2 items-center  mx-auto p-3 rounded-lg ">
              <div className="flex gap-2 items-center bg-gray-200 p-4 rounded-lg">
                <ImageDown className="text-gray-400" />
                <h2 className="text-gray-700 font-medium">Image</h2>
              </div>
              <input
                className="p-4 bg-gray-200 w-full rounded-lg"
                type="text"
                onChange={(e) => setSearchImage(e.target.value)}
                placeholder="Search for free Photo"
              />
              <button
                onClick={() => handleImageFilter()}
                className="bg-gray-200 p-4 rounded-lg"
              >
                <Search />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-3/4 mx-auto mt-20 mb-20">
        {/* Category  */}
        <div className="flex gap-4 items-center justify-center m-5">
          {category.map((item) => (
            <button
              onClick={() => getAllSubCategory(item.id)}
              key={item.id}
              className="text-lg text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              {item.category_name}
            </button>
          ))}
        </div>
        {/* Sub Category  */}
        <div className="flex justify-between mt-10 mb-5">
          <h4 className="text-2xl font-medium">
            {searchImage ? searchImage : "Free AI Generate Stock Photos"}
          </h4>
          <select
            name=""
            id=""
            className="border border-gray-200 p-2 rounded-lg"
          >
            {subCategory.map((item) => (
              <option key={item.id} value="">
                {item.sub_category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Show the Images  */}
        <div className="grid grid-cols-3 gap-6 mx-auto mt-4">
          {filterImage.map((image, index) => (
            <div key={index} className={`relative rounded-xl overflow-hidden`}>
              <img
                onClick={() =>
                  openModal(image.image_url, image.image_name || "Image")
                }
                src={image.image_url}
                alt={image.image_alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Dialog Box (Modal) */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-1/2 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{selectedName}</h3>
                <button
                  onClick={closeModal}
                  className="font-medium p-2 rounded-lg"
                >
                  <X />
                </button>
              </div>
              <div className="flex items-center justify-center">
                <img
                  className="max-w-full max-h-[70vh] object-contain"
                  src={selectedImage!}
                  alt="Full Image"
                />
              </div>

              <div className="flex justify-end">
                <a
                  href={selectedImage!}
                  download
                  className="block mt-4 p-2 font-medium bg-black text-white text-center py-2 rounded-lg"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

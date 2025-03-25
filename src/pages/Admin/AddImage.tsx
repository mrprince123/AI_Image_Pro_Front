import React, { useEffect, useState } from "react";
import { baseUrl } from "../../App";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import toast, { Toaster } from "react-hot-toast";


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

const AddImage = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [name, setName] = useState<string>("");
  const [size, SetSize] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [subCat, setSubCat] = useState<string>("");
  const [imagePreview, setImagePreview] = useState("");

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

  // Handle Category Change
  const handleCategoryChange = (value: string) => {
    setSubCat(""); // Reset Subcategory
    getAllSubCategory(value);
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add New Images
  const handleImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageFile) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("image_name", name);
    formData.append("size", size);
    formData.append("image_url", imageFile);
    formData.append("sub_category_id", subCat);

    try {
      const url = `${baseUrl}/image/create`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Response ", response);
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error while adding the image", error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <form onSubmit={handleImageSubmit} className="w-1/2">
      <h2 className="text-xl font-semibold mb-4">Add Images</h2>
      <div className="mb-4">
        <label
          htmlFor="image-title"
          className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
        >
          Category
        </label>
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            {category.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="image-title"
          className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
        >
          Sub Category
        </label>
        <Select value={subCat} onValueChange={setSubCat}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sub category" />
          </SelectTrigger>
          <SelectContent>
            {subCategory.length > 0 ? (
              subCategory.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.sub_category_name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled className="text-gray-500">
                No sub-categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="image-title"
          className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
        >
          Image Sise
        </label>
        <Select value={size} onValueChange={SetSize}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sub category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PORTRAIT">Portrait</SelectItem>
            <SelectItem value="LANDSCAPE">Landscape</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="image-title"
          className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
        >
          Image Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="image-title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter image title"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image-title"
          className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
        >
          Image Preview
        </label>
        <img
          src={
            imagePreview
              ? imagePreview
              : "https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
          }
          alt="Previe Image"
          className="rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image-file"
          className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
        >
          Upload Image
        </label>
        <input
          type="file"
          id="image-file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <Button type="submit">Upload Image</Button>
            <Toaster position="top-right" reverseOrder={false} />
      
    </form>
  );
};

export default AddImage;

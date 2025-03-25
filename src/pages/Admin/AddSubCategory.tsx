import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { baseUrl } from "../../App";
import axios from "axios";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import toast, { Toaster } from "react-hot-toast";

interface Category {
  id: number;
  category_name: string;
  category_description: string;
}

interface SubCategory {
  id: number;
  sub_category_name: string;
  sub_category_description: string;
  category_id: number;
}

const AddSubCategory = () => {
  const [sub_category_name, setSubCategoryName] = useState<string>("");
  const [sub_category_description, setSubCategoryDescription] =
    useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);

  // Get all Category
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
      console.log("Error ", error);
    }
  };

  // Add New Category
  const addNewSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `${baseUrl}/subCategory/create`;
      const response = await axios.post(
        url,
        {
          sub_category_name,
          sub_category_description,
          category_id: categoryId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response ", response);
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  // Get all Sub Category
  const getAllSubCategory = async () => {
    try {
      const url = `${baseUrl}/subCategory/get`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Response ", response);
      setSubCategory(response.data.data);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllSubCategory();
  }, []);

  // Delete Sub Category
  const deleteSubCategory = async (id: any) => {
    try {
      const url = `${baseUrl}/subCategory/delete/${id}`;
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Del Response ", response);
      toast.success(response.data.message);
    } catch (error) {}
  };

  return (
    <div>
      {/* show the Form to Add Category  */}
      <form onSubmit={addNewSubCategory}>
        <h2 className="text-xl font-semibold mb-4">Add Sub Category</h2>
        <div className="mb-4">
          <label
            htmlFor="image-title"
            className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
          >
            Category Id
          </label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sub category" />
            </SelectTrigger>
            <SelectContent>
              {category.length > 0 ? (
                category.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.category_name}
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
            Sub Category Name
          </label>
          <Input
            type="text"
            value={sub_category_name}
            onChange={(e) => setSubCategoryName(e.target.value)}
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
            Sub Category Description
          </label>
          <textarea
            rows={4}
            value={sub_category_description}
            onChange={(e) => setSubCategoryDescription(e.target.value)}
            id="image-title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter image title"
          />
        </div>
        <Button type="submit">Add Sub Category</Button>
      </form>

      {/* show all the Category */}
      <div className="mt-20">
        <h2 className="text-xl font-semibold mb-4">All Sub Category</h2>
        <Table>
          <TableCaption>A list of your all Sub category.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Id</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategory.map((item) => (
              <TableRow>
                <TableCell className="text-right">{item.id}</TableCell>
                <TableCell className="font-medium">
                  {item.sub_category_name}
                </TableCell>
                <TableCell>{item.sub_category_description}</TableCell>
                <TableCell>
                  {category.find((cat) => cat.id === item.category_id)
                    ?.category_name || "Unknown"}
                </TableCell>
                <TableCell>
                  <button onClick={() => deleteSubCategory(item.id)}>
                    <Trash2 />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default AddSubCategory;

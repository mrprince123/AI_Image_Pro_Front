import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import toast, { Toaster } from "react-hot-toast";
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

interface Category {
  id: number;
  category_name: string;
  category_description: string;
}

const AddCategory = () => {
  const [category_name, setCategoryName] = useState<string>("");
  const [category_description, setCategoryDescription] = useState<string>("");

  const [category, setCategory] = useState<Category[]>([]);

  // Add New Category
  const addNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `${baseUrl}/category/create`;
      const response = await axios.post(
        url,
        { category_name, category_description },
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

  // Get all the Category
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

  useEffect(() => {
    getAllCategory();
  }, []);

  // Delete Category
  const deleteCategory = async (id: any) => {
    try {
      const url = `${baseUrl}/category/delete/${id}`;
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
      <form onSubmit={addNewCategory}>
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>

        <div className="mb-4">
          <label
            htmlFor="image-title"
            className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300"
          >
            Category Name
          </label>
          <Input
            type="text"
            value={category_name}
            onChange={(e) => setCategoryName(e.target.value)}
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
            Category Description
          </label>
          <textarea
            rows={4}
            value={category_description}
            onChange={(e) => setCategoryDescription(e.target.value)}
            id="image-title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter image title"
          />
        </div>
        <Button type="submit">Add Category</Button>
      </form>

      {/* show all the Category */}
      <div className="mt-20">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>

        <Table>
          <TableCaption>A list of your all category.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Id</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.map((item) => (
              <TableRow>
                <TableCell className="text-right">{item.id}</TableCell>
                <TableCell className="font-medium">
                  {item.category_name}
                </TableCell>
                <TableCell>{item.category_description}</TableCell>
                <TableCell>
                  <button onClick={() => deleteCategory(item.id)}>
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

export default AddCategory;

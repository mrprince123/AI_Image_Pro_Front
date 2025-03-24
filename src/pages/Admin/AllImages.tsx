import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../App";
import { Button } from "../../components/ui/button";

interface Image {
  id: number;
  image_name: string;
  image_url: string;
  image_alt: string;
  sub_category_id: number;
}

const AllImages = () => {
  const [image, setImage] = useState<Image[]>([]);

  // Get all the Images
  const getAllImages = async () => {
    try {
      const url = `${baseUrl}/image/get`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Response", response);
      setImage(response.data.data);
    } catch (error) {
      console.log("Error while Getting all images", error);
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);

  // Delete the Images
  const deleteImage = async (id: number) => {
    try {
      const url = `${baseUrl}/image/delete/${id}`;
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Response", response);
      setImage(response.data.data);
    } catch (error) {
      console.log("Error while Deleting", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Images</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {image.map((item) => (
          <div
            key={item.id}
            className="border-2 border-dashed border-gray-300 rounded-lg"
          >
            <img
              src={item.image_url}
              alt={item.image_alt}
              className="rounded-lg"
            />
            <div className="p-4">
              <h4>{item.image_name}</h4>
              <div className="flex justify-end gap-2">
                <Button>Edit</Button>
                <Button
                  onClick={() => deleteImage(item.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllImages;

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePreviewContext } from "@/context/ContextProvider";

export default function Create() {
  const router = useRouter();
  const { preview, setPreview } = usePreviewContext();

  const inputImages = useRef(preview.images || []);
  const initialFormData = {
    date: preview.date || "",
    weather: preview.weather || "",
    text: preview.text || "",
    images: preview.images || [], // This will store the selected image file
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // When the context preview data changes, update the form data state
    setFormData({
      date: preview.date || "",
      weather: preview.weather || "",
      text: preview.text || "",
      images: preview.images || [], // Preserve the images already selected
    });
  }, [preview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const imageFiles = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: imageFiles,
    });
  };

  const handleReset = () => {
    setFormData({
      date: "",
      weather: "",
      text: "",
      images: [],
    });
    if (inputImages.current) {
      inputImages.current.value = "";
      inputImages.current.type = "text";
      inputImages.current.type = "file";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    setPreview(formData);
    router.push("/preview");
  };

  return (
    <div className="m-5">
      <h1 className="text-2xl mb-4">Fill in your diary</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="rounded-md p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Weather:</label>
          <input
            type="text"
            name="weather"
            value={formData.weather}
            onChange={handleInputChange}
            className="rounded-md p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Text:</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            className="rounded-md p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Images:</label>
          <input
            type="file"
            name="images"
            accept=".gif,.jpg,.jpeg,.png"
            ref={inputImages}
            onChange={handleImageChange}
            className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            multiple
          />
        </div>
        {/* Image previews */}
        <div className="mb-4">
          {formData?.images?.length > 0 &&
            formData?.images?.map((image, index) => {
              if (image instanceof File || image instanceof Blob) {
                return (
                  <div>
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      width="100" // Adjust the width as needed
                      height="100" // Adjust the height as needed
                    />
                    <p>{image.name}</p>
                  </div>
                );
              }
            })}
        </div>
        <div className="flex justify-start gap-5">
          <Link href="/">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Main Menu
            </button>
          </Link>

          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

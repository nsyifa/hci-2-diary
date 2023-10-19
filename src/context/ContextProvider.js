"use client";
import { createContext, useContext, useEffect, useState } from "react";

//context for preview data
const PreviewContext = createContext({});

export const PreviewContextProvider = ({ children }) => {
  // Check if localStorage is available
  const isLocalStorageAvailable = typeof localStorage !== "undefined";

  // Load data from localStorage on initial render (client-side)
  const [preview, setPreview] = useState(() => {
    if (isLocalStorageAvailable) {
      const storedPreview = localStorage.getItem("preview");
      return storedPreview ? JSON.parse(storedPreview) : {};
    } else {
      return {};
    }
  });

  // Update localStorage whenever the preview state changes (client-side)
  useEffect(() => {
    if (isLocalStorageAvailable) {
      localStorage.setItem("preview", JSON.stringify(preview));
    }
  }, [preview]);

  return (
    <PreviewContext.Provider value={{ preview, setPreview }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreviewContext = () => useContext(PreviewContext);

// context to get all diary data
const DiaryContext = createContext({});

export const DiaryContextProvider = ({ children }) => {
  // Load data from an API on initial render (client-side)
  const [diaries, setDiaries] = useState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("../api/diary-data")
        .then((res) => res.json())
        .then((data) => {
          setDiaries(data);
        });
    }
  }, []);

  return (
    <DiaryContext.Provider value={{ diaries, setDiaries }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiaryContext = () => useContext(DiaryContext);

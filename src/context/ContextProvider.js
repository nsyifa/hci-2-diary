"use client";

import { createContext, useContext, useEffect, useState } from "react";

//context for preview data
const PreviewContext = createContext({});

export const PreviewContextProvider = ({ children }) => {
  // Load data from localStorage on initial render
  const [preview, setPreview] = useState(() => {
    const storedPreview = localStorage.getItem("preview");
    return storedPreview ? JSON.parse(storedPreview) : {};
  });

  // Update localStorage whenever the preview state changes
  useEffect(() => {
    localStorage.setItem("preview", JSON.stringify(preview));
  }, [preview]);

  return (
    <PreviewContext.Provider value={{ preview, setPreview }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreviewContext = () => useContext(PreviewContext);
//-------------

// context to get all diary data
const DiaryContext = createContext({});

export const DiaryContextProvider = ({ children }) => {
  // Load data from localStorage on initial render
  const [diaries, setDiaries] = useState();
  useEffect(() => {
    fetch("../api/diary-data")
      .then((res) => res.json())
      .then((data) => {
        setDiaries(data);
      });
  }, []);

  return (
    <DiaryContext.Provider value={{ diaries, setDiaries }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiaryContext = () => useContext(DiaryContext);

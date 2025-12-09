"use client";

import { useState } from "react";
import BlogCategories from "./BlogCategories";
import BlogGrid from "./BlogGrid";

export default function BlogContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <>
      <BlogCategories 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <BlogGrid selectedCategory={selectedCategory} />
    </>
  );
}

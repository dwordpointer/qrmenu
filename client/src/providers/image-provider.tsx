import React, { useState } from "react";
import { ImageContext } from "../context/image-context";

interface Props {
  children: React.ReactNode;
}

function ImageProvider({ children }: Props) {
  const [image, setImage] = useState<string | undefined>(undefined);
  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export default ImageProvider;

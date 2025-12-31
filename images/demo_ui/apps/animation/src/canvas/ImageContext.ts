import  ImageHolder from "./ImageHolder.ts";
import {createContext} from "react";

const ImageContext = createContext<ImageHolder|null>(null);

export default ImageContext;
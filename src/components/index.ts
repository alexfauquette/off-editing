import { Component } from "./models";
import {
  CropperPackagingFR as PackagingImageCropperModule,
  CropperNutritionFR,
  CropperIngredientsFR,
} from "./ImageCropper";
import PackagingImageViewModule from "./PackagingImageView";
import PackagingTextInputModule from "./PackagingTextComponent";

const components: { [key: string]: Component } = {
  PackagingImageCropperModule, //TODO: remove
  PackagingImageViewModule,
  PackagingTextInputModule,
  // CropperPackagingFR,
  CropperNutritionFR,
  CropperIngredientsFR,
};

export default components;

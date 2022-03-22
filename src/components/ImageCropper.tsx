import * as React from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { getImageUrl } from "../off/request";
import { RootState, AppDispatch } from "../redux/store";

import { useDispatch, useSelector } from "react-redux";
import { upsertData } from "../redux/editorData/editorDataSlice";

import ImageSelector from "./ImageSelector";

const getInitialCrop = ({ x1, x2, y1, y2 }) => ({
  x: parseFloat(x1),
  y: parseFloat(y1),
  width: x2 - x1,
  height: y2 - y1,
});

const extractImages = (images) => {
  if (!images) {
    return [];
  }
  return Object.keys(images)
    .filter((key) => !key.includes("_"))
    .map((key) => ({
      id: key,
      uploaded_t: parseInt(images[key].uploaded_t),
      uploader: images[key].uploader,
    }))
    .sort((a, b) => b.uploaded_t - a.uploaded_t);
};

export const data_needed = ["images"];

export interface stateInterface {
  imageId?: string;
  cropData?: object;
}

interface ComponentProps {
  id: string;
  imageKey: string;
}

export const Component = ({ imageKey, id }: ComponentProps) => {
  const imageType = imageKey.split('_')[0]

  const dispatch = useDispatch<AppDispatch>();

  const productData = useSelector<RootState>((state) => {
    if (state.offData.codes.length < 1) {
      return null;
    }
    return state.offData.data[state.offData.codes[0]];
  }) as any;

  const productDataIsLoading = !productData || productData.isLoading;
  const code = productData.code;

  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [imageId, setImageId] = React.useState<string>();

  const cropperRef = React.useRef<HTMLImageElement>(null);

  const { angle, coordinates_image_size, imgid, x1, x2, y1, y2 } =
    productData?.images?.[imageKey] || {};
  const initialData = React.useMemo<any>(
    () => (x1 !== undefined ? getInitialCrop({ x1, x2, y1, y2 }) : {}),
    [x1, x2, y1, y2]
  );

  React.useEffect(() => {
    setImageId(imgid || undefined);
  }, [code, imgid]);

  React.useEffect(() => {
    dispatch(upsertData({ editorId: id, data: { imageId } }));
  }, [imageId, dispatch, id]);

  const reset = React.useCallback(() => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      cropper.reset();
      cropper.setData(initialData);
      dispatch(upsertData({ editorId: id, data: { crop: initialData } }));
    }
  }, [dispatch, initialData, id]);

  React.useEffect(() => {
    if (isReady) {
      reset();
      setIsReady(false);
    }
  }, [isReady, reset]);

  const src = getImageUrl(
    productData?.code,
    imageId || imgid,
    coordinates_image_size || 400
  );

  const handleCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      const newData = cropper?.getData(true);
      dispatch(upsertData({ editorId: id, data: { crop: newData } }));
    }
  };

  const [imageListVisible, setImageListVisible] = React.useState(false);

  React.useEffect(() => {
    if (!productDataIsLoading) {
      setImageListVisible(imgid === undefined);
    }
  }, [productDataIsLoading, imgid]);

  const openImages = () => {
    setImageListVisible(true);
  };
  const closeImages = () => {
    setImageListVisible(false);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "2rem", width: "100%" }}>{imageType} cropper {id}</div>
      <div style={{ height: "calc(100% - 5rem)", width: "100%" }}>
        {productDataIsLoading ? (
          <CircularProgress />
        ) : (
          <Cropper
            src={src || `${process.env.PUBLIC_URL}/assets/not_selected.png`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = `${process.env.PUBLIC_URL}/assets/404.png`;
            }}
            style={{ height: "100%", width: "100%" }}
            guides={false}
            autoCrop={!!initialData}
            data={(initialData && initialData?.x >= 0 && initialData?.height >= 0) ? initialData : undefined}
            cropend={handleCrop}
            checkCrossOrigin={false}
            ref={cropperRef}
            viewMode={1}
            minContainerHeight={100}
            minContainerWidth={100}
            ready={() => setIsReady(true)}
          />
        )}
      </div>
      <div style={{ height: "3rem" }}>
        <Button onClick={reset}>Reset</Button>

        <Button onClick={openImages}>Other Image</Button>
      </div>
      {imageListVisible && (
        <ImageSelector
          imageType={imageType}
          isOpen={imageListVisible}
          close={closeImages}
          imagesIds={extractImages(productData?.images)}
          selectImage={setImageId}
          defaultId={imageId}
          code={productData?.code}
        />
      )}
    </div>
  );
};

export const getError = (imageKey: string) => ({ productData, state: { imageId, crop } }) => { };
export const sendData = (imageKey: string) => ({
  productData,
  state: { imageId, crop: cropData },
}) => {
  const { angle, coordinates_image_size, imgid, x1, x2, y1, y2 } =
    productData?.images?.[imageKey] || {};
  const initialData =
    x1 !== undefined ? getInitialCrop({ x1, x2, y1, y2 }) : undefined;
  if (
    initialData === undefined ||
    imageId !== imgid ||
    // verify the crop has been modified
    Math.abs(cropData.x - initialData.x) > 10 ||
    Math.abs(cropData.y - initialData.y) > 10 ||
    Math.abs(cropData.width - initialData.width) > 20 ||
    Math.abs(cropData.height - initialData.height) > 20
  ) {
    const code = productData.code;
    const x1 = cropData.x;
    const y1 = cropData.y;
    const x2 = cropData.x + cropData.width;
    const y2 = cropData.y + cropData.height;
    const coordinate = `x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;
    // axios.post(`https://world.openfoodfacts.net/cgi/product_image_crop.pl?id=${imageKey}&code=${code}&imgid=${imageId}&${coordinate}`)
    console.log({
      post: `https://world.openfoodfacts.net/cgi/product_image_crop.pl?id=${imageKey}&code=${code}&imgid=${imageId}&${coordinate}`,
    });
  }
};

const module = {
  component: (props) => <Component {...props} imageKey='packaging_fr' />,
  getError: getError('packaging_fr'),
  sendData: sendData('packaging_fr'),
  data_needed,
};


export const CropperPackagingFR = {
  component: (props) => <Component {...props} imageKey='packaging_fr' />,
  getError: getError('packaging_fr'),
  sendData: sendData('packaging_fr'),
  data_needed,
};

export const CropperNutritionFR = {
  component: (props) => <Component {...props} imageKey='nutrition_fr' />,
  getError: getError('nutrition_fr'),
  sendData: sendData('nutrition_fr'),
  data_needed,
};

export const CropperIngredientsFR = {
  component: (props) => <Component {...props} imageKey='ingredients_fr' />,
  getError: getError('ingredients_fr'),
  sendData: sendData('ingredients_fr'),
  data_needed,
};

export default module;

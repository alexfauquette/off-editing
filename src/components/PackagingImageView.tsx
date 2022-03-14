import * as React from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CircularProgress from '@mui/material/CircularProgress';
import { RootState } from '../redux/store'

import { useSelector } from 'react-redux'


export const data_needed = ["images"]

export interface stateInterface { imageId?: string; cropData?: object }

interface PackagingImageViewProps {
    id: string;
}




export const PackagingImageView = (props: PackagingImageViewProps) => {
    const productData = useSelector<RootState>((state) => {
        if (state.offData.codes.length < 1) {
            return null
        }
        return state.offData.data[state.offData.codes[0]]
    }) as any

    const productDataIsLoading = !productData || productData.isLoading

    const src = productData?.image_packaging_url

    return (
        <div
            style={{ height: "100%", width: "100%" }}
        >
            <div style={{ height: '2rem', width: "100%" }} />
            <div style={{ height: 'calc(100% - 5rem)', width: '100%' }} className="NotDraggable"  >
                {productDataIsLoading ? <CircularProgress /> :
                    <TransformWrapper>
                        <TransformComponent
                            wrapperStyle={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            }}
                            contentStyle={{
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <img
                                src={src}
                                alt=''
                                style={{
                                    objectFit: 'contain',
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        </TransformComponent>
                    </TransformWrapper>
                }
            </div>
        </div>
    );
}

export const getError = () => { }
export const sendData = () => { }



const module = {
    component: PackagingImageView,
    getError,
    sendData,
};

export default module;
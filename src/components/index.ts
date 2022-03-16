import { Component } from './models'
import PackagingImageCropperModule from './ImageCropper';
import PackagingImageViewModule from './PackagingImageView'
import PackagingTextInputModule from './PackagingTextComponent'



const components: { [key: string]: Component } = {
    PackagingImageCropperModule,
    PackagingImageViewModule,
    PackagingTextInputModule
}

export default components
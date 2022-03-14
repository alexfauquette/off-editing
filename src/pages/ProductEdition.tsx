import * as React from 'react'
import { RouteComponentProps } from '@reach/router';
import { fetchNewCodes, fetchOffProductData, removeCode } from '../redux/offData'
import { addMessage, removeMessage, validateData, Message } from '../redux/editorData';
import { RootState, AppDispatch } from '../redux/store'

import { useDispatch, useSelector } from 'react-redux'


import GridLayout, { WidthProvider } from "react-grid-layout";
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link'

import components from '../components'

const ResponsiveGridLayout = WidthProvider(GridLayout);


interface ProductEditionProps extends RouteComponentProps {
    campagne?: string
    state?: string
}
const layout = [
    {
        i: "c", x: 0, y: 0, w: 5, h: 5, id: 'packaging_fr_cropper', componentName: "PackagingImageCropperModule",

    },
    { i: "d", x: 5, y: 0, w: 5, h: 5, id: 'packaging_fr_view', componentName: "PackagingImageViewModule" }

];

const ProductEdition = (props: ProductEditionProps) => {
    const { campagne, state } = props;

    const dispatch = useDispatch<AppDispatch>()

    const codes = useSelector<RootState>((state) => state.offData.codes) as string[]
    const currentData = useSelector<RootState>((state) => {
        if (state.offData.codes.length < 1) {
            return null
        }
        return state.offData.data[state.offData.codes[0]]
    }) as any

    const codesToFetch = useSelector<RootState>((state) => {
        if (state.offData.codes.length < 1) {
            return []
        }
        const lastIndex = Math.min(5, state.offData.codes.length)
        return state.offData.codes.slice(0, lastIndex).filter(code => state.offData.data[code] === undefined);
    }) as string[]

    React.useEffect(() => {
        codesToFetch.forEach((code: string) => {
            dispatch(fetchOffProductData({ code, requestedFields: ['product_name', 'images', 'image_packaging_url'] }))
        });
    }, [dispatch, codesToFetch])

    React.useEffect(() => {
        if (codes.length < 10) {
            dispatch(fetchNewCodes())
        }
    }, [dispatch, codes.length])

    const skip = () => {
        dispatch(removeCode())
    }
    const validate = () => {
        dispatch(validateData())
        // skip()
    }
    const handleCloseMessage = (id) => {
        dispatch(removeMessage({ id }))
    }
    const handleAddMessage = (message, status = 'info') => {
        dispatch(addMessage({ message, status } as Message))
    }
    const editorState = useSelector<RootState>(state => state?.editorData.data)
    const messagesState = useSelector<RootState>(state => state.editorData.messages)
    console.log(messagesState)
    return (<div style={{ position: 'relative', minHeight: '100vh' }}>
        {(messagesState as Message[]).map(({ id, status, message }) => <Snackbar key={id} open autoHideDuration={2000} onClose={() => handleCloseMessage(id)}>
            <Alert severity={status} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>)}

        <Paper sx={{ minHeight: "4rem", position: "sticky", top: 0, zIndex: 1 }} >
            <Box sx={{ height: "2rem", width: "100%", display: 'flex', justifyContent: "space-between" }}>
                <Box sx={{ m: '1rem' }}>
                    <span>Campagne: {campagne} (Step {state})</span>
                </Box>
                <Box sx={{ m: '1rem' }}>
                    <Link href="#" underline="none" sx={{ mr: '1rem' }}>
                        See
                    </Link>
                    <Link href="#" underline="none">
                        Edit
                    </Link>
                </Box>
            </Box>
            <Paper>
                <pre>
                    {JSON.stringify(editorState, null, 2)}
                </pre>
            </Paper>
        </Paper>
        {currentData ? <ResponsiveGridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={100}
            draggableCancel=".NotDraggable"
            onResize={() => window.dispatchEvent(new Event('resize'))}
            onResizeStop={() => window.dispatchEvent(new Event('resize'))}
        >
            {layout.map(({ i, id, ...other }) => <Box key={i} >
                <Paper sx={{ width: "100%", height: "100%" }}>
                    <DragIndicatorIcon sx={{ position: 'fixed', top: 1, right: 1, cursor: "grab" }} />
                    {React.createElement(components[other.componentName].component, { id })}
                </Paper>
            </Box>
            )}


        </ResponsiveGridLayout > : null
        }
        <Paper sx={{ position: "sticky", bottom: 0, zIndex: 1 }}>
            <Box sx={{ height: "2rem", p: 1, justifyContent: 'end', display: 'flex', position: "sticky", bottom: 0 }}>
                {['info', 'error', 'warning'].map(status => <Button onClick={() => handleAddMessage("toto", status)}>
                    {status}
                </Button>)}
                <Button onClick={validate} variant='outlined'>
                    validate
                </Button >

                <Button onClick={skip} variant='outlined'>
                    Skip
                </Button >
            </Box >
        </Paper >
    </div >)
}



export default ProductEdition
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import { v4 as uuid } from "uuid";
import components from '../../components'

export const updateInterface = createAsyncThunk<void, { campagne: string; processSate: number; }>(
    'offData/updateInterface',
    async ({ campagne, processSate }, thunkAPI) => {

        const currentState = thunkAPI.getState() as any;

        thunkAPI.dispatch(updatePage({ campagne, processSate }))
        if (currentState.editorData.fetchedInterfaces?.[campagne]) {
            thunkAPI.dispatch(updateLayout({ layout: currentState.editorData.fetchedInterfaces?.[campagne]?.[processSate] }))
        }
        const response = await fetch(`https://amathjourney.com/api/off-annotation/layout/${campagne}`);
        if (!response.ok) {
            return
        }

        const data = await response.json()

        const formattedLayout = {
        }
        data.result.forEach(({ campagne: fetchedCampagne, state: fetchedState, layout }) => {
            const layoutWithI = layout.map(obj => ({ i: obj.id, ...obj }))
            if (formattedLayout[fetchedCampagne] === undefined) {
                formattedLayout[fetchedCampagne] = { [fetchedState]: layoutWithI }
            }
            else if (formattedLayout[fetchedCampagne][fetchedState] === undefined) {
                formattedLayout[fetchedCampagne][fetchedState] = layoutWithI
            }
        });
        thunkAPI.dispatch(updateLayout({ layout: formattedLayout?.[campagne]?.[processSate] }))
        thunkAPI.dispatch(saveFetchedLayouts({ formattedLayout }))

    }
)
export const validateData = createAsyncThunk<{ message?: string }>(
    'offData/validateData',
    async (_, thunkAPI) => {

        const state = thunkAPI.getState() as any;
        const code = state.offData.codes[0]
        const productData = state.offData.data[code]

        // Step 1: validate data to send
        const evalutations = state.editorData.interface.map(
            ({ componentName, id }) => components[componentName].getError(
                {
                    productData,
                    state: state.editorData.data[id]
                }
            )
        )

        // If error detected returns the error message
        const errorIndex = evalutations.findIndex((message) => message && message.severity && message.severity === 'error')
        if (errorIndex >= 0) {
            console.log("error1")
            return thunkAPI.rejectWithValue(evalutations[errorIndex])
        }

        // TODO: allows this behavior
        // const warningIndex = evalutations.findIndex((message) => message && message.severity && message.severity === 'warning')

        // TODO: make multiple tries
        try {
            await state.editorData.interface
                .forEach(({ componentName, id }) => {
                    console.log(state.editorData.data[id])
                    components[componentName].sendData(
                        {
                            productData, state: state.editorData.data[id]
                        })
                }
                )
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.toString(), severity: 'error' })
        }

        // Move to new state
        try {
            await axios.post(`https://amathjourney.com/api/off-annotation/${state.editorData.page.campagne}/${code}`, {
                data: {},
                flag: false,
                newState: state.editorData.page.processSate + 1
            })
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.toString(), severity: 'error' })
        }

    }
)

export interface LayoutObject {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    id: string;
    componentName: string;
}
export interface Message {
    id: string;
    status: 'info' | 'error' | 'warning';
    message: string;
}

interface EditorState {
    data: { [interfaceId: string]: object };
    interface: LayoutObject[];
    fetchedInterfaces: {
        [campagne: string]: { [state: number]: LayoutObject[] }
    };
    page: {
        campagne: string,
        processSate: number,
    };
    messages: Message[];
}
const initialState: EditorState = {
    page: {
        campagne: 'eco-carrefour',
        processSate: 0,
    },
    interface: [],
    data: {},
    fetchedInterfaces: {},
    messages: [],
}

export const editorDataSlice = createSlice({
    name: 'editorData',
    initialState,
    reducers: {
        upsertData: (state, action: PayloadAction<{ editorId: string, data: object }>) => {
            const { editorId,
                data } = action.payload;
            if (state.data[editorId]) {
                state.data[editorId] = { ...state.data[editorId], ...data }
            }
            else {
                state.data[editorId] = { ...data }
            }
        },
        cleanData: (state) => { state.data = {} },
        addMessage: (state, action: PayloadAction<Omit<Message, 'id'>>) => {
            const id = uuid();
            state.messages.push({ id, ...action.payload })
        },
        removeMessage: (state, action: PayloadAction<Pick<Message, 'id'>>) => {
            const { id: idToRemove } = action.payload;
            state.messages = state.messages.filter(({ id }) => id !== idToRemove)
        },
        updatePage: (state, action: PayloadAction<{ campagne: string, processSate: number }>) => {
            state.page = { ...action.payload }
        },
        updateLayout: (state, action: PayloadAction<{ layout: LayoutObject[] }>) => {
            state.interface = action.payload.layout
        },
        saveFetchedLayouts: (state, action: PayloadAction<{
            formattedLayout: {
                [campagne: string]: { [state: number]: LayoutObject[] }
            };
        }>) => {
            state.fetchedInterfaces = { ...state.fetchedInterfaces, ...action.payload.formattedLayout }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(validateData.fulfilled, (state, { payload }) => {
            const id = uuid();
            state.messages.push({ id, message: payload.message, status: 'info' })
        });
        builder.addCase(validateData.rejected, (state, { error }) => {
            const id = uuid();
            state.messages.push({ id, message: error.message, status: 'error' })
        });
        builder.addCase(validateData.pending, (state) => {
            const id = uuid();
            state.messages.push({ id, message: '', status: 'error' })
        });
    }
})

export const {
    upsertData,
    cleanData,
    addMessage,
    removeMessage,
    updatePage,
    updateLayout,
    saveFetchedLayouts } = editorDataSlice.actions

export default editorDataSlice
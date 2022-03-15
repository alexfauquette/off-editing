import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DataInterface {
    code: string;
    state: number;
    [key: string]: any;
}
interface FetchCodes {
    result: DataInterface
}
const fetchNewCodes = createAsyncThunk<FetchCodes, {
    campagne: string,
    state: number
}>(
    'offData/fetchNewCodes',
    async ({ campagne, state }, thunkAPI) => {
        const response = await fetch(`https://amathjourney.com/api/off-annotation/data/${campagne}?state=${state}&flag=false`);
        const data = await response.json()
        if (response.ok) {
            return data
        }

        return thunkAPI.rejectWithValue({ ...data })
    }
)

interface OFFRequest {
    code: string;
    requestedFields: string[];
}
const fetchOffProductData = createAsyncThunk<OFFRequest, any>(
    'offData/fetchOffProductData',
    async (offRequest, thunkAPI) => {
        const { code, requestedFields } = offRequest
        const response = await fetch(`https://fr.openfoodfacts.org/api/v0/product/${code}.json?fields=${requestedFields.join(',')}`)
        // product_name, images
        const data = await response.json()
        if (response.ok) {
            return { ...data.product, code: data.code }
        }
        return thunkAPI.rejectWithValue({ ...data, code })
    }
)

interface State {
    codes: string[],
    seen: string[],
    data: {
        [code: string]: {
            isLoading?: boolean;
            [key: string]: any;
        }
    }
}
const initialState: State = {
    codes: [],
    seen: [],
    data: {}
}

export const offDataSlice = createSlice({
    name: 'offData',
    initialState,
    reducers: {
        removeCode: state => {
            const code = state.codes[0];
            state.seen = [code, ...state.seen]
            state.codes = state.codes.slice(1)
        },
        addData: (state, action: PayloadAction<{ code: string, data: any }>) => {
            state.data[action.payload.code] = action.payload.data
        },
        addCodes: (state, action: PayloadAction<{ codes: string[] }>) => {
            state.codes = [...state.codes, ...action.payload.codes.filter(code => !state.seen.includes(code))]
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNewCodes.fulfilled, (state, { payload }) => {
            const newCodes = payload.result.map(({ code }) => code)
                .filter(code => !state.codes.includes(code))
                .filter(code => !state.seen.includes(code))
            state.codes = [...state.codes, ...newCodes]
        });

        // OFF fetching
        builder.addCase(fetchOffProductData.fulfilled, (state, { payload }) => {
            state.data[payload.code] = { ...payload, isLoading: false }
        });
        builder.addCase(fetchOffProductData.rejected, (state, { error }) => {
            state.data[error.code] = { isLoading: false, error }
        });
        builder.addCase(fetchOffProductData.pending, (state, { meta: { arg } }) => {
            state.data[arg.code] = { isLoading: true }
        });
    }
})

export const { addCodes, removeCode } = offDataSlice.actions
export { fetchNewCodes, fetchOffProductData }

export default offDataSlice
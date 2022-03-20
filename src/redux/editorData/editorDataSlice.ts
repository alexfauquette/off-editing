import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuid } from "uuid";
import components from "../../components";
import { ErrorInterface } from "../../components/models";
import { removeCode } from "../offData";

export const updateInterface = createAsyncThunk<
  void,
  { campagne: string; processSate: number },
  {
    rejectValue: ErrorInterface;
  }
>("offData/updateInterface", async ({ campagne, processSate }, thunkAPI) => {
  const currentState = thunkAPI.getState() as any;

  thunkAPI.dispatch(updatePage({ campagne, processSate }));
  if (currentState.editorData.fetchedInterfaces?.[campagne]) {
    thunkAPI.dispatch(
      updateLayout(
        currentState.editorData.fetchedInterfaces?.[campagne]?.[processSate]
      )
    );
  }
  const response = await fetch(
    `https://amathjourney.com/api/off-annotation/layout/${campagne}`
  );
  if (!response.ok) {
    return;
  }

  const data = await response.json();

  const formattedLayout = {};

  data.result.forEach(
    ({
      campagne: fetchedCampagne,
      state: fetchedState,
      layout,
      title,
      description,
    }) => {
      const layoutWithI = layout.map((obj) => ({ i: obj.id, ...obj }));
      if (formattedLayout[fetchedCampagne] === undefined) {
        formattedLayout[fetchedCampagne] = {
          [fetchedState]: { layout: layoutWithI, title, description },
        };
      } else if (formattedLayout[fetchedCampagne][fetchedState] === undefined) {
        formattedLayout[fetchedCampagne][fetchedState] = {
          layout: layoutWithI,
          title,
          description,
        };
      }
    }
  );
  thunkAPI.dispatch(updateLayout(formattedLayout?.[campagne]?.[processSate]));
  thunkAPI.dispatch(saveFetchedLayouts({ formattedLayout }));
});
export const validateData = createAsyncThunk<{ message?: string }>(
  "offData/validateData",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const code = state.offData.codes[0];
    const productData = state.offData.data[code];

    if (!state.editorData.interface?.layout) {
      return thunkAPI.rejectWithValue({
        message: "Please way the interface loading",
        severity: "error",
      });
    }

    // Step 1: validate data to send
    const evalutations = state.editorData.interface?.layout.map(
      ({ componentName, id }) =>
        components[componentName].getError({
          productData,
          state: state.editorData.data[id],
        })
    );

    // If error detected returns the error message
    const errorIndex = evalutations.findIndex(
      (errorMessage) =>
        errorMessage &&
        errorMessage.severity &&
        errorMessage.severity === "error"
    );
    if (errorIndex >= 0) {
      return thunkAPI.rejectWithValue(evalutations[errorIndex]);
    }

    thunkAPI.dispatch(removeCode());
    thunkAPI.dispatch(cleanData());

    // TODO: allows this behavior
    // const warningIndex = evalutations.findIndex((message) => message && message.severity && message.severity === 'warning')

    // TODO: make multiple tries
    try {
      await state.editorData.interface?.layout.forEach(
        ({ componentName, id }) => {
          components[componentName].sendData({
            productData,
            state: state.editorData.data[id],
          });
        }
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.toString(),
        severity: "error",
      });
    }

    // Move to new state
    try {
      await axios.post(
        `https://amathjourney.com/api/off-annotation/${state.editorData.page.campagne}/${code}`,
        {
          data: {},
          flag: false,
          newState: state.editorData.page.processSate + 1,
        }
      );
      return {
        message: `Product ${code} updated`,
        severity: "info",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.toString(),
        severity: "error",
      });
    }
  }
);

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
  status: "info" | "error" | "warning";
  message: string;
}
interface FetchedDataInterfaces {
  [campagne: string]: {
    [state: number]: {
      layout: LayoutObject[];
      title: string;
      description: string;
    };
  };
}

interface EditorState {
  data: { [interfaceId: string]: object };
  interface?: { layout: LayoutObject[]; title: string; description: string };
  fetchedInterfaces: FetchedDataInterfaces;
  page: {
    campagne: string;
    processSate: number;
  };
  messages: Message[];
}
const initialState: EditorState = {
  page: {
    campagne: "eco-carrefour",
    processSate: 0,
  },
  interface: undefined,
  data: {},
  fetchedInterfaces: {},
  messages: [],
};

export const editorDataSlice = createSlice({
  name: "editorData",
  initialState,
  reducers: {
    upsertData: (
      state,
      action: PayloadAction<{ editorId: string; data: object }>
    ) => {
      const { editorId, data } = action.payload;
      if (state.data[editorId]) {
        state.data[editorId] = { ...state.data[editorId], ...data };
      } else {
        state.data[editorId] = { ...data };
      }
    },
    cleanData: (state) => {
      state.data = {};
    },
    addMessage: (state, action: PayloadAction<Omit<Message, "id">>) => {
      const id = uuid();
      state.messages.push({ id, ...action.payload });
    },
    removeMessage: (state, action: PayloadAction<Pick<Message, "id">>) => {
      const { id: idToRemove } = action.payload;
      state.messages = state.messages.filter(({ id }) => id !== idToRemove);
    },
    updatePage: (
      state,
      action: PayloadAction<{ campagne: string; processSate: number }>
    ) => {
      state.page = { ...action.payload };
    },
    updateLayout: (
      state,
      action: PayloadAction<{
        layout: LayoutObject[];
        title: string;
        description: string;
      }>
    ) => {
      state.interface = action.payload;
    },
    saveFetchedLayouts: (
      state,
      action: PayloadAction<{
        formattedLayout: FetchedDataInterfaces;
      }>
    ) => {
      state.fetchedInterfaces = {
        ...state.fetchedInterfaces,
        ...action.payload.formattedLayout,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validateData.fulfilled, (state, { payload, ...rest }) => {
      console.log({ ...rest });
      const id = uuid();
      state.messages.push({ id, message: payload.message, status: "info" });
    });
    builder.addCase(
      validateData.rejected,
      (state, { payload }: { payload }) => {
        const id = uuid();
        state.messages.push({
          id,
          message: payload.message,
          status: payload.severity,
        });
      }
    );
    // builder.addCase(validateData.pending, (state, rest) => {
    //   console.log(rest)
    //   const id = uuid();
    //   state.messages.push({ id, message: "", status: "error" });
    // });
  },
});

export const {
  upsertData,
  cleanData,
  addMessage,
  removeMessage,
  updatePage,
  updateLayout,
  saveFetchedLayouts,
} = editorDataSlice.actions;

export default editorDataSlice;

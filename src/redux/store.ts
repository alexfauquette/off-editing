import { configureStore, } from '@reduxjs/toolkit'
import offData from './offData/offDataSlice'
import editorData from './editorData/editorDataSlice'


const store = configureStore({
    reducer: {
        offData: offData.reducer,
        editorData: editorData.reducer,
    },

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
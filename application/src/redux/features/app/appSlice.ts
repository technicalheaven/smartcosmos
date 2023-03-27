import { createSlice } from '@reduxjs/toolkit'

const initialState = { isUserUpdated:  false}

const AppSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsUserUpdated(state, action) {
      state.isUserUpdated = action.payload
      return state
    },
  },
})

export const { setIsUserUpdated } = AppSlice.actions
export const AppStateSelector = (state: any) => state.app
export default AppSlice.reducer
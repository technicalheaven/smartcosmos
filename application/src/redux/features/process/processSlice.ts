import { createSlice } from '@reduxjs/toolkit'

interface ProcessState {
  id: string,
  name: string,
}

const initialState = { id:  "", name: ""} as ProcessState

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcess(state, action) {
      state.id = action?.payload?.id;
      state.name = action?.payload?.name;
    }
  },
})

export const { setProcess } = slice.actions
export default slice.reducer
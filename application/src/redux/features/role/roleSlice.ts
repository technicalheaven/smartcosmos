import { createSlice } from '@reduxjs/toolkit'

interface RoleState {
  id: string,
  name: string,
}

const initialState = { id:  "", name: ""} as RoleState

const slice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole(state, action) {
      state.id = action?.payload?.id;
      state.name = action?.payload?.name;
    }
  },
})

export const { setRole } = slice.actions
export default slice.reducer
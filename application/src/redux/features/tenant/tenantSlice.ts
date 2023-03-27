import { createSlice } from '@reduxjs/toolkit'

interface TenantState {
  id: string,
  name: string,
  status:string,
}

const initialState = { id:  "", name: ""} as TenantState

const slice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant(state, action) {
      state.id = action?.payload?.id;
      state.name = action?.payload?.name;
      state.status=action?.payload?.status;    
    }
  },
})

export const { setTenant } = slice.actions
export default slice.reducer
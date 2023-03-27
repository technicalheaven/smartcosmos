import { createSlice } from '@reduxjs/toolkit'

const filterKeys:any = ['page', 'limit', 'sortBy', 'sortOrder','value', 'url', 'tab', 'diProcess', 'diType', 'diFrom', 'diTo', 'diField', 'diValue', 'FtTagType', 'FtManufacturer', 'FtTagId'];

const initialState:any = {};

filterKeys.forEach((item:any) => {
  initialState[item] = null;
});

const slice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilterState: (state: any, action) => {
      filterKeys.forEach((item: string) => {
        if (item in action.payload) state[item] = action?.payload[item] ?? null;
      });
      state['url'] = window.location.href;
    },
    resetFilterState: (state) => { 
      filterKeys.forEach((item: string) => {
        state[item] = null;
      })
    }
  },
})

export const { setFilterState, resetFilterState } = slice.actions
export default slice.reducer
export const getFilterInfo = (state: any) => state?.filter
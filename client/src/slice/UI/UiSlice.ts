import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  settingsDrawerOpen: boolean;
}

const initialState: UIState = {
  settingsDrawerOpen: false,
};

const UiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSettingsDrawer: (state) => {
      state.settingsDrawerOpen = !state.settingsDrawerOpen;
    },
    openSettingsDrawer: (state) => {
      state.settingsDrawerOpen = true;
    },
    closeSettingsDrawer: (state) => {
      state.settingsDrawerOpen = false;
    },
  },
});

export const { toggleSettingsDrawer, openSettingsDrawer, closeSettingsDrawer } =
  UiSlice.actions;
export default UiSlice.reducer;

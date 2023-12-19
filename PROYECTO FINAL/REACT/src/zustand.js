import { create } from "zustand";

const useMyStore = create((set) => ({
    data: [],
    newData: (dataNew) => set((state) => ({data: [...state.data,dataNew]}))
}))


export default useMyStore;
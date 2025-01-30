import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useScheduleCallHistoryStore = create(
  persist(
    (set) => ({
      schedules: [],
      callHistory:[],
      setSchedules: (data) => set({ schedules:data }),
      setCallHistory: (data) => set({ callHistory:data }),
      clearAllSchedules:()=>set({ callHistory:[] }),
      clearAllCallHistory:()=>set({ callHistory:[] })
    }),
    {
      name: 'Schedules-callHistory-store',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;  
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value)); 
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

export default useScheduleCallHistoryStore;

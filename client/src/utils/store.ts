import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SENDER } from '../../types';

interface State {
  party: SENDER | null;
  connectionId: string | null;
  setValues: ({ _party, _connectionId }: { _party?: SENDER | null, _connectionId?: string | null }) => void;
}

const storeSlice: StateCreator<State, [["zustand/persist", unknown]]> = (set) => ({
  party: null,
  connectionId: null,
  setValues: ({ _party, _connectionId }) => set(state => ({
    party: typeof _party !== 'undefined' ? _party : state.party,
    connectionId: typeof _connectionId !== 'undefined' ? _connectionId : state.connectionId
  })),
});

const storePersist = persist(storeSlice,
  {
    name: 'party-n-connection',
    storage: createJSONStorage(() => sessionStorage)
  }
)

export const useConnectionStore = create<State>()(storePersist)

export const getValuesFromStorage = () => {
  const data = sessionStorage.getItem('party-n-connection');
  if (!data) {
    return null
  }

  try {
    const { state: { party, connectionId } } = JSON.parse(data);
    return {
      party: party ? party as SENDER : undefined,
      connectionId: connectionId ? connectionId as string : undefined
    }
  } catch (error) {
    console.error("Error parsing data from storage", error);
    return null;
  }

}

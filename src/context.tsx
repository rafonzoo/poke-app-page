import {
  createContext,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from 'react'
import type { Pokemon } from './type'

export const PokemonContext = createContext<
  [Pokemon[], Dispatch<SetStateAction<Pokemon[]>>]
>(undefined!)

export const PokemonProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [collection, setCollection] = useState<Pokemon[]>([])

  return (
    <PokemonContext.Provider value={[collection, setCollection]}>
      {children}
    </PokemonContext.Provider>
  )
}

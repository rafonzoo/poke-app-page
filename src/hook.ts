import { useContext } from 'react'
import { PokemonContext } from './context'

export const usePokemon = () => {
  const [collection, setCollection] = useContext(PokemonContext)

  return {
    collection,
    setCollection,
  }
}

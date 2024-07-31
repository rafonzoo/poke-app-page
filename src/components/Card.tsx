import type { Pokemon, PokemonListItem } from '../type'
import { useEffect, useState, type FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePokemon } from '../hook'

const Card: FC<PokemonListItem> = ({ name, url }) => {
  const { collection, setCollection } = usePokemon()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const pokemon = collection.find((item) => item.name === name)
  const imageUrl = pokemon?.sprites.front_default

  useEffect(() => {
    const getPokemonDetail = async () => {
      setLoading(true)

      try {
        // Simulate loading
        await new Promise(res => setTimeout(res, 2_000))
        const response = await fetch(url)
        const pokemon: Pokemon = await response.json()

        setCollection((prev) => [...prev, pokemon])
      } catch (e) { console.log(e) } // prettier-ignore

      setLoading(false)
    }

    if (!pokemon) {
      getPokemonDetail()
    }
  }, [pokemon, setCollection, url])

  return (
    <>
      <div className='card'>
        <div className='content'>
          <div className='figure'>
            <div data-loading={loading}>
              {imageUrl && !loading && <img src={imageUrl} alt='Pokemon' />}
            </div>
          </div>
          <div className='type' data-loading={loading} data-center>
            {(pokemon?.types ?? [{ type: { name: 'Type' } }]).map(
              (poketype, index) => (
                <span key={index}>{poketype.type.name}</span>
              )
            )}
          </div>
          <h2 className='title' data-loading={loading} data-center>
            {(pokemon?.name ?? 'Pokename').replace(/-/g, ' ')}
          </h2>
        </div>
        <span className='get' data-loading={loading}>
          {pokemon?.name ? 'get' : ''}
        </span>
      </div>
      <button
        className='link'
        aria-label='View'
        onClick={() => {
          if (pokemon) {
            navigate({ to: '/pokemon/$name', params: { name: pokemon.name } })
          }
        }}
      />
    </>
  )
}

export default Card

import type { Pokemon } from '../type'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { usePokemon } from '../hook'
import { API_URL } from '../constant'

export const Route = createFileRoute('/pokemon/$name')({
  component: DetailPage,
})

function DetailPage() {
  const [loading, setLoading] = useState(false)
  const { collection, setCollection } = usePokemon()
  const { name } = Route.useParams()
  const pokemon = collection.find((item) => item.name === name)
  const imageUrl = pokemon?.sprites.front_default

  useEffect(() => {
    const getPokemonDetail = async () => {
      setLoading(true)

      try {
        // Simulate loading
        await new Promise(res => setTimeout(res, 2_000))
        const response = await fetch(`${API_URL}/${name}`)
        const pokemon: Pokemon = await response.json()

        setCollection((prev) => [...prev, pokemon])
      } catch (e) { console.log(e) } // prettier-ignore

      setLoading(false)
    }

    if (!pokemon) {
      getPokemonDetail()
    }
  }, [pokemon, name, setCollection])

  function getStatusIcon(name: string) {
    // prettier-ignore
    switch (name) {
      case 'hp': return '🌡'
      case 'attack': return '⚔️'
      case 'defense': return '🛡'
      case 'special-attack': return '🔥'
      case 'special-defense': return '🪩'
      default: return '⚡️'
    }
  }

  function getStatusColor(name: string) {
    // prettier-ignore
    switch (name) {
      case 'hp': return 'rgb(239, 68, 68)'
      case 'attack': return 'rgb(253, 224, 71)'
      case 'defense': return 'rgb(59, 130, 246)'
      case 'special-attack': return 'rgb(249, 115, 22)'
      case 'special-defense': return 'rgb(20, 184, 166)'
      default: return 'rgb(168, 85, 247)'
    }
  }

  return (
    <main className='page-detail safearea'>
      <div className='hero'>
        <div className='figure'>
          <div data-loading={loading}>
            {imageUrl && !loading && <img src={imageUrl} alt='Pokemon' />}
          </div>
        </div>
        <div className='content'>
          <div className='type' data-loading={loading}>
            <span>ID{pokemon?.id ?? 0}</span>
            <span>{pokemon?.height ?? 0} Dm</span>
            <span>{pokemon?.weight ?? 0} Hg</span>
            <span>{pokemon?.base_experience ?? 0} exp</span>
          </div>
          <h2 data-loading={loading}>
            {(pokemon?.name ?? name).replace(/-/g, ' ')}
          </h2>
          <div className='stats'>
            {pokemon?.stats.map(({ stat, base_stat }, index) => (
              <div className='basic' key={index}>
                <span>{getStatusIcon(stat.name)}</span>
                <span>
                  {stat.name
                    .replace('special-attack', 'ultimate')
                    .replace('special-defense', 'armor')}
                </span>
                <div className='chart'>
                  {!loading && (
                    <span
                      style={{
                        width: `${Math.min(base_stat, 100)}%`,
                        backgroundColor: getStatusColor(stat.name),
                      }}
                    />
                  )}
                </div>
                <span>{base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='attributes'>
        <h3 data-loading={loading}>Types and Ability</h3>
        <ul data-loading={loading}>
          {pokemon?.types.map(({ type }, index) => (
            <li key={index}>{type.name.replace(/-/g, ' ')}</li>
          ))}
          {pokemon?.abilities.map(({ ability }, index) => (
            <li key={index}>{ability.name.replace(/-/g, ' ')}</li>
          ))}
        </ul>
      </div>
      <div className='attributes'>
        <h3 data-loading={loading}>Moves</h3>
        <ul data-loading={loading}>
          {pokemon?.moves.map(({ move }, index) => (
            <li key={index}>{move.name.replace(/-/g, ' ')}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}

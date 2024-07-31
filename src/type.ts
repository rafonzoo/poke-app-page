export type PokemonListItem = {
  name: string
  url: string
}

export type PokemonList = {
  count: number
  next: string
  previous: null
  results: PokemonListItem[]
}

export type Pokemon = {
  id: number
  name: string
  weight: number
  height: number
  base_experience: number
  sprites: {
    front_default: string | null
  }
  stats: {
    base_stat: number
    stat: {
      name:
        | 'hp'
        | 'attack'
        | 'defense'
        | 'special-attack'
        | 'special-defense'
        | 'speed'
    }
  }[]
  moves: {
    move: {
      name: string
    }
  }[]
  abilities: {
    ability: {
      name: string
    }
  }[]
  types: {
    type: {
      name: string
    }
  }[]
}

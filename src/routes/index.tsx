import type { PokemonList } from '../type'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { API_URL, ITEMS_PER_PAGE } from '../constant'
import Card from '../components/Card'

type QueryResults = PokemonList & { page: number }

export const Route = createFileRoute('/')({
  component: Homepage,
  validateSearch: (search: Record<string, unknown>) => {
    return !search?.page
      ? {}
      : {
          page: Number(search.page),
        }
  },
})

export function Homepage() {
  const [queryResult, setQueryResult] = useState<QueryResults[]>([])
  const [totalPage, setTotalPage] = useState(9999)
  const [loading, setLoading] = useState(false)
  const { page = 1 } = useSearch({ from: '/' })
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const results = queryResult.find((res) => res.page === page)?.results ?? []

  useEffect(() => {
    const updateQueryResult = async () => {
      setLoading(true)

      try {
        const request = await fetch(`${API_URL}?offset=${(page - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`)
        const query: PokemonList = await request.json()

        setQueryResult((prev) => [...prev, { page, ...query }])
        setTotalPage(Math.ceil(query.count / ITEMS_PER_PAGE))
      } catch (e) { console.log(e) } // prettier-ignore

      setLoading(false)
    }

    if (!queryResult.some((result) => result.page === page)) {
      updateQueryResult()
    }

    // Reset
    if (inputRef.current) {
      inputRef.current.value = page + ''
      inputRef.current.blur()
    }
  }, [page, queryResult])

  function customPage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const selectedPage = +(formData.get('page') ?? '1')

    navigate({ to: '/', search: { page: selectedPage } })
  }

  if (loading) {
    return <p className='state'>Loading...</p>
  }

  if (page > totalPage) {
    return <p className='state'>There is no pokemon in this page.</p>
  }

  return (
    <main className='homepage safearea'>
      <div className='pagination'>
        <button
          aria-label='Previous'
          disabled={page === 1}
          onClick={() => navigate({ to: '/', search: { page: page - 1 } })}
        >
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth='0'
            viewBox='0 0 512 512'
            height='2em'
            width='2em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z'></path>
          </svg>
        </button>
        <form onSubmit={customPage}>
          <input
            ref={inputRef}
            type='number'
            name='page'
            defaultValue={page}
            max={totalPage}
            min={1}
          />
          <p>of {totalPage}</p>
        </form>
        <button
          aria-label='Next'
          disabled={!totalPage || page === totalPage}
          onClick={() => navigate({ to: '/', search: { page: page + 1 } })}
        >
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth='0'
            viewBox='0 0 512 512'
            height='2em'
            width='2em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z'></path>
          </svg>
        </button>
      </div>
      <ul className='list'>
        {results.map((pokemon, index) => (
          <li key={index}>
            <Card {...pokemon} />
          </li>
        ))}
      </ul>
    </main>
  )
}

import { render, screen } from '@testing-library/react'
import { Heading } from './routes/__root'
import { describe, it } from 'vitest'

describe('Heading 1', () => {
  it('page should have 1 (one) <h1 />', () => {
    render(<Heading />)

    screen.getByRole('heading', { level: 1 })
  })
})

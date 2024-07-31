import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <Heading />
      <Outlet />
    </>
  ),
})

export const Heading = () => {
  return (
    <h1 className='poke'>
      <span>Pokém</span>
      <span className='logo'></span>
      <span>n</span>
    </h1>
  )
}

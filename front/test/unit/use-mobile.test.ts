import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useIsMobile } from '../../src/hooks/use-mobile'

// Tests unitaires pour le hook responsive mobile.
describe('useIsMobile hook', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renvoie true lorsque la largeur est inférieure au breakpoint mobile', () => {
    // Simule une largeur d'écran mobile et vérifie que le hook renvoie true.
    window.innerWidth = 375
    vi.stubGlobal('matchMedia', createMatchMedia(375))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('renvoie false lorsque la largeur est supérieure au breakpoint mobile', () => {
    // Simule une largeur d'écran desktop et vérifie que le hook renvoie false.
    window.innerWidth = 1024
    vi.stubGlobal('matchMedia', createMatchMedia(1024))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})

function createMatchMedia(width: number) {
  return (query: string) => ({
    matches: width < 768,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

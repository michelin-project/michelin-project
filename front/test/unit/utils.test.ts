import { describe, it, expect } from 'vitest'
import { cn } from '../../src/lib/utils'

// Tests unitaires pour l'utilitaire CSS utilisé dans l'interface.
describe('cn utility', () => {
  it('concatène les classes et ignore les valeurs falsy', () => {
    // Vérifie que les valeurs falsy sont filtrées et que les classes valides sont concaténées.
    expect(cn('btn', false && 'hidden', 'bg-white')).toBe('btn bg-white')
  })

  it('fusionne les classes conditionnelles et statiques', () => {
    // Vérifie que les objets de classes sont correctement transformés par clsx/tailwind-merge.
    expect(cn('text-sm', { 'font-bold': true, 'text-red-500': false })).toBe('text-sm font-bold')
  })
})

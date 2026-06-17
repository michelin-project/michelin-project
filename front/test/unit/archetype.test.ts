import { describe, it, expect } from 'vitest'
import { deriveArchetype } from '../../src/routes/index'

// Tests unitaires pour la logique de dérivation de l'archetype Ride DNA.
describe('deriveArchetype', () => {
  it('retourne l’archetype correct pour vitesse', () => {
    // Vérifie que la priorité vitesse donne l'archetype Performeur.
    const result = deriveArchetype({ priority: 'vitesse' })
    expect(result.name).toBe('Le Performeur')
    expect(result.tagline).toContain('Vitesse pure')
    expect(result.scores.perf).toBe(92)
  })

  it('retourne l’archetype correct pour adhérence', () => {
    // Vérifie que la priorité adhérence donne l'archetype Aventurier.
    const result = deriveArchetype({ priority: 'adherence' })
    expect(result.name).toBe('L’Aventurier')
    expect(result.tagline).toContain('Hors des sentiers')
    expect(result.scores.adv).toBe(94)
  })

  it('utilise l’archetype par défaut quand la priorité est absente', () => {
    // Vérifie que l'absence de priorité renvoie l'archetype Performeur par défaut.
    const result = deriveArchetype({})
    expect(result.name).toBe('Le Performeur')
    expect(result.scores.perf).toBe(92)
  })
})

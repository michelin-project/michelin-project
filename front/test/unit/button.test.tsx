import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'

import { Button } from '../../src/components/ui/button'

// Tests unitaires pour le composant réutilisable Button.
describe('Button component (unit)', () => {
  it('affiche les enfants et appelle la fonction onClick', async () => {
    // Le Button doit afficher ses enfants et transmettre l'événement de clic.
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Button onClick={handle}>Click me</Button>)

    const btn = screen.getByRole('button', { name: /click me/i })
    await user.click(btn)
    expect(handle).toHaveBeenCalled()
  })
})

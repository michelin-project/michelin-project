import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import { App } from '../../src/routes/index'

// Tests d'intégration fonctionnels pour le flux principal de l'application.
// Ces tests simulent la navigation utilisateur dans l'expérience Michelin.
describe('Front route App (functional)', () => {
  it('navigue de l’accueil au quiz et passe à la deuxième étape', async () => {
    // Simule le lancement du quiz depuis l'écran d'accueil et vérifie que la deuxième question apparaît.
    const user = userEvent.setup()
    render(<App />)

    const startButton = screen.getByRole('button', { name: /commencer l’analyse/i })
    await user.click(startButton)
    expect(screen.getByRole('heading', { name: /Quel est votre vélo/i })).toBeInTheDocument()

    const routeOption = screen.getByRole('button', { name: /route/i })
    await user.click(routeOption)
    expect(await screen.findByRole('heading', { name: /Votre priorité/i })).toBeInTheDocument()
  })

  it('ouvre le panneau de connexion et revient à l’accueil en cliquant sur retour', async () => {
    // Vérifie que l'écran de connexion s'ouvre et que le bouton retour ramène à l'accueil.
    const user = userEvent.setup()
    render(<App />)

    const loginButton = screen.getByRole('button', { name: /se connecter/i })
    await user.click(loginButton)
    expect(screen.getByRole('heading', { name: /Connexion/i })).toBeInTheDocument()

    const backButton = screen.getByRole('button', { name: /retour/i })
    await user.click(backButton)
    expect(screen.getByRole('button', { name: /commencer l’analyse/i })).toBeInTheDocument()
  })

  it('termine le quiz et affiche la page de résultat Ride DNA', async () => {
    // Parcourt toutes les étapes du quiz et vérifie l'affichage de la page de résultats Ride DNA.
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /commencer l’analyse/i }))
    await user.click(screen.getByRole('button', { name: /route/i }))
    expect(await screen.findByRole('heading', { name: /Votre priorité/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /vitesse/i }))
    expect(await screen.findByRole('heading', { name: /Kilométrage hebdo/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /50–100 km/i }))
    expect(await screen.findByRole('heading', { name: /Type de terrain/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /asphalte/i }))
    expect(await screen.findByText(/Votre Ride DNA/i)).toBeInTheDocument()
    expect(screen.getByText(/Votre profil en bref/i)).toBeInTheDocument()
  })

  it('valide le parcours utilisateur complet du quiz à la confirmation de commande', async () => {
    // Parcourt l'ensemble du parcours utilisateur : quiz, recommandation, challenge, boutique et confirmation.
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /commencer l’analyse/i }))
    await user.click(screen.getByRole('button', { name: /route/i }))
    expect(await screen.findByRole('heading', { name: /Votre priorité/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /vitesse/i }))
    expect(await screen.findByRole('heading', { name: /Kilométrage hebdo/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /50–100 km/i }))
    expect(await screen.findByRole('heading', { name: /Type de terrain/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /asphalte/i }))
    expect(await screen.findByText(/Votre Ride DNA/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Voir mon pneu Michelin/i }))
    expect(await screen.findByText(/Recommandation/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Rejoindre le challenge/i }))
    expect(await screen.findByText(/Challenge du mois/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Connecter/i }))
    expect(await screen.findByText(/Compte lié — prêt à rouler/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Rejoindre le challenge/i }))
    expect(await screen.findByText(/Bonne cadence/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Classement/i }))
    expect(await screen.findByRole('heading', { name: /Classement/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Retour/i }))
    expect(await screen.findByText(/Challenge 200 km/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Simuler 200 km atteints/i }))
    expect(await screen.findByText(/Récompense débloquée/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Voir mon offre/i }))
    expect(await screen.findByRole('heading', { name: /Acheter en 1 clic/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Acheter maintenant/i }))
    expect(await screen.findByText(/Commande confirmée/i)).toBeInTheDocument()
    expect(screen.getByText(/À vous la route/i)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import { App } from '../../src/routes/index'

// Tests d'intégration fonctionnels pour le flux principal de l'application.
// Ces tests simulent la navigation utilisateur dans l'expérience Michelin.

describe('Front route App (functional)', () => {
  async function startQuiz(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /commencer l’analyse/i }))
    expect(await screen.findByRole('heading', { name: /Quel est votre vélo/i })).toBeInTheDocument()
  }

  async function answerQuizStep(user: ReturnType<typeof userEvent.setup>, label: RegExp, nextHeading: RegExp) {
    await user.click(screen.getByRole('button', { name: label }))
    expect(await screen.findByRole('heading', { name: nextHeading })).toBeInTheDocument()
  }

  async function skipLogin(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /continuer sans compte/i }))
  }

  it('navigue de l’accueil au quiz et passe à la deuxième étape', async () => {
    // Simule le lancement du quiz depuis l'écran d'accueil et vérifie que la deuxième question apparaît.
    const user = userEvent.setup()
    render(<App />)

    await startQuiz(user)
    await answerQuizStep(user, /route/i, /Votre priorité/i)
  })

  it('ouvre le panneau de connexion et revient à l’accueil en cliquant sur retour', async () => {
    // Vérifie que l'écran de connexion s'ouvre et que le bouton retour ramène à l'accueil.
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /se connecter/i }))
    expect(screen.getByRole('heading', { name: /Connexion/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /retour/i }))
    expect(await screen.findByRole('button', { name: /commencer l’analyse/i })).toBeInTheDocument()
  })

  it('termine le quiz et affiche la page de résultat Ride DNA', async () => {
    // Parcourt toutes les étapes du quiz et vérifie l'affichage de la page de résultats Ride DNA.
    const user = userEvent.setup()
    render(<App />)

    await startQuiz(user)
    await answerQuizStep(user, /route/i, /Votre priorité/i)
    await answerQuizStep(user, /vitesse/i, /Kilométrage hebdo/i)
    await answerQuizStep(user, /50–100 km/i, /Type de terrain/i)
    await user.click(screen.getByRole('button', { name: /asphalte/i }))
    expect(await screen.findByRole('heading', { name: /Connexion/i })).toBeInTheDocument()

    await skipLogin(user)

    expect(await screen.findByText(/Votre Ride DNA/i)).toBeInTheDocument()
    expect(screen.getByText(/Votre profil en bref/i)).toBeInTheDocument()
  })

  it('valide le parcours utilisateur complet du quiz à la confirmation de commande', async () => {
    // Parcourt l'ensemble du parcours utilisateur : quiz, recommandation, challenge, boutique et confirmation.
    const user = userEvent.setup()
    render(<App />)

    await startQuiz(user)
    await answerQuizStep(user, /route/i, /Votre priorité/i)
    await answerQuizStep(user, /vitesse/i, /Kilométrage hebdo/i)
    await answerQuizStep(user, /50–100 km/i, /Type de terrain/i)
    await user.click(screen.getByRole('button', { name: /asphalte/i }))
    expect(await screen.findByRole('heading', { name: /Connexion/i })).toBeInTheDocument()

    await skipLogin(user)
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

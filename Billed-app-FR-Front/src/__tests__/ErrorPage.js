/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import ErrorPage from "../views/ErrorPage.js"

describe('Given I am connected on app (as an Employee or an HR admin)', () => {//Étant donné que je suis connecté sur l'application (en tant qu'employé ou administrateur RH)
  describe('When ErrorPage is called without and error in its signature', () => {//Lorsque ErrorPage est appelé sans erreur dans sa signature
    test(('Then, it should render ErrorPage with no error message'), () => {//Ensuite, il devrait rendre ErrorPage sans message d'erreur
      const html = ErrorPage()
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
      expect(screen.getByTestId('error-message').innerHTML.trim().length).toBe(0)
    })
  })
  describe('When ErrorPage is called with error message in its signature', () => {//Lorsque ErrorPage est appelé avec un message d'erreur dans sa signature
    test(('Then, it should render ErrorPage with its error message'), () => {//Ensuite, il devrait rendre ErrorPage avec son message d'erreur
      const error = 'Erreur de connexion internet'
      const html = ErrorPage(error)
      document.body.innerHTML = html
      expect(screen.getAllByText(error)).toBeTruthy()
    })
  })
})

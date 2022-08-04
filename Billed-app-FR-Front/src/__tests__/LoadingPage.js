/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import LoadingPage from "../views/LoadingPage.js"

describe('Given I am connected on app (as an Employee or an HR admin)', () => {//Étant donné que je suis connecté sur l'application (en tant qu'employé ou administrateur RH)
  describe('When LoadingPage is called', () => {//Lorsque LoadingPage est appelée
    test(('Then, it should render Loading...'), () => {//Ensuite, il devrait rendre Loading
      const html = LoadingPage()
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
})

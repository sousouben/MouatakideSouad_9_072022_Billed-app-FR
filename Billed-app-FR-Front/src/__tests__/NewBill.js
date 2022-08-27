/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

//gestion page employée
describe("Given I am connected as an employee", () => {//Étant donné que je suis connecté en tant qu'employé
  describe("When I am on NewBill Page", () => {//Quand je suis sur la page NewBill
    test("Then the newbill stay on screen", () => {//Puis la nouvelle note de frais reste à l'écran
      //nouvelle note de frais
      const html = NewBillUI()
      document.body.innerHTML = html

      //je ne remplis pas les champs date, TTC et fichier joint
      const date = screen.getByTestId("datepicker"); //Champ de la date
      expect(date.value).toBe("");

      const tTc = screen.getByTestId("amount"); //Champ du TTC
      expect(tTc.value).toBe(""); 

      const fichierJ = screen.getByTestId("file") //Champ du fichier Joint
      expect(fichierJ.value).toBe("")

      const formNewBill = screen.getByTestId("form-new-bill")//je cible le formulaire de la nouvelle note de frais
      expect(formNewBill).toBeTruthy()//le formulaire vide apparait correctement
      
      const getNewBill = jest.fn((e) => e.preventDefault())//creat de fonction pour stopper l'action par défaut
      formNewBill.addEventListener("submit", getNewBill)//ecoute d'évènement
      fireEvent.submit(formNewBill)//simulation de l'évènement
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()//après l'évènement le formulaire reste à l'écran
    })
  })
});

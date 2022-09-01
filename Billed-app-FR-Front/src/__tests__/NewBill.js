/**
 * @jest-environment jsdom
 */

 import "@testing-library/jest-dom"
import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES } from '../constants/routes'
import mockStore from "../__mocks__/store.js"

window.alert = jest.fn()
jest.mock("../app/Store", () => mockStore)

//gestion page employée
describe("Given I am connected as an employee", () => {//Étant donné que je suis connecté en tant qu'employé
  Object.defineProperty(window, 'localStorage', { value: localStorageMock 
  })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
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
      
      const sendNewBill = jest.fn((e) => e.preventDefault())//creation de fonction pour stopper l'action par défaut
      formNewBill.addEventListener("submit", sendNewBill)//ecoute d'évènement
      fireEvent.submit(formNewBill)//simulation de l'évènement
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()//après l'évènement le formulaire reste à l'écran
    })
  })
});

describe("When i download the attached file in the wrong format", () => {  //je telecharge le fichier dans un mauvais format
  test ("Then i stay on the newbill and a message appears", () => {//Alors je reste sur la newbill et un message apparait
    
    const html = NewBillUI()          
    document.body.innerHTML = html
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname})
    }
    const newBill = new NewBill({ 
      document,
      onNavigate,
      store: null,
      localStorage: window, localStorage,
    })
    const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))
    const fichier = screen.getByTestId("file")
    const testFormat = new File(["c'est un test"],"document.txt", {
    type: "document/txt"
    })
    fichier.addEventListener("change", LoadFile)
    fireEvent.change(fichier, {target: {files: [testFormat]}})
    
    expect(LoadFile).toHaveBeenCalled()
    expect(window.alert).toBeTruthy()
  })
});

describe("When i download the attached file in the correct format ", () => {//lorsque je telecharge le fichier joint dans le bon format
  test ("Then the newbill is sent", () => {//mon champ est validé et ma NewBill est envoyé
    
    //je suis sur une nouvelle note de frais
      //j'integre le formulaire et le chemin d'accès
    const html = NewBillUI()         
    document.body.innerHTML = html
    const onNavigate = (pathname) => {  
      document.body.innerHTML = ROUTES({ pathname})
    }
    const newBill = new NewBill({ //je crée une nouvelle instance newbill
      document,
      onNavigate,
      store: mockStore,
      localStorage: window, localStorage,
    })
    //création constante pour fonction qui appel la fonction a tester
    const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))//chargement du fichier
    
    const fichier = screen.getByTestId("file")//cible le champ fichier
    const testFormat = new File(["c'est un test"],  "test.jpg", {//condition du test
      type: "image/jpg"
    })
    fichier.addEventListener("change", LoadFile)//écoute évènement
    fireEvent.change(fichier, {target: {files: [testFormat]}})//évènement au change en relation avec la condition du test
    
    expect(LoadFile).toHaveBeenCalled()//je vérifie que le fichier est bien chargé
    expect(fichier.files[0]).toStrictEqual(testFormat)//je vérifie que le fichier téléchargé est bien conforme à la condition du test

    const formNewBill = screen.getByTestId('form-new-bill')//cible le formulaire
    expect(formNewBill).toBeTruthy()

    const sendNewBill = jest.fn((e) => newBill.handleSubmit(e))//simule la fonction
    formNewBill.addEventListener('submit', sendNewBill)//évènement au submit
    fireEvent.submit(formNewBill)//simule l'évènement
    expect(sendNewBill).toHaveBeenCalled()
    expect(screen.getByText('Mes notes de frais')).toBeTruthy()//lorsqu'on créer une nouvelle note de frais on verifie s'il est bien redirigé vers la page d'accueil
  })
});

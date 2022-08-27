/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import {  ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

//test sur la page employée des factures

describe("Given I am connected as an employee", () => {
  //Étant donné que je suis connecté en tant qu'employé
  describe("When I am on Bills Page", () => {
    //Quand je suis sur la page Bills(factures)
    test("Then bill icon in vertical layout should be highlighted", async () => {
      //Ensuite, l'icône de la facture dans la disposition verticale doit être mise en surbrillance

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      //Ajout de la mention expect
      expect(windowIcon.classList.contains("active-icon")).toBe(true); // dois etre true et non false
    });

    test("Then bills should be ordered from earliest to latest", () => {
      //Ensuite, les factures doivent être commandées du plus ancien au plus tard
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      //[Bug report] - Bills
      const antiChrono = (a, b) => a - b;
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

  });
});
//test handleClickIconEye ligne 14 containers/Bills.js

describe("When I click on first eye icon", () => {//Lorsque je clique sur l'icône du premier œil
  test("Then modal should open", () => {//Ensuite, la modale devrait s'ouvrir
    Object.defineProperty(window, localStorage, { value: localStorageMock });//renvoie l'objet modifié
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    const billsContainer = new Bills({
      document,
      onNavigate,
      localStorage: localStorageMock,
      store: null,
    });

    //MOCK de la modale
    $.fn.modal = jest.fn();

    //MOCK L'ICÔNE DE CLIC
    const handleClickIconEye = jest.fn(() => {
      billsContainer.handleClickIconEye;
    });
    const firstEyeIcon = screen.getAllByTestId("icon-eye")[0];
    firstEyeIcon.addEventListener("click", handleClickIconEye);
    fireEvent.click(firstEyeIcon);
    expect(handleClickIconEye).toHaveBeenCalled();//assurer qu'une fonction simulée a été appelée avec des arguments spécifiques
    expect($.fn.modal).toHaveBeenCalled();
  });
});

// test naviagtion ligne 21 containers/Bills.js
describe("When i click the button 'Nouvelle note de frais'", () => {//je clique sur le bouton nouvelle note de frais
  test("Then newbill appears", () => { // Vérifie qu'on arrive bien sur la page NewBill
    //J'intègre le chemin d'accès
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const billsPage = new Bills({
      document,
      onNavigate,
      store: null,
      bills: bills,
      localStorage: window.localStorage
    })
    //création constante pour la fonction qui appel la fonction a tester
    const OpenNewBill = jest.fn(billsPage.handleClickNewBill);
    const btnNewBill = screen.getByTestId("btn-new-bill")//cible le btn nouvelle note de frais
    btnNewBill.addEventListener("click", OpenNewBill)//écoute évènement
    fireEvent.click(btnNewBill)//simule évènement au click
    // on vérifie que la fonction est appelée et que la page souhaitée s'affiche
    expect(OpenNewBill).toHaveBeenCalled()//je m'attends à ce que la page nouvelle note de frais se charge
    expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()//la nouvelle note de frais apparait avec entête envoyer une note de frais
  })
})

// test const bills ligne 37-57 containers/Bills.js
describe("When I get bills", () => {//Quand je reçois des factures
  test("Then it should render bills", async () => {//Ensuite, il devrait rendre les factures
    const bills = new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    const getBills = jest.fn(() => bills.getBills());
    const value = await getBills();
    expect(getBills).toHaveBeenCalled();
    expect(value.length).toBe(4);
  });
});



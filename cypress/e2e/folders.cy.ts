// // import "../../src/test-utils";
// import * as foldersApi from "../../src/services/foldersApi";

// describe("Добавление папки", () => {
//     beforeEach(() => {
//         cy.clearLocalStorage();
//         indexedDB.deleteDatabase("firebaseLocalStorageDb");

//         cy.intercept(
//             "POST",
//             "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*",
//             { fixture: "user.json" }
//         ).as("firebaseLogin");

//         cy.intercept("POST", "https://identitytoolkit.googleapis.com/v1/accounts:lookup*", {
//             fixture: "userLookup.json",
//         }).as("firebaseLookup");

//         cy.stub(foldersApi, "useAddFolderMutation").returns([
//             async ({ name }) => ({ id: "123", name, userId: "test-user-id" }),
//             { isLoading: false, isError: false },
//         ]);
//     });

//     it("логинится и добавляет папку", () => {
//         cy.visit("/");
//         cy.contains("Войти").click();
//         cy.contains("Уже есть аккаунт? Войти").click();
//         cy.get("input[type=email]").type("test@albumteka.com");
//         cy.get("input[type=password]").type("123456");
//         cy.get("button[type=submit]").click();
//         cy.wait("@firebaseLogin");
//         cy.wait("@firebaseLookup");
//         cy.contains("Добавить папку").should("exist");
//         cy.contains("Добавить папку").click();
//         cy.contains("Новая папка").should("exist");
//         cy.get("form input").type("Моя тестовая папка");

//         cy.get("form button[type=submit]").contains("Создать").click();

//         cy.contains("Моя тестовая папка").should("exist");
//     });
// });

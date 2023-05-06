/// <reference types="cypress" />
/* 
// Cypress'e hoş geldiniz!
//
// Bu özellik dosyası, Cypress'te test yazmanın gücünü göstermek için 
tasarlanmış bir yapılacaklar listesi uygulaması için çeşitli örnek testler içerir.
// Cypress'in nasıl çalıştığı ve onu bu kadar harika bir test aracı yapan şeyin 
ne olduğu hakkında daha fazla bilgi edinmek için lütfen başlangıç kılavuzumuzu okuyun: 
https://on.cypress.io/introduction-to-cypress
*/


describe('example to-do app', () => {
  beforeEach(() => {
    /*
    // Cypress her test için boş bir sayfa ile başlar, bu yüzden ona 
    "cy.visit()" komutuyla web sitemizi ziyaret etmesini söylemeliyiz. 
    Tüm testlerimizin başında aynı URL'yi ziyaret etmek istediğimiz için, 
    her testten önce çalışması için bunu beforeEach işlevimize dahil ediyoruz.
    */
    cy.visit('https://example.cypress.io/todo')
  })

  it('displays two todo items by default', () => {
    /*
    // Seçiciyle eşleşen tüm öğeleri almak için "cy.get()" komutunu kullanıyoruz.
    // Ardından, iki varsayılan öğe olan eşleşen iki öğe olduğunu assert etmek için 
     "should" ifadesini kullanırız.
    */
    cy.get('.todo-list li').should('have.length', 2)

    /*
    Daha da ileri gidebilir ve varsayılan yapılacak işlerin her birinin 
    doğru metni içerip içermediğini kontrol edebiliriz. 
    Yalnızca ilk ve son eşleşen öğeleri ayrı ayrı almak için 
    "ilk" ve "son" işlevlerini kullanırız ve ardından 
    "should" ile bir onaylama gerçekleştiririz.
    */
    cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')
    cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
  })

  it('can add new todo items', () => {
    // Öğe metnimizi yeniden kullanabilmek için bir değişkende saklayacağız
    const newItem = 'Feed the cat'

    /*
    Giriş öğesini alalım ve yeni liste öğemizi girmek için "type" komutunu 
    kullanalım. 
    Öğemizin içeriğini yazdıktan sonra, girişi göndermek için 
    enter tuşunu da yazmamız gerekiyor. Bu girdinin bir veri testi özelliği vardır, 
    bu nedenle öğeyi en iyi uygulamalara göre seçmek için bunu kullanacağız:
    https://on.cypress.io/selecting-elements
    */
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

    /*
    // Artık yeni öğemizi yazdığımıza göre, gerçekten listeye eklenip eklenmediğini kontrol edelim.
     // En yeni öğe olduğu için listedeki son öğe olarak bulunmalıdır.
     // Ek olarak, iki varsayılan öğe ile listede toplam 3 öğemiz olmalıdır.
     // İddialar iddia edilen öğeyi verdiğinden, bu assertionları her ikisini de 
     tek bir ifadede bağlayabiliriz.
    */
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('can check off an item as completed', () => {
    // In addition to using the `get` command to get an element by selector,
    // we can also use the `contains` command to get an element by its contents.
    // However, this will yield the <label>, which is lowest-level element that contains the text.
    // In order to check the item, we'll find the <input> element for this <label>
    // by traversing up the dom to the parent element. From there, we can `find`
    // the child checkbox <input> element and use the `check` command to check it.
    cy.contains('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()

    // Now that we've checked the button, we can go ahead and make sure
    // that the list element is now marked as completed.
    // Again we'll use `contains` to find the <label> element and then use the `parents` command
    // to traverse multiple levels up the dom until we find the corresponding <li> element.
    // Once we get that element, we can assert that it has the completed class.
    cy.contains('Pay electric bill')
      .parents('li')
      .should('have.class', 'completed')
  })

  context('with a checked task', () => {
    beforeEach(() => {
      // We'll take the command we used above to check off an element
      // Since we want to perform multiple tests that start with checking
      // one element, we put it in the beforeEach hook
      // so that it runs at the start of every test.
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('can filter for uncompleted tasks', () => {
      // We'll click on the "active" button in order to
      // display only incomplete items
      cy.contains('Active').click()

      // After filtering, we can assert that there is only the one
      // incomplete item in the list.
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Walk the dog')

      // For good measure, let's also assert that the task we checked off
      // does not exist on the page.
      cy.contains('Pay electric bill').should('not.exist')
    })

    it('can filter for completed tasks', () => {
      // We can perform similar steps as the test above to ensure
      // that only completed tasks are shown
      cy.contains('Completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')

      cy.contains('Walk the dog').should('not.exist')
    })

    it('can delete all completed tasks', () => {
      // First, let's click the "Clear completed" button
      // `contains` is actually serving two purposes here.
      // First, it's ensuring that the button exists within the dom.
      // This button only appears when at least one task is checked
      // so this command is implicitly verifying that it does exist.
      // Second, it selects the button so we can click it.
      cy.contains('Clear completed').click()

      // Then we can make sure that there is only one element
      // in the list and our element does not exist
      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pay electric bill')

      // Finally, make sure that the clear button no longer exists.
      cy.contains('Clear completed').should('not.exist')
    })
  })
})

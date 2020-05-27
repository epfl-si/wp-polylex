import assert from "assert";
import { Lexes, Subcategories } from "../../collections";
import { insertLex, updateLex, removeLex } from "../lexes";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { createUser } from "../../../../tests/helpers";
import { insertCategory } from "../categories";
import { insertSubcategory } from "../subcategories";
import { insertResponsible } from "../responsibles";
import { loadFixtures } from "../../../../server/fixtures";

function createCategory(userId) {
  const context = { userId };
  const args = {
    nameFr: "Super nouvelle catégorie",
    nameEn: "Super new category",
  };
  categoryId = insertCategory._execute(context, args);
  return categoryId;
}

function createSubcategory(userId, args) {
  const context = { userId };
  subcategoryId = insertSubcategory._execute(context, args);
  return subcategoryId;
}

function createResponsible(userId) {
  const context = { userId };
  const args = {
    firstName: "Roger",
    lastName: "Sadeghi",
    urlFr: "https://people.epfl.ch/hr.sadeghi",
    urlEn: "https://people.epfl.ch/hr.sadeghi",
  };
  responsibleId = insertResponsible._execute(context, args);
  return responsibleId;
}

if (Meteor.isServer) {
  describe("meteor methods lex", function () {
    before(function () {
      resetDatabase();
      loadFixtures();
    });

    it("insert lex", () => {
      let userId = createUser();

      let categoryId = createCategory(userId);
      let subcategoryId1 = createSubcategory(userId, {
        nameFr: "Belle sous-catégorie",
        nameEn: "Nice subcategory",
      });
      let subcategoryId2 = createSubcategory(userId, {
        nameFr: "Super nouvelle sous-catégorie",
        nameEn: "Super new subcategory",
      });

      let subcategories = [
        Subcategories.findOne({ _id: subcategoryId1 }),
        Subcategories.findOne({ _id: subcategoryId2 }),
      ];
      let responsibleId = createResponsible(userId);

      let frTitle =
        "Ordonnance sur l'organisation de l'Ecole polytechnique fédérale de Lausanne";
      let enTitle =
        "Ordinance on the Organisation of the Ecole polytechnique fédérale de Lausanne";

      // Set up method arguments and context
      const context = { userId };
      const args = {
        lex: "1.1.1",
        titleFr: frTitle,
        titleEn: enTitle,
        urlFr:
          "https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/1.1.1_o_organisation_EPFL_fr.pdf",
        urlEn:
          "https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/1.1.1_o_organisation_EPFL_an.pdf",
        jsonDescriptionFr:
          '{"blocks":[{"key":"2t3dg","text":"Cette ordonnance définit la structure de l’Ecole polytechnique fédérale de Lausanne (EPFL), l’organisation et les compétences décisionnelles de sa Direction, de ses facultés, de ses collèges et de ses organes centraux. Pour une vue synoptique du périmètre de l’EPFL, cliquez ici.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":275,"length":3,"key":0}],"data":{}},{"key":"6kf15","text":"Toute modification de la structure organisationnelle de l’EPFL fait l’objet d’une décision de la Direction de l’EPFL. Vous trouverez tous les renseignements concernant l’accréditation et la gestion des unités sur ce site.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":25,"length":27,"key":1},{"offset":213,"length":7,"key":2}],"data":{}},{"key":"887v9","text":"- Annexe 1: Schéma organisationnel EPFL","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":12,"length":27,"key":3}],"data":{}},{"key":"79nl5","text":"- Annexe 2: Centres","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":12,"length":7,"key":4}],"data":{}},{"key":"fqbqi","text":"Description des processus pour les prises de décision de la Direction de l’EPFL:","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"67ber","text":"Processus détaillés (pdf)\nDiagramme et descriptifs Visio (pdf)\nL’utilisation du logo de l’EPFL  doit suivre les règles définies par Mediacom. Il inclut impérativement le sigle et la dénomination en toutes lettres, placée en dessous de celui-ci. Ces deux éléments sont indissociables. A l’exception d’unités ou de projets qui découlent de partenariats externes, le logo de l’EPFL est le seul logo officiel au sein de l’institution. On ne peut lui adjoindre un autre logo spécifique à une unité.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":19,"key":5},{"offset":26,"length":30,"key":6},{"offset":80,"length":14,"key":7},{"offset":132,"length":8,"key":8}],"data":{}}],"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexe0_.pdf"}},"1":{"type":"LINK","mutability":"MUTABLE","data":{"url":"http://www.epfl.ch/organigrammes/displayunit.do?acronym=EPFL&lang=fr"}},"2":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://unites.epfl.ch"}},"3":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexe1.pdf"}},"4":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexe2.pdf)"}},"5":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/1.1.1_Processus_Decision_Direction_EPFL.pdf"}},"6":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/1.1.1_Processus_decision_Direction_EPFL_visio.pdf"}},"7":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/campus/services/communication/identite-visuelle/logo"}},"8":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://mediacom.epfl.ch"}}}}',
        jsonDescriptionEn:
          '{"blocks":[{"key":"c5lkm","text":"This ordinance defines the structure of the Ecole polytechnique fédérale de Lausanne (EPFL), the organisation and decision-making powers of its Direction, Schools, Colleges and central services. For a synoptic view of the EPFL perimeter, click here.\nAny changes in the organisational structure of EPFL  are subject to a decision made by the EPFL Direction. You will find all the information concerning the accreditation and management of the units on this site.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":244,"length":4,"key":0},{"offset":269,"length":32,"key":1},{"offset":448,"length":12,"key":2}],"data":{}},{"key":"1d96f","text":"Annex 1: EPFL organization","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":9,"length":17,"key":3}],"data":{}},{"key":"f7iii","text":"Annex 2: Centers","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":9,"length":7,"key":4}],"data":{}},{"key":"egmfs","text":"Description of the process for decision-making by EPFL Direction:","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"dh2a7","text":"Detailed process (pdf)\nDescriptive Visio charts (pdf)\nUse of the EPFL logo must comply with the rules defined by Mediacom. It must include the acronym and the designation in full, placed underneath the latter. These two elements are indissociable. With the exception of units or projects resulting from external partnerships, the EPFL logo is the institution’s only official logo. No other logo, specific to a particular unit, can be used in conjunction with it.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":16,"key":5},{"offset":23,"length":24,"key":6},{"offset":113,"length":8,"key":7},{"offset":326,"length":13,"key":8}],"data":{}}],"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexe0_.pdf"}},"1":{"type":"LINK","mutability":"MUTABLE","data":{"url":"http://www.epfl.ch/organigrammes/displayunit.do?acronym=EPFL&lang=en"}},"2":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://unites.epfl.ch"}},"3":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexe1_EN.pdf"}},"4":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexe2_EN.pdf"}},"5":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexeprocessus1_EN.pdf"}},"6":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/overview/wp-content/uploads/2019/09/LEX-1.1.1_annexeprocessus2_EN.pdf"}},"7":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/about/news-and-media"}},"8":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://www.epfl.ch/campus/services/en/communication-en/visual-identity/logotype"}}}}',
        effectiveDate: "2004-03-01",
        revisionDate: "2019-04-11",
        categoryId: categoryId,
        subcategories: subcategories,
        responsibleId: responsibleId,
      };

      insertLex._execute(context, args);

      let nb = Lexes.find({}).count();
      let lex = Lexes.findOne({
        lex: "1.1.1",
      });

      assert.strictEqual(nb, 1);
      assert.strictEqual(lex.lex, "1.1.1");
      assert.strictEqual(lex.titleFr, frTitle);
      assert.strictEqual(lex.titleEn, enTitle);
    });

    it("update lex", () => {
      let userId = createUser();

      let lex = Lexes.findOne({
        lex: "1.1.1",
      });

      // Set up method arguments and context
      const context = { userId };
      const args = {
        _id: lex._id,
        lex: "1.1.2",
        titleFr: lex.titleFr,
        titleEn: lex.titleEn,
        urlFr: lex.urlFr,
        urlEn: lex.urlEn,
        jsonDescriptionFr: "",
        jsonDescriptionEn: "",
        effectiveDate: lex.effectiveDate,
        revisionDate: lex.revisionDate,
        categoryId: lex.categoryId,
        responsibleId: lex.responsibleId,
        subcategories: lex.subcategories
      };

      updateLex._execute(context, args);

      let nb = Lexes.find({}).count();
      let lexeAfterUpdate = Lexes.findOne({
        _id: lex._id,
      });

      assert.strictEqual(nb, 1);
      assert.strictEqual(lexeAfterUpdate.lex, "1.1.2");
    });

    it("remove lex", () => {
      let userId = createUser();
      let lex = Lexes.findOne({
        lex: "1.1.2",
      });

      const context = { userId };
      const args = {
        lexId: lex._id,
      };

      let nbBefore = Lexes.find({}).count();
      assert.strictEqual(nbBefore, 1);

      removeLex._execute(context, args);

      let nbAfter = Lexes.find({}).count();
      assert.strictEqual(nbAfter, 0);
    });
  });
}

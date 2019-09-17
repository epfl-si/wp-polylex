import { Categories, Subcategories, Responsibles, Lexes } from '../imports/api/collections';

importData = () => {

    if (Categories.find({}).count() == 0) {
        console.log("Import categories");
        importCategories();
    } else {
        console.log("Categories already exist");
    }

    if (Subcategories.find({}).count() == 0) {
        console.log("Import subcategories");
        importSubcategories();
    } else {
        console.log("Subcategories already exist");
    }

    if (Responsibles.find({}).count() == 0) {
        console.log("Import responsibles");
        importResponsibles();
    } else {
        console.log("Responsibles already exist");
    }
    
    if (Lexes.find({}).count() == 0) {
        console.log("Import lexes");
        importLexes();
    } else {
        console.log("Lexes already exist");
    }

    //importResponsiblesInLexes();
    
}

importResponsiblesInLexes = () => {
    const path = 'lexes-responsibles.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
        delimiter: ",",
        header: true,
        complete: function(results) {
        let data = JSON.parse(JSON.stringify(results.data));
        data.forEach(line => {
            let lex = Lexes.findOne({lex: line.lex});        
            let responsibles = Responsibles.find(
                { 
                    "lastName": line.lastName.toLowerCase(),
                    "firstName": line.firstName.toLowerCase()
                }
            ).fetch();
            Lexes.update(
                {_id: lex._id}, 
                { $set: {responsibles: responsibles} }
            );
            
        });
        console.log("Update Lexes to add responsibles - finished");
        }    
    });
}

importLexes = () => {

    const path = 'polylex-20190913-0900.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
        delimiter: ";",
        header: true,
        complete: function(results) {
        let data = JSON.parse(JSON.stringify(results.data));
        data.forEach(lex => {

            console.log(`Lex: ${lex.lex}`);

            let categoryId;
            let category = Categories.find({nameFr: lex.categoryName}).fetch();
            if (category.length == 1) {
                categoryId = category[0]["_id"];
            }

            let subcategoryId;
            let subcategory = Subcategories.find({nameFr: lex.subcategoryName}).fetch();
            if (subcategory.length == 1) {
                subcategoryId = subcategory[0]["_id"];
            }

            let firstName;
            let lastName;
            let elements = lex.resp.split(" ");
            if (elements.length == 2){
                firstName = elements[0];
                lastName = elements[1];
            } else {
                if (elements[0]=='Jan.' && elements[1]=='S.' && elements[2]=='Hesthaven') {
                    firstName = 'Jan. S.';
                    lastName = 'Hesthaven';
                }
                if (elements[0]=='Eric' && elements[1]=='Du' && elements[2]=='Pasquier') {
                    firstName = 'Eric';
                    lastName = 'Du Pasquier';
                }
            }
            //console.log(`Firstname ID ${firstName}`);
            //console.log(`Lastname ID ${lastName}`); 

            let responsibleId;
            let responsible = Responsibles.find({firstName: firstName, lastName: lastName}).fetch();
            if (responsible.length == 1) {
                responsibleId = responsible[0]["_id"];
            } 

            //console.log(`Category ID ${categoryId}`);
            //console.log(`Subcategory ID ${subcategoryId}`);
            //console.log(`Responsible ID ${responsibleId}`);

            if (responsibleId == undefined) {
                console.error("PROB");
            }

            let elementsDate = lex.effectiveDate.split(".");
            let day = elementsDate[0];
            let month = elementsDate[1];
            let year = elementsDate[2];
            let effectiveDate = year + "-" + month + "-" + day;


            elementsDate = lex.revisionDate.split(".");
            day = elementsDate[0];
            month = elementsDate[1];
            year = elementsDate[2];
            let revisionDate = year + "-" + month + "-" + day;


            let lexDocument = {
                lex: lex.lex,
                titleFr: lex.titleFr,
                titleEn: lex.titleEn,
                urlFr: lex.urlFr,
                urlEn: lex.urlEn,
                descriptionFr: lex.descFRHTML,
                descriptionEn: lex.descENHTML,
                effectiveDate: effectiveDate,
                revisionDate: revisionDate,
                categoryId: categoryId,
                subcategoryId: subcategoryId,
                responsibleId: responsibleId
            }
            
            // Check if category already exist
            if (!Lexes.findOne({lex: lexDocument.lex})) {
                Lexes.insert(lexDocument);
            }
        });
        console.log("Importation Lexes finished");
        }    
    });

}

importResponsibles = () => {
    const path = 'responsibles.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
        delimiter: ",",
        header: true,
        complete: function(results) {
            let data = JSON.parse(JSON.stringify(results.data));
            data.forEach(responsible => {
                let responsibleDocument = {
                    lastName: responsible.lastName,
                    firstName: responsible.firstName,
                    urlFr: responsible.urlFr,
                    urlEn: responsible.urlEn,
                }   
                // Check if responsibles already exist
                if (Responsibles.find({lastName: responsible.lastName, firstName: responsibleDocument.firstName}).count() == 0) {
                    Responsibles.insert(responsibleDocument);
                }
            });
            console.log("Importation responsibles finished");
        }    
    });
}

importCategories = () => {
    const path = 'categories.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
        delimiter: ",",
        header: true,
        complete: function(results) {
        let data = JSON.parse(JSON.stringify(results.data));
        data.forEach(category => {
            let categoryDocument = {
                nameFr: category.nameFr,
                nameEn: category.nameEn,
            }
            // Check if category already exist
            if (!Categories.findOne({nameFr: categoryDocument.nameFr})) {
                Categories.insert(categoryDocument);
            }
        });
        console.log("Importation categories finished");
        }    
    });
}

importSubcategories = () => {
    const path = 'subcategories.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
    delimiter: ";",
    header: true,
    complete: function(results) {
        let data = JSON.parse(JSON.stringify(results.data));
        data.forEach(subcategory => {
        let subcategoryDocument = {
            nameFr: subcategory.nameFr,
            nameEn: subcategory.nameEn,
        }
        // Check if subcategory already exist
        if (!Subcategories.findOne({nameFr: subcategoryDocument.nameFr})) {
            Subcategories.insert(subcategoryDocument);
        }
        });
        console.log("Importation subcategories finished");
    }    
    });
}

export { importData }
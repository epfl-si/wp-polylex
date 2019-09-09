import { Categories, Subcategories, Responsibles, Lexes } from '../imports/api/collections';

importData = () => {

    if (Roles) {

    }

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

    /*
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

    importResponsiblesInLexes();
    */
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

    const path = 'lexes.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
        delimiter: ",",
        header: true,
        complete: function(results) {
        let data = JSON.parse(JSON.stringify(results.data));
        data.forEach(lex => {
            let categoryId;
            let category = Categories.find({name: lex.categoryName}).fetch();
            if (category.length == 1) {
                categoryId = category[0]["_id"];
            }

            let subcategoryId;
            let subcategory = Subcategories.find({name: lex.subcategoryName}).fetch();
            if (subcategory.length == 1) {
                subcategoryId = subcategory[0]["_id"];
            }

            console.log(categoryId);
            console.log(subcategoryId);

            let lexDocument = {
                lex: lex.lex,
                titleFr: lex.titleFr,
                titleEn: lex.titleEn,
                urlFr: lex.urlFr,
                urlEn: lex.urlEn,
                descriptionFr: lex.descriptionFr,
                descriptionEn: lex.descriptionEn,
                effectiveDate: lex.effectiveDate,
                revisionDate: lex.revisionDate,
                categoryId: categoryId,
                subcategoryId: subcategoryId,
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
                    lastName: responsible.lastName.toLowerCase(),
                    firstName: responsible.firstName.toLowerCase(),
                    urlFr: responsible.urlFr,
                    urlEn: responsible.urlEn,
                }   
                // Check if responsibles already exist
                if (Responsibles.find({lastName: responsible.lastName.toLowerCase(), firstName: responsibleDocument.firstName.toLowerCase()}).count() == 0) {
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
    delimiter: ",",
    header: true,
    complete: function(results) {
        let data = JSON.parse(JSON.stringify(results.data));
        data.forEach(subcategory => {
        let subcategoryDocument = {
            nameFr: subcategory.nameFr,
            nameEn: subcategory.nameEn,
        }
        // Check if subcategory already exist
        if (!Subcategories.findOne({name: subcategoryDocument.nameFr})) {
            Subcategories.insert(subcategoryDocument);
        }
        });
        console.log("Importation subcategories finished");
    }    
    });
}

export { importData }
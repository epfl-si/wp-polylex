import { Categories, Subcategories, Authors, Lexs } from '../imports/api/collections';

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

    if (Authors.find({}).count() == 0) {
        console.log("Import authors");
        importAuthors();
    } else {
        console.log("Authors already exist");
    }

    if (Lexs.find({}).count() == 0) {
        console.log("Import lexs");
        importLexs();
    } else {
        console.log("Lexs already exist");
    }

    importAuthorsInLexs();
}

importAuthorsInLexs = () => {
    const path = 'lexs-authors.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
        delimiter: ",",
        header: true,
        complete: function(results) {
        let data = JSON.parse(JSON.stringify(results.data));
        data.forEach(line => {
            let lex = Lexs.findOne({lex: line.lex});        
            let authors = Authors.find(
                { 
                    "lastName": line.lastName.toLowerCase(),
                    "firstName": line.firstName.toLowerCase()
                }
            ).fetch();
            Lexs.update(
                {_id: lex._id}, 
                { $set: {authors: authors} }
            );
            
        });
        console.log("Update LEXs to add authors - finished");
        }    
    });
}

importLexs = () => {

    const path = 'lexs.csv';
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

            // Todo: Récupérer les datas via le lex.
            authors = [{ 
                _id: '2sY3Go2xnxu9nopXn',
                firstName: 'grégory',
                lastName: 'charmier',
                urlFr: 'https://people.epfl.ch/gregory.charmier/?lang=fr',
                urlEn: 'https://people.epfl.ch/gregory.charmier/?lang=en' 
            }]

            let lexDocument = {
                lex: lex.lex,
                titleFr: lex.titleFr,
                titleEn: lex.titleEn,
                urlFr: lex.urlFr,
                urlEn: lex.urlEn,
                descriptionFr: lex.descriptionFr,
                descriptionEn: lex.descriptionEn,
                publicationDateFr: lex.publicationDateFr,
                publicationDateEn: lex.publicationDateEn,
                categoryId: categoryId,
                subcategoryId: subcategoryId,
            }
            
            // Check if category already exist
            if (!Lexs.findOne({lex: lexDocument.lex})) {
                Lexs.insert(lexDocument);
            }
        });
        console.log("Importation LEXs finished");
        }    
    });

}

importAuthors = () => {
    const path = 'authors.csv';
    const file = Assets.getText(path);
    Papa.parse(file, {
        delimiter: ",",
        header: true,
        complete: function(results) {
            let data = JSON.parse(JSON.stringify(results.data));
            data.forEach(author => {
                let authorDocument = {
                    lastName: author.lastName.toLowerCase(),
                    firstName: author.firstName.toLowerCase(),
                    urlFr: author.urlFr,
                    urlEn: author.urlEn,
                }   
                // Check if authors already exist
                if (Authors.find({lastName: author.lastName.toLowerCase(), firstName: author.firstName.toLowerCase()}).count() == 0) {
                    Authors.insert(authorDocument);
                }
            });
            console.log("Importation authors finished");
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
                name: category.name,
            }
            // Check if category already exist
            if (!Categories.findOne({name: categoryDocument.name})) {
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
            name: subcategory.name,
        }
        // Check if subcategory already exist
        if (!Subcategories.findOne({name: subcategoryDocument.name})) {
            Subcategories.insert(subcategoryDocument);
        }
        });
        console.log("Importation subcategories finished");
    }    
    });
}

export { importData }
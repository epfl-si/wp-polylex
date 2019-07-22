import { Categories, Subcategories } from '../imports/api/collections';

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
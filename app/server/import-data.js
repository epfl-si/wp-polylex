import { Subcategories, Lexes } from '../imports/api/collections';

convertSubcategoryIdToSubcategories = () => {

  console.log("Convert subcategoryId to subcategories is starting ...");

  let lexes = Lexes.find({}).fetch();

  lexes.forEach(lex => {

    if (!('subcategories' in lex)) {

      
      console.log("Lex before : ", lex);

      let subcategories = [];
      let subcategory = Subcategories.findOne({_id: lex.subcategoryId});

      subcategories.push(subcategory);    

      Lexes.update(
        { _id: lex._id }, 
        { $set: { 'subcategories': subcategories } },
      );

      let checkLex = Lexes.find({_id: lex._id}).fetch();
      console.log("Lex after : ", JSON.stringify(checkLex, null, 4));    
      
      }
  });

  console.log("Convert subcategoryId to subcategories is complete !");

}

importData = () => {
  convertSubcategoryIdToSubcategories();
}

export { deleteAll, importData }
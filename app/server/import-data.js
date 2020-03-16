import { Subcategories, Lexes } from '../imports/api/collections';

convertSubcategoryIdToSubcategories = () => {

  console.log("Convert subcategoryId to subcategories is starting ...");

  let lexes = Lexes.find({}).fetch();

  lexes.forEach(lex => {


      console.log("Lex before : ", lex);

      let subcategories = [];
      let subcategory = Subcategories.findOne({_id: lex.subcategoryId});

      subcategories.push(subcategory);    
      console.log(subcategories);

      Lexes.update(
        { _id: lex._id }, 
        { $set: { 'subcategories': subcategories } },
      );

      let checkLex = Lexes.find({_id: lex._id}).fetch();
      console.log("Lex after : ", checkLex);    

  });

  console.log("Convert subcategoryId to subcategories is complete !");

}

importData = () => {
  convertSubcategoryIdToSubcategories();
}

export { deleteAll, importData }
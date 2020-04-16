import { Subcategories, Lexes } from '../imports/api/collections';

deleteUserProfile = () => {

  let users = Meteor.users.find({}).fetch();
  users.forEach(user => {
    Meteor.users.update(
      { _id: user._id }, 
      { $unset: { 'profile': '' } },
    );
  });
  console.log("All profiles are deleted");
}

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

deleteSubcategoryId = () => {
  console.log("Delete Field subcategoryId for all sites ...");
  let lexes = Lexes.find({});
  let lexAfter;

  lexes.forEach(lex => {
    console.log("Before: ", lex);
    if ('subcategoryId' in lex) {
      Lexes.update(
        { _id: lex._id }, 
        { $unset: { 'subcategoryId': '' } },
      );
      lexAfter = Lexes.findOne({_id: lex._id});
    }
    console.log("After: ", lexAfter);
  });
  console.log("Finish!!");
}

importData = () => {
  deleteUserProfile();
}

export { deleteAll, importData }
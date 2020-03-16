import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { 
    Lexes, 
    lexesSchema, 
    Categories, 
    categoriesSchema, 
    Subcategories, 
    subcategoriesSchema, 
    Responsibles, 
    responsiblesSchema,
} from './collections';
import { throwMeteorError, throwMeteorErrors } from './error';
import { AppLogger } from '../../server/logger';

function trimObjValues(obj) {
  return Object.keys(obj).reduce((acc, curr) => {
    if (curr !== 'subcategories') {
      acc[curr] = obj[curr].trim()
    }
    return acc;
  }, {});
}

function prepareUpdateInsertResponsible(responsible, action) {

  // Trim all attributes of responsible
  responsible = trimObjValues(responsible);

  let responsibles = Responsibles.find({});
  let alreadyExist = false;

  // Check if reponsible already exist (case insensitive)
  for (const currentResponsible of responsibles) {
    if (currentResponsible.firstName.toLowerCase() == responsible.firstName.toLowerCase() && 
        currentResponsible.lastName.toLowerCase() == responsible.lastName.toLowerCase()) {
      if ((action == 'insert') || (action == 'update' && responsible._id != currentResponsible._id)) {
        alreadyExist = true;
        break;  
      } 
    }
  };

  if (alreadyExist) {
    throwMeteorErrors(
      ['lastName', 'firstName'], 
      'Un responsable avec les mêmes nom et prénom existe déjà !'
    );
  }
  
  return responsible;
}

function prepareUpdateInsertCategory(category, action) {

  // Trim all attributes of category
  category = trimObjValues(category);

  let categories = Categories.find({});

  // Check if nameFr category already exist (case insensitive)
  for (const currentCategory of categories) {
    if (currentCategory.nameFr.toLowerCase() == category.nameFr.toLowerCase()) {
      if ((action == 'insert') || (action == 'update' && currentCategory._id !== category._id)) {
        throwMeteorError('nameFr', 'Nom de la rubrique en Français existe déjà !');
        break;
      }
    }
  };

  // Check if nameEn category already exist (case insensitive)
  for (const currentCategory of categories) {
    if (currentCategory.nameEn.toLowerCase() == category.nameEn.toLowerCase()) {
      if ((action == 'insert') || (action == 'update' && currentCategory._id !== category._id)) {
        throwMeteorError('nameEn', 'Nom de la rubrique en Anglais existe déjà !');
        break;
      }
    }
  };

  return category;
}

function prepareUpdateInsertSubcategory(subcategory, action) {
  
  // Trim all attributes of subcategory
  subcategory = trimObjValues(subcategory);

  let subcategories = Subcategories.find({});

  // Check if nameFr subcategory already exist (case insensitive)
  for (const currentSubcategory of subcategories) {
    if (currentSubcategory.nameFr.toLowerCase() == subcategory.nameFr.toLowerCase()) {
      if ((action == 'insert') || (action == 'update' && currentSubcategory._id !== subcategory._id)) {
        throwMeteorError('nameFr', 'Nom de la sous-rubrique en Français existe déjà !');
        break;
      }
    }
  };

  // Check if nameEn subcategory already exist (case insensitive)
  for (const currentSubcategory of subcategories) {
    if (currentSubcategory.nameEn.toLowerCase() == subcategory.nameEn.toLowerCase()) {
      if ((action == 'insert') || (action == 'update' && currentSubcategory._id !== subcategory._id)) {
        throwMeteorError('nameEn', 'Nom de la sous-rubrique en Anglais existe déjà !');
        break;
      }
    }
  };
  
  return subcategory;
}

function prepareUpdateInsertLex(lex, action) {

  // Trim all attributes of lex
  lex = trimObjValues(lex);

  // Delete "/" at the end of URL 
  let urlFr = lex.urlFr;
  if (urlFr.endsWith('/')) {
      lex.urlFr = urlFr.slice(0, -1);
  }
  let urlEn = lex.urlEn;
  if (urlEn.endsWith('/')) {
      lex.urlEn = urlEn.slice(0, -1);
  }

  // Check if LEX is unique
  let lexes = Lexes.find({lex: lex.lex});
  
  if (action === 'update') {  
    if (lexes.count() > 1) {
      throwMeteorError('lex', 'Ce LEX existe déjà !');
    } else if (lexes.count() == 1) {
      if (lexes.fetch()[0]._id != lex._id) {
        throwMeteorError('lex', 'Cet LEX existe déjà !');
      }
    }
  } else if (action === 'insert' && lexes.count() > 0) {
    throwMeteorError('lex', 'Ce LEX existe déjà');
  }  

  // Check if LEX is format x.x.x or x.x.x.x
  var lexRE = /^\d+.\d+.\d+|\d+.\d+.\d+.\d+$/;
  if (!lex.lex.match(lexRE)) {
    throwMeteorError('lex', 'Le format d\'un LEX doit être x.x.x ou x.x.x.x');
  }

  // Check if responsible is empty
  if (lex.responsibleId.length == 0) {
    throwMeteorError('responsibleId', 'Vous devez sélectionner au moins 1 responsable');
  }

  return lex;
}

Meteor.methods({

    insertLex(lex){

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canInsert = Roles.userIsInRole(
            this.userId,
            ['admin', 'editor'], 
            Roles.GLOBAL_GROUP
        );

        if (! canInsert) {
            throw new Meteor.Error('unauthorized',
              'Only admins and editors can insert lexes.');
        }

        let lexDocument = {
          lex: lex.lex,
          titleFr: lex.titleFr,
          titleEn: lex.titleEn,
          urlFr: lex.urlFr,
          urlEn: lex.urlEn,
          descriptionFr: lex.jsonDescriptionFr,
          descriptionEn: lex.jsonDescriptionEn,
          effectiveDate: lex.effectiveDate,
          revisionDate: lex.revisionDate,
          categoryId: lex.categoryId,
          subcategories: lex.subcategories,
          responsibleId: lex.responsibleId,
        }

        lexesSchema.validate(lexDocument);
        lex = prepareUpdateInsertLex(lexDocument, 'insert');
        
        let newLexId = Lexes.insert(lexDocument);
        let newLex = Lexes.findOne({_id: newLexId});

        AppLogger.getLog().info(
          `Insert lex ID ${ newLexId }`, 
          { before: "", after: newLex },
          this.userId
        );

        return newLex;
    },

    updateLex(lex) {

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canUpdate = Roles.userIsInRole(
            this.userId,
            ['admin', 'editor'], 
            Roles.GLOBAL_GROUP
        );

        if (! canUpdate) {
            throw new Meteor.Error('unauthorized',
              'Only admins and editors can update lexes.');
        }

        let lexDocument = {
          _id: lex._id,
          lex: lex.lex,
          titleFr: lex.titleFr,
          titleEn: lex.titleEn,
          urlFr: lex.urlFr,
          urlEn: lex.urlEn,
          descriptionFr: lex.jsonDescriptionFr,
          descriptionEn: lex.jsonDescriptionEn,
          effectiveDate: lex.effectiveDate,
          revisionDate: lex.revisionDate,
          categoryId: lex.categoryId,
          subcategories: lex.subcategories,
          responsibleId: lex.responsibleId,
      }

        lexesSchema.validate(lexDocument);

        lex = prepareUpdateInsertLex(lexDocument, 'update');

        let lexBeforeUpdate = Lexes.findOne({ _id: lex._id});

        Lexes.update(
            {_id: lex._id}, 
            { $set: lexDocument }
        );

        let updatedLexe = Lexes.findOne({ _id: lex._id});

        AppLogger.getLog().info(
          `Update lex ID ${ lex._id }`, 
          { before: lexBeforeUpdate , after: updatedLexe }, 
          this.userId
        );
        
        return lex._id;
    },
    
    removeLex(lexId){
      if (!this.userId) {
          throw new Meteor.Error('not connected');
      }
      const canRemove = Roles.userIsInRole(
          this.userId,
          ['admin', 'editor'], 
          Roles.GLOBAL_GROUP
      );
      if (! canRemove) {
          throw new Meteor.Error('unauthorized',
            'Only admins and editors can remove lexes.');
      }

      check(lexId, String);
      
      let lex = Lexes.findOne({_id: lexId});
      Lexes.remove({_id: lexId});
      
      AppLogger.getLog().info(
        `Delete lex ID ${ lexId }`, 
        { before: lex, after: "" }, 
        this.userId
      );
    },

    insertCategory(category) {

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canInsert = Roles.userIsInRole(
            this.userId,
            ['admin', 'editor'],
            Roles.GLOBAL_GROUP
        );

        if (! canInsert) {
            throw new Meteor.Error('unauthorized',
              'Only admins can insert category.');
        }

        categoriesSchema.validate(category);

        category = prepareUpdateInsertCategory(category, 'insert');

        let categoryDocument = {
            nameFr: category.nameFr,
            nameEn: category.nameEn,
        };

        let newCategoryId = Categories.insert(categoryDocument);
        let newCategory = Categories.findOne({_id: newCategoryId});

        AppLogger.getLog().info(
          `Insert category ID ${ newCategory._id }`, 
          { before: "", after: newCategory }, 
          this.userId
        );

        return newCategoryId;

    },

    updateCategory(category) {

      if (!this.userId) {
          throw new Meteor.Error('not connected');
      }

      const canUpdate = Roles.userIsInRole(
          this.userId,
          ['admin', 'editor'],
          Roles.GLOBAL_GROUP
      );

      if (! canUpdate) {
          throw new Meteor.Error('unauthorized',
            'Only admins can update sites.');
      }

      categoriesSchema.validate(category);
      
      category = prepareUpdateInsertCategory(category, 'update');

      let categoryDocument = {
        nameFr: category.nameFr,
        nameEn: category.nameEn,
      };
      
      let categoryBeforeUpdate = Categories.findOne({ _id: category._id});

      Categories.update(
          {_id: category._id}, 
          { $set: categoryDocument }
      );

      let updatedCategory = Categories.findOne({ _id: category._id});

      AppLogger.getLog().info(
        `Update category ID ${ category._id }`, 
        { before: categoryBeforeUpdate , after: updatedCategory }, 
        this.userId
      );
    },

    removeCategory(categoryId){

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canRemove = Roles.userIsInRole(
            this.userId,
            ['admin', 'editor'], 
            Roles.GLOBAL_GROUP
        );

        if (! canRemove) {
            throw new Meteor.Error('unauthorized',
              'Only admins can remove Category.');
        }

        check(categoryId, String);

        // Check if category is used
        lexesByCategory = Lexes.find({categoryId: categoryId}).count();
        if (lexesByCategory > 0) {
          throw new Meteor.Error('Remove category', 'Cette catégorie ne peut pas être supprimée car elle est encore liée à, au moins, 1 lex.');
        }

        let category = Categories.findOne({_id: categoryId});

        Categories.remove({_id: categoryId});

        AppLogger.getLog().info(
          `Delete category ID ${ categoryId }`, 
          { before: category, after: "" }, 
          this.userId
        );
    },

    insertSubcategory(subcategory) {

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canInsert = Roles.userIsInRole(
            this.userId,
            ['admin', 'editor'], 
            Roles.GLOBAL_GROUP
        );

        if (! canInsert) {
            throw new Meteor.Error('unauthorized',
              'Only admins can insert category.');
        }

        subcategoriesSchema.validate(subcategory);

        subcategory = prepareUpdateInsertSubcategory(subcategory, 'insert');

        let subcategoryDocument = {
            nameFr: subcategory.nameFr,
            nameEn: subcategory.nameEn,
        };

        let newSubcategoryId = Subcategories.insert(subcategoryDocument);
        let newSubcategory = Subcategories.findOne({_id: newSubcategoryId});

        AppLogger.getLog().info(
          `Insert subcategory ID ${ newSubcategory._id }`, 
          { before: "", after: newSubcategory }, 
          this.userId
        );

        return newSubcategoryId;

    },

    updateSubcategory(subcategory) {

      if (!this.userId) {
          throw new Meteor.Error('not connected');
      }

      const canUpdate = Roles.userIsInRole(
          this.userId,
          ['admin', 'editor'], 
          Roles.GLOBAL_GROUP
      );

      if (! canUpdate) {
          throw new Meteor.Error('unauthorized',
            'Only admins can update sites.');
      }

      subcategoriesSchema.validate(subcategory);

      subcategory = prepareUpdateInsertSubcategory(subcategory, 'update');

      let subcategoryDocument = {
        nameFr: subcategory.nameFr,
        nameEn: subcategory.nameEn,
      };
      
      let subcategoryBeforeUpdate = Subcategories.findOne({ _id: subcategory._id});

      Subcategories.update(
        { _id: subcategory._id }, 
        { $set: subcategoryDocument }
      );

      let updatedSubcategory = Subcategories.findOne({ _id: subcategory._id});

      AppLogger.getLog().info(
        `Update subcategory ID ${ subcategory._id }`, 
        { before: subcategoryBeforeUpdate , after: updatedSubcategory }, 
        this.userId
      );
    },

    removeSubcategory(subcategoryId){

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canRemove = Roles.userIsInRole(
            this.userId,
            ['admin', 'editor'], 
            Roles.GLOBAL_GROUP
        );

        if (! canRemove) {
            throw new Meteor.Error('unauthorized',
              'Only admins can remove Category.');
        }

        check(subcategoryId, String);

        // Check if subcategory is used
        lexesBySubcategory = Lexes.find({subcategoryId: subcategoryId}).count();
        if (lexesBySubcategory > 0) {
          throw new Meteor.Error('Remove subcategory', 'Cette sous-catégorie ne peut pas être supprimée car elle est encore liée à, au moins, 1 lex.');
        }

        Lexes.find({subcategoryId: subcategoryId}, );

        let subcategory = Subcategories.findOne({_id: subcategoryId});

        Subcategories.remove({_id: subcategoryId});

        AppLogger.getLog().info(
          `Delete subcategory ID ${ subcategoryId }`, 
          { before: subcategory, after: "" }, 
          this.userId
        );
    },

    insertResponsible(responsible) {

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canInsert = Roles.userIsInRole(
            this.userId,
            ['admin', 'editor'], 
            Roles.GLOBAL_GROUP
        );

        if (! canInsert) {
            throw new Meteor.Error('unauthorized',
              'Only admins can insert category.');
        }
        
        responsiblesSchema.validate(responsible);

        responsible = prepareUpdateInsertResponsible(responsible, 'insert');

        let responsibleDocument = {
            firstName: responsible.firstName,
            lastName: responsible.lastName,
            urlFr: responsible.urlFr,
            urlEn: responsible.urlEn,
        };

        let newResponsibleId = Responsibles.insert(responsibleDocument);
        let newResponsible = Responsibles.findOne({_id: newResponsibleId});

        AppLogger.getLog().info(
          `Insert responsible ID ${ newResponsible._id }`, 
          { before: "", after: newResponsible }, 
          this.userId
        );

        return newResponsibleId;
    },

    updateResponsible(responsible) {

      if (!this.userId) {
          throw new Meteor.Error('not connected');
      }

      const canUpdate = Roles.userIsInRole(
          this.userId,
          ['admin', 'editor'], 
          Roles.GLOBAL_GROUP
      );

      if (!canUpdate) {
          throw new Meteor.Error('unauthorized',
          'You do not have the necessary rights to do this.');
      }
      
      responsiblesSchema.validate(responsible);
      
      responsible = prepareUpdateInsertResponsible(responsible, 'update');

      let responsibleDocument = {
        firstName: responsible.firstName,
        lastName: responsible.lastName,
        urlFr: responsible.urlFr,
        urlEn: responsible.urlEn,
      };
      
      let responsibleBeforeUpdate = Responsibles.findOne({ _id: responsible._id});

      Responsibles.update(
        {_id: responsible._id}, 
        { $set: responsibleDocument }
      );

      let updatedResponsible = Responsibles.findOne({ _id: responsible._id});

      AppLogger.getLog().info(
        `Update responsible ID ${ responsible._id }`, 
        { before: responsibleBeforeUpdate , after: updatedResponsible }, 
        this.userId
      );
  },

    removeResponsible(responsibleId){

      if (!this.userId) {
          throw new Meteor.Error('not connected');
      }

      const canRemove = Roles.userIsInRole(
          this.userId,
          ['admin', 'editor'], 
          Roles.GLOBAL_GROUP
      );

      if (! canRemove) {
          throw new Meteor.Error('unauthorized',
            'Only admins can remove Category.');
      }

      check(responsibleId, String);

      // Check if responsible is used
      lexesByResponsible = Lexes.find({responsibleId: responsibleId}).count();
      if (lexesByResponsible > 0) {
        throw new Meteor.Error('Remove responsible', 'Ce responsable ne peut pas être supprimé car il est encore responsable d\'au moins 1 lex.');
      }

      let responsible = Responsibles.findOne({_id: responsibleId});

      Responsibles.remove({_id: responsibleId});

      AppLogger.getLog().info(
        `Delete responsible ID ${ responsibleId }`, 
        { before: responsible, after: "" }, 
        this.userId
      );
    },

    updateRole(userId, role) {
        
        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }
        const canUpdate = Roles.userIsInRole(
            this.userId,
            ['admin'], 
            Roles.GLOBAL_GROUP
        );
        if (! canUpdate) {
            throw new Meteor.Error('unauthorized',
              'Only admins can update roles.');
        }
        
        let roleBeforeUpdate = Roles.getRolesForUser(userId);

        Roles.setUserRoles(userId, [role], Roles.GLOBAL_GROUP); 

        AppLogger.getLog().info(
          `Update role ID ${ userId }`, 
          { before: roleBeforeUpdate, after: [role] },
          userId
        );
    },
});
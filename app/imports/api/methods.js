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

function prepareUpdateInsertResponsible(responsible, action) {

  let responsibles = Responsibles.find({});
  let alreadExist = false;

  // Check if reponsible already exist (case insensitive)
  for (const currentResponsible of responsibles) {
    if (currentResponsible.firstName.toLowerCase() == responsible.firstName.toLowerCase() && 
        currentResponsible.lastName.toLowerCase() == responsible.lastName.toLowerCase()) {
      alreadExist = true;
      break;
    }
  };

  if (alreadExist) {
    throwMeteorErrors(
      ['lastName', 'firstName'], 
      'Un responsable avec les mêmes nom et prénom existe déjà !'
    );
  }
  
  return responsible;
}

function prepareUpdateInsertCategory(category, action) {
  // Check if nameFr of category already exist (case insensitive)
  if (Categories.find({nameFr:  {$regex : new RegExp(category.nameFr, "i") }}).count()>0) {
    throwMeteorError('nameFr', 'Nom de la catégorie en Français existe déjà !');
  }
  // Check if nameEn of category already exist (case insensitive)
  if (Categories.find({nameEn:  {$regex : new RegExp(category.nameEn, "i") }}).count()>0) {
    throwMeteorError('nameEn', 'Nom de la catégorie en Anglais existe déjà !');
  }
  return category;
}

function prepareUpdateInsertSubcategory(subcategory, action) {
  // Check if nameFr of subcategory already exist (case insensitive)
  if (Subcategories.find({nameFr:  {$regex : new RegExp(subcategory.nameFr, "i") }}).count()>0) {
    throwMeteorError('nameFr', 'Nom de la sous-catégorie en Français existe déjà !');
  }
  // Check if nameEn of subcategory already exist (case insensitive)
  if (Subcategories.find({nameEn:  {$regex : new RegExp(subcategory.nameEn, "i") }}).count()>0) {
    throwMeteorError('nameEn', 'Nom de la sous-catégorie en Anglais existe déjà !');
  }
  return subcategory;
}

function prepareUpdateInsertLex(lex, action) {

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
    var lexRE = /^\d.\d.\d|\d.\d.\d.\d$/;
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

        //console.log(lex);
        
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
        
        lexesSchema.validate(lex);
        lex = prepareUpdateInsertLex(lex, 'insert');
        console.log(lex);
        
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
            categoryId: lex.categoryId,
            subcategoryId: lex.subcategoryId,
            responsibleId: lex.responsibleId,
        }

        return Lexes.insert(lexDocument);
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

        lexesSchema.validate(lex);

        lex = prepareUpdateInsertLex(lex, 'update');

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
            categoryId: lex.categoryId,
            subcategoryId: lex.subcategoryId,
            responsibleId: lex.responsibleId,
        }
        
        Lexes.update(
            {_id: lex._id}, 
            { $set: lexDocument }
        );

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

        Lexes.remove({_id: lexId});
    },

    insertCategory(category) {

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canInsert = Roles.userIsInRole(
            this.userId,
            ['admin'], 
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

        return Categories.insert(categoryDocument);

    },

    updateCategory(category) {

      console.log(category);
      
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
            'Only admins can update sites.');
      }

      console.log(category);
      
      categoriesSchema.validate(category);
      
      category = prepareUpdateInsertCategory(category, 'update');

      let categoryDocument = {
        nameFr: category.nameFr,
        nameEn: category.nameEn,
      };
      
      Categories.update(
          {_id: category._id}, 
          { $set: categoryDocument }
      );
    },

    removeCategory(categoryId){

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canRemove = Roles.userIsInRole(
            this.userId,
            ['admin'], 
            Roles.GLOBAL_GROUP
        );

        if (! canRemove) {
            throw new Meteor.Error('unauthorized',
              'Only admins can remove Category.');
        }

        check(categoryId, String);

        Categories.remove({_id: categoryId});
    },

    insertSubcategory(subcategory) {

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canInsert = Roles.userIsInRole(
            this.userId,
            ['admin'], 
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

        return Subcategories.insert(subcategoryDocument);

    },

    updateSubcategory(subcategory) {

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
            'Only admins can update sites.');
      }

      subcategoriesSchema.validate(subcategory);
      
      subcategory = prepareUpdateInsertSubcategory(subcategory, 'update');

      let subcategoryDocument = {
        nameFr: subcategory.nameFr,
        nameEn: subcategory.nameEn,
      };
      
      Subcategories.update(
          {_id: subcategory._id}, 
          { $set: subcategoryDocument }
      );
    },

    removeSubcategory(subcategoryId){

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canRemove = Roles.userIsInRole(
            this.userId,
            ['admin'], 
            Roles.GLOBAL_GROUP
        );

        if (! canRemove) {
            throw new Meteor.Error('unauthorized',
              'Only admins can remove Category.');
        }

        check(subcategoryId, String);

        Subcategories.remove({_id: subcategoryId});
    },

    insertResponsible(responsible) {

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canInsert = Roles.userIsInRole(
            this.userId,
            ['admin'], 
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

        return Responsibles.insert(responsibleDocument);
    },

    updateResponsible(responsible) {

      if (!this.userId) {
          throw new Meteor.Error('not connected');
      }

      const canUpdate = Roles.userIsInRole(
          this.userId,
          ['admin'], 
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
      
      Responsibles.update(
          {_id: responsible._id}, 
          { $set: responsibleDocument }
      );
  },

    removeResponsible(responsibleId){

        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }

        const canRemove = Roles.userIsInRole(
            this.userId,
            ['admin'], 
            Roles.GLOBAL_GROUP
        );

        if (! canRemove) {
            throw new Meteor.Error('unauthorized',
              'Only admins can remove Category.');
        }

        check(responsibleId, String);

        Responsibles.remove({_id: responsibleId});
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
        Roles.setUserRoles(userId, [role], Roles.GLOBAL_GROUP); 
    },
});
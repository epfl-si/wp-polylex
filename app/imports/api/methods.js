import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { 
    Lexes, 
    lexesSchema, 
} from './collections';
import { throwMeteorError, throwMeteorErrors } from './error';
import { AppLogger } from './logger';

function trimObjValues(obj) {
  return Object.keys(obj).reduce((acc, curr) => {
    if (curr !== 'subcategories') {
      acc[curr] = obj[curr].trim()
    }
    return acc;
  }, {});
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
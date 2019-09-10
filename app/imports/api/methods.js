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

function prepareUpdateInsert(lex, action) {

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
    if (Lexes.findOne({lex: lex.lex})) {
        throwMeteorError('lex', 'Ce LEX existe déjà');
    } else {
        // Check if LEX is format x.x.x or x.x.x.x
        var lexRE = /^\d.\d.\d|\d.\d.\d.\d$/;
        if (!lex.lex.match(lexRE)) {
            throwMeteorError('lex', 'Le format d\'un LEX doit être x.x.x ou x.x.x.x');
        }
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
            ['admin'], 
            Roles.GLOBAL_GROUP
        );

        if (! canInsert) {
            throw new Meteor.Error('unauthorized',
              'Only admins can insert sites.');
        }
        
        lexesSchema.validate(lex);
        lex = prepareUpdateInsert(lex, 'insert');
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
            ['admin'], 
            Roles.GLOBAL_GROUP
        );

        if (! canUpdate) {
            throw new Meteor.Error('unauthorized',
              'Only admins can update sites.');
        }

        //console.log(lex);

        lexesSchema.validate(lex);

        lex = prepareUpdateInsert(lex, 'update');

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
            ['admin'], 
            Roles.GLOBAL_GROUP
        );

        if (! canRemove) {
            throw new Meteor.Error('unauthorized',
              'Only admins can remove sites.');
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

        // Check if name is unique
        // TODO: Move this code to SimpleSchema custom validation function
        if (Categories.find({name: category.nameFr}).count()>0) {
            throwMeteorError('name', 'Nom de la catégorie existe déjà !');
        }

        categoriesSchema.validate(category);

        let categoryDocument = {
            nameFr: category.nameFr,
            nameEn: category.nameEn,
        };

        return Categories.insert(categoryDocument);

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

        // Check if name is unique
        // TODO: Move this code to SimpleSchema custom validation function
        if (Subcategories.find({name: subcategory.nameFr}).count()>0) {
            throwMeteorError('name', 'Nom de la sous catégorie existe déjà !');
        }

        subcategoriesSchema.validate(subcategory);

        let subcategoryDocument = {
            nameFr: subcategory.nameFr,
            nameEn: subcategory.nameEn,
        };

        return Subcategories.insert(subcategoryDocument);

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
        
        // Check if name is unique
        // TODO: Move this code to SimpleSchema custom validation function
        if (Responsibles.find({lastName: responsible.lastName, firstName: responsible.firstName}).count() > 0) {
            throwMeteorErrors(['lastName', 'firstName'], 'Un responsable avec les mêmes nom et prénom existe déjà !');
        }
        
        responsiblesSchema.validate(responsible);

        console.log(responsible);

        let responsibleDocument = {
            firstName: responsible.firstName,
            lastName: responsible.lastName,
            urlFr: responsible.urlFr,
            urlEn: responsible.urlEn,
        };

        return Responsibles.insert(responsibleDocument);

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
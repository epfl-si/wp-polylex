import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { 
    Lexs, 
    lexSchema, 
    Categories, 
    categoriesSchema, 
    Subcategories, 
    subcategoriesSchema, 
    Authors, 
    authorsSchema,
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
    // todo

    // Check if authot is empty
    if (lex.authors.length == 0) {
        throwMeteorError('authors', 'Vous devez sélectionner au moins 1 auteur');
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
        
        lexSchema.validate(lex);
        lex = prepareUpdateInsert(lex, 'insert');
        let lexDocument = {
            lex: lex.lex,
            titleFr: lex.titleFr,
            titleEn: lex.titleEn,
            urlFr: lex.urlFr,
            urlEn: lex.urlEn,
            descriptionFr: lex.descriptionFr,
            descriptionEn: lex.descriptionEn,
            publicationDate: lex.publicationDate,
            categoryId: lex.categoryId,
            subcategoryId: lex.subcategoryId,
            authors: lex.authors,
        }

        return Lexs.insert(lexDocument);
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

        lexSchema.validate(lex);

        lex = prepareUpdateInsert(lex, 'update');

        let lexDocument = {
            lex: lex.lex,
            titleFr: lex.titleFr,
            titleEn: lex.titleEn,
            urlFr: lex.urlFr,
            urlEn: lex.urlEn,
            descriptionFr: lex.descriptionFr,
            descriptionEn: lex.descriptionEn,
            publicationDate: lex.publicationDate,
            categoryId: lex.categoryId,
            subcategoryId: lex.subcategoryId,
            authors: lex.authors,
        }
        
        Lexs.update(
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

        Lexs.remove({_id: lexId});
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
        if (Categories.find({name: category.name}).count()>0) {
            throwMeteorError('name', 'Nom de la catégorie existe déjà !');
        }

        categoriesSchema.validate(category);

        let categoryDocument = {
            name: category.name,
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
        if (Subcategories.find({name: subcategory.name}).count()>0) {
            throwMeteorError('name', 'Nom de la sous catégorie existe déjà !');
        }

        subcategoriesSchema.validate(subcategory);

        let subcategoryDocument = {
            name: subcategory.name,
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

    insertAuthor(author) {

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
        if (Authors.find({lastName: author.lastName.toLowerCase(), firstName: author.firstName.toLowerCase()}).count() > 0) {
            throwMeteorErrors(['lastName', 'firstName'], 'Un auteur avec les mêmes nom et prénom existe déjà !');
        }
        
        authorsSchema.validate(author);

        console.log(author);

        let authorDocument = {
            firstName: author.firstName.toLowerCase(),
            lastName: author.lastName.toLowerCase(),
            urlFr: author.urlFr,
            urlEn: author.urlEn,
        };

        return Authors.insert(authorDocument);

    },

    removeAuthor(authorId){

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

        check(authorId, String);

        Authors.remove({_id: authorId});
    },
});
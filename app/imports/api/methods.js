import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { Lexs, lexSchema, Categories, categoriesSchema, Subcategories, subcategoriesSchema } from './collections';
import { throwMeteorError } from './error';

function prepareUpdateInsert(lex, action) {

    // Delete "/" at the end of URL 
    let url = lex.url;
    if (url.endsWith('/')) {
        lex.url = url.slice(0, -1);
    }
    
    // Check if url is unique 
    // TODO: Move this code to SimpleSchema custom validation function
    if (action === 'update') {
        let lexs = Lexs.find({url:lex.url});
        if (lexs.count() > 1) {
            throwMeteorError('url', 'Cette URL existe déjà !');
        } else if (lexs.count() == 1) {
            if (lexs.fetch()[0]._id != lex._id) {
                throwMeteorError('url', 'Cette URL existe déjà !');
            }
        }
    } else {
        if (Lexs.find({url:lex.url}).count() > 0) {
            throwMeteorError('url', 'Cette URL existe déjà !');
        }
    }

    // Check if LEX is unique
    // todo

    return lex;
}

Meteor.methods({

    insertLex(lex){
        
        /*
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
        */

        //console.log(`LEX ${lex}`);

        lexSchema.validate(lex);
        
        lex = prepareUpdateInsert(lex, 'insert');

        let lexDocument = {
            lex: lex.lex,
            title: lex.title,
            url: lex.url,
            description: lex.description,
            publicationDate: lex.publicationDate,
        }
        return Lexs.insert(lexDocument);
    },

    updateLex(lex) {

        /*
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
        */

        lexSchema.validate(lex);

        lex = prepareUpdateInsert(lex, 'update');

        let lexDocument = {
            lex: lex.lex,
            title: lex.title,
            url: lex.url,
            description: lex.description,
            publicationDate: lex.publicationDate,
        }
        
        Lexs.update(
            {_id: lex._id}, 
            { $set: lexDocument }
        );

    },
    
    removeLex(lexId){

        /*
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
        */

        check(lexId, String);

        Lexs.remove({_id: lexId});
    },

    insertCategory(category) {

        /*
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
        */

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

        /*
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
        */

        check(categoryId, String);

        Categories.remove({_id: categoryId});
    },

    insertSubcategory(subcategory) {

        /*
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
        */

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

        /*
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
        */

        check(subcategoryId, String);

        Subcategories.remove({_id: subcategoryId});
    },
});
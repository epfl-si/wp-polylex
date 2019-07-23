import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Categories, Subcategories, Authors } from '../../api/collections';
import { CustomError, CustomInput } from '../CustomFields';

class Admin extends React.Component {

    submit = (collection, values, actions) => {
        
        let meteorMethodName;

        if (collection._name === 'categories') {
            meteorMethodName = 'insertCategory';
        }
        if (collection._name === 'subcategories') {
            meteorMethodName = 'insertSubcategory';
        }
        if (collection._name === 'authors') {
            meteorMethodName = 'insertAuthor';
        }

        Meteor.call(
            meteorMethodName,
            values, 
            (errors, objectId) => {
                if (errors) {
                    let formErrors = {};
                    errors.details.forEach(function(error) {
                        formErrors[error.name] = error.message;                        
                    });
                    actions.setErrors(formErrors);
                    actions.setSubmitting(false);
                } else {
                    actions.setSubmitting(false);
                    actions.resetForm();
                }
            }
        );
    }

    submitCategory = (values, actions) => {
        this.submit(Categories, values, actions);
    }

    submitSubcategory = (values, actions) => {
        this.submit(Subcategories, values, actions);
    }

    submitAuthor = (values, actions) => {
        this.submit(Authors, values, actions);
    }

    delete = (collection, elementID) => {

        let meteorMethodName;

        if (collection._name === 'categories') {
            meteorMethodName = 'removeCategory';
        }
        if (collection._name === 'subcategories') {
            meteorMethodName = 'removeSubcategory';
        }
        if (collection._name === 'authors') {
            meteorMethodName = 'removeAuthor';
        }

        Meteor.call(
            meteorMethodName,
            elementID,
            function(error, objectId) {
                if (error) {
                    console.log(`ERROR ${collection._name} ${meteorMethodName} ${error}`);
                } 
            }
        );
    }

    deleteCategory = (categoryID) => {
        this.delete(Categories, categoryID);
    }

    deleteSubcategory = (subcategoryID) => {
        this.delete(Subcategories, subcategoryID);
    }

    deleteAuthor = (authorID) => {
        this.delete(Authors, authorID);
    }

    render() {
        return (
        <div>
            <div className="card my-2">

                <h5 className="card-header">Liste des auteurs des LEXs</h5>

                <ul className="list-group">
                    {this.props.authors.map( (author, index) => (
                        <li key={author._id} value={author.lastName} className="list-group-item">
                            {author.lastName} {author.firstName} {author.url}
                            <button type="button" className="close" aria-label="Close">
                                <span  onClick={() => this.deleteAuthor(author._id)} aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="card-body">
                    <Formik
                            onSubmit={ this.submitAuthor }
                            initialValues={ { firstName: '', lastName: '', url: ''} }
                            validationSchema={ this.nameSchema }
                            validateOnBlur={ false }
                            validateOnChange={ false }
                        >
                        {({
                            handleSubmit,
                            isSubmitting,
                        }) => (    
                            <form onSubmit={ handleSubmit } className="">
                                <Field label="Nom" placeholder="Nom de l'auteur à ajouter" name="lastName" type="text" component={ CustomInput } />
                                <ErrorMessage name="lastName" component={ CustomError } />
                                
                                <Field label="Prénom" placeholder="Prénom de l'auteur à ajouter" name="firstName" type="text" component={ CustomInput } />
                                <ErrorMessage name="firstName" component={ CustomError } />

                                <Field label="URL" placeholder="URL de l'auteur à ajouter" name="url" type="text" component={ CustomInput } />
                                <ErrorMessage name="url" component={ CustomError } />

                                <div className="my-1 text-right">
                                    <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>

                <h5 className="card-header">Liste des catégories des LEXs</h5>
    
                <ul className="list-group">
                    {this.props.categories.map( (category, index) => (
                        <li key={category._id} value={category.name} className="list-group-item">
                            {category.name}
                            <button type="button" className="close" aria-label="Close">
                                <span  onClick={() => this.deleteCategory(category._id)} aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="card-body">
                    <Formik
                            onSubmit={ this.submitCategory }
                            initialValues={ { name: ''} }
                            validationSchema={ this.nameSchema }
                            validateOnBlur={ false }
                            validateOnChange={ false }
                        >
                        {({
                            handleSubmit,
                            isSubmitting,
                        }) => (    
                            <form onSubmit={ handleSubmit } className="">
                                <Field placeholder="Nom de la catégorie à ajouter" name="name" type="text" component={ CustomInput } />
                                <ErrorMessage name="name" component={ CustomError } />
                                <div className="my-1 text-right">
                                    <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
            <div className="card my-2">

                <h5 className="card-header">Liste des sous-catégories des LEXs</h5>
    
                <ul className="list-group">
                    {this.props.subcategories.map( (subcategory, index) => (
                        <li key={subcategory._id} value={subcategory.name} className="list-group-item">
                            {subcategory.name}
                            <button type="button" className="close" aria-label="Close">
                                <span  onClick={() => this.deleteSubcategory(subcategory._id)} aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="card-body">
                    <Formik
                            onSubmit={ this.submitSubcategory }
                            initialValues={ { name: ''} }
                            validationSchema={ this.nameSchema }
                            validateOnBlur={ false }
                            validateOnChange={ false }
                        >
                        {({
                            handleSubmit,
                            isSubmitting,
                        }) => (    
                            <form onSubmit={ handleSubmit } className="">
                                <Field placeholder="Nom de la sous catégorie à ajouter" name="name" type="text" component={ CustomInput } />
                                <ErrorMessage name="name" component={ CustomError } />
                                <div className="my-1 text-right">
                                    <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
        )
    }
}

export default withTracker(() => {
    
    Meteor.subscribe('category.list');
    Meteor.subscribe('subcategory.list');
    Meteor.subscribe('author.list');

    return {
        categories: Categories.find({}, {sort: {name:1 }}).fetch(),
        subcategories: Subcategories.find({}, {sort: {name:1 }}).fetch(),
        authors: Authors.find({}, {sort: {lastname: 1}}).fetch(),
    };
    
})(Admin);

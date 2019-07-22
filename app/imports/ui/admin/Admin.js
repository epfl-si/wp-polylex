import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Categories, Subcategories } from '../../api/collections';
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

    delete = (collection, elementID) => {

        let meteorMethodName;

        if (collection._name === 'categories') {
            meteorMethodName = 'removeCategory';
        }
        if (collection._name === 'subcategories') {
            meteorMethodName = 'removeSubcategory';
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

    render() {
        return (
        <div>
            <div className="card my-2">

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

    return {
        categories: Categories.find({}, {sort: {name:1 }}).fetch(),
        subcategories: Subcategories.find({}, {sort: {name:1 }}).fetch(),
    };
    
})(Admin);

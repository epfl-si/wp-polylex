import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Categories, Subcategories, Responsibles } from '../../api/collections';
import { CustomError, CustomInput } from '../CustomFields';

class Admin extends React.Component {

    submit = (collection, values, actions) => {
        /*
        console.log(collection);
        console.log(values);
        */
        let meteorMethodName;

        if (collection._name === 'categories') {
            meteorMethodName = 'insertCategory';
        }
        if (collection._name === 'subcategories') {
            meteorMethodName = 'insertSubcategory';
        }
        if (collection._name === 'responsibles') {
            meteorMethodName = 'insertResponsible';
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

    submitResponsible = (values, actions) => {
        this.submit(Responsibles, values, actions);
    }

    delete = (collection, elementID) => {

        let meteorMethodName;

        if (collection._name === 'categories') {
            meteorMethodName = 'removeCategory';
        }
        if (collection._name === 'subcategories') {
            meteorMethodName = 'removeSubcategory';
        }
        if (collection._name === 'responsibles') {
            meteorMethodName = 'removeResponsible';
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

    deleteResponsible = (responsibleID) => {
        this.delete(Responsibles, responsibleID);
    }

    capitalizeFirstLetter = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    isEditResponsible = () => {
        return this.props.match.path.startsWith('/admin/responsible') && 
            this.props.match.params._id != undefined && 
            Responsibles.findOne({_id: this.props.match.params._id}) != undefined;
    }

    isAdd = () => {
        return this.props.match.path == '/admin/' || this.props.match.path == '/admin';
    }

    getResponsibleFormInitValues = () => {
        let responsibleFormInitialValues = { firstName: '', lastName: '', urlFr: '', urlEn: ''}

        if (this.isEditResponsible()) {
            let responsible = Responsibles.findOne({_id: this.props.match.params._id});      
            responsibleFormInitialValues = { 
                firstName: responsible.firstName, 
                lastName: responsible.lastName, 
                urlFr: responsible.urlFr, 
                urlEn: responsible.urlEn
            }
        }
        return responsibleFormInitialValues;
    }

    render() {

        let responsibleFormInitialValues = this.getResponsibleFormInitValues();
        
        if (this.isEditResponsible() || this.isAdd()){
            return (
        <div>
            <div className="card my-2">

                <h5 className="card-header">Liste des responsables des Lexes</h5>

                <ul className="list-group">
                    {this.props.responsibles.map( (responsible, index) => (
                        <li key={responsible._id} value={responsible.lastName} className="list-group-item">
                            <a href={responsible.urlFr} target="_blank">{responsible.lastName} {responsible.firstName}</a>
                            <button type="button" className="close" aria-label="Close">
                                <span  onClick={() => this.deleteResponsible(responsible._id)} aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="card-body">
                    <Formik
                            onSubmit={ this.submitResponsible }
                            initialValues={ responsibleFormInitialValues }
                            validationSchema={ this.nameSchema }
                            validateOnBlur={ false }
                            validateOnChange={ false }
                        >
                        {({
                            handleSubmit,
                            isSubmitting,
                        }) => (    
                            <form onSubmit={ handleSubmit } className="">
                                <Field label="Nom" placeholder="Nom du responsable à ajouter" name="lastName" type="text" component={ CustomInput } />
                                <ErrorMessage name="lastName" component={ CustomError } />
                                
                                <Field label="Prénom" placeholder="Prénom du responsable à ajouter" name="firstName" type="text" component={ CustomInput } />
                                <ErrorMessage name="firstName" component={ CustomError } />

                                <Field label="URL en français" placeholder="URL du responsable en français à ajouter" name="urlFr" type="text" component={ CustomInput } />
                                <ErrorMessage name="urlFr" component={ CustomError } />

                                <Field label="URL en anglais" placeholder="URL du responsable en anglais à ajouter" name="urlEn" type="text" component={ CustomInput } />
                                <ErrorMessage name="urlEn" component={ CustomError } />

                                <div className="my-1 text-right">
                                    <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>

                <h5 className="card-header">Liste des catégories des Lexes</h5>
    
                <ul className="list-group">
                    {this.props.categories.map( (category, index) => (
                        <li key={category._id} value={category.nameFr} className="list-group-item">
                            {category.nameFr} / {category.nameEn}
                            <button type="button" className="close" aria-label="Close">
                                <span  onClick={() => this.deleteCategory(category._id)} aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="card-body">
                    <Formik
                            onSubmit={ this.submitCategory }
                            initialValues={ { nameFr: '', nameEn: ''} }
                            validationSchema={ this.nameSchema }
                            validateOnBlur={ false }
                            validateOnChange={ false }
                        >
                        {({
                            handleSubmit,
                            isSubmitting,
                        }) => (    
                            <form onSubmit={ handleSubmit } className="">

                                <Field placeholder="Nom de la catégorie en français à ajouter" name="nameFr" type="text" component={ CustomInput } />
                                <ErrorMessage name="nameFr" component={ CustomError } />

                                <Field placeholder="Nom de la catégorie en anglais à ajouter" name="nameEn" type="text" component={ CustomInput } />
                                <ErrorMessage name="nameEn" component={ CustomError } />

                                <div className="my-1 text-right">
                                    <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
            <div className="card my-2">

                <h5 className="card-header">Liste des sous-catégories des Lexes</h5>
    
                <ul className="list-group">
                    {this.props.subcategories.map( (subcategory, index) => (
                        <li key={subcategory._id} value={subcategory.nameFr} className="list-group-item">
                            {subcategory.nameFr} / {subcategory.nameEn}
                            <button type="button" className="close" aria-label="Close">
                                <span onClick={() => this.deleteSubcategory(subcategory._id)} aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="card-body">
                    <Formik
                            onSubmit={ this.submitSubcategory }
                            initialValues={ { nameFr: '', nameEn: ''} }
                            validationSchema={ this.nameSchema }
                            validateOnBlur={ false }
                            validateOnChange={ false }
                        >
                        {({
                            handleSubmit,
                            isSubmitting,
                        }) => (    
                            <form onSubmit={ handleSubmit } className="">

                                <Field placeholder="Nom de la sous catégorie en français à ajouter" name="nameFr" type="text" component={ CustomInput } />
                                <ErrorMessage name="nameFr" component={ CustomError } />

                                <Field placeholder="Nom de la sous catégorie en anglais à ajouter" name="nameEn" type="text" component={ CustomInput } />
                                <ErrorMessage name="nameEn" component={ CustomError } />
                                
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
        } else {
            return <h1>Loading</h1>;
        }

    }
}

export default withTracker(() => {
    
    Meteor.subscribe('category.list');
    Meteor.subscribe('subcategory.list');
    Meteor.subscribe('responsible.list');

    return {
        categories: Categories.find({}, {sort: {name:1 }}).fetch(),
        subcategories: Subcategories.find({}, {sort: {name:1 }}).fetch(),
        responsibles: Responsibles.find({}, {sort: {lastName: 1}}).fetch(),
        
    };
    
})(Admin);

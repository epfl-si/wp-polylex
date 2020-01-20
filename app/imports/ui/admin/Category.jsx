import React, { Component, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Formik, Field, ErrorMessage } from 'formik';
import { Categories } from '../../api/collections';
import { CustomError, CustomInput } from '../CustomFields';
import { Link } from 'react-router-dom';
import { AlertSuccess, Loading } from '../Messages';

class CategoriesList extends Component {
  render() { 
    return (
      <Fragment>
        <h5 className="card-header">Liste des rubriques</h5>
        <ul className="list-group">
          {this.props.categories.map( (category, index) => (
            <li key={category._id} value={category.nameFr} className="list-group-item">
              {category.nameFr} / {category.nameEn}
              <button type="button" className="close" aria-label="Close">
                <span onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.props.callBackDeleteCategory(category._id) }} aria-hidden="true">&times;</span>
              </button>
              <Link className="edit" to={`/admin/category/${category._id}/edit`}>
                <button type="button" className="btn btn-outline-primary">Éditer</button>
              </Link>
            </li>
          ))}
        </ul>
      </Fragment>
    )
  }
}

class Category extends Component {

  constructor(props){
    super(props);
    
    let action;
    if (this.props.match.path == '/admin/category/:_id/edit') {
      action = 'edit';
    } else {
      action = 'add';
    }

    this.state = {
        action: action,
        addSuccess: false,
        editSuccess: false,
        deleteSuccess: false,
    }
  }

  deleteCategory = (categoryID) => {
    Meteor.call(
      'removeCategory',
      categoryID,
      (error, categoryID) => {
        if (error) {
            console.log(`ERROR Category removeCategory ${error}`);
            alert(error);
        } else {
          this.setState({deleteSuccess: true});
        }
      }
    );
  }

  updateUserMsg = () => {
    this.setState({addSuccess: false, editSuccess: false, deleteSuccess: false,});
  }

  submitCategory = (values, actions) => {
    let methodName;
    let state;
    let resetForm;

    if (this.state.action === 'add') {
      methodName = 'insertCategory';
      state = {addSuccess: true};
      resetForm = true;
    } else if (this.state.action === 'edit') {
      methodName = 'updateCategory';
      state = {editSuccess: true};
      resetForm = false;
    }

    Meteor.call(
      methodName,
      values, 
      (errors, CategoryId) => {
        if (errors) {
          console.log(errors);
          let formErrors = {};
          errors.details.forEach(function(error) {
            formErrors[error.name] = error.message;                        
          });
          actions.setErrors(formErrors);
          actions.setSubmitting(false);
        } else {
          actions.setSubmitting(false);
          if (resetForm) {
            actions.resetForm();
          }
          this.setState(state);
        }
      }
    );
  }

  getCategory = () => {
    // Get the URL parameter
    let categoryId = this.props.match.params._id;
    let category = Categories.findOne({_id: categoryId});
    return category;
  }

  getInitialValues = () => {
    let initialValues;
    if (this.state.action == 'add') {
      initialValues = { nameFr: '', nameEn: ''};
    } else {
      initialValues = this.getCategory();
    }
    return initialValues;
  }
  
  render() {

    let content;
    let initialValues = this.getInitialValues();
    let isLoading = (this.props.categories == undefined || initialValues == undefined);

    if (isLoading) {
      content = <Loading />;
    } else {

      const isDisplayCategoriesList = (this.state.action == 'add');

      content = (
        <Fragment>
          { this.state.deleteSuccess ? ( 
            <AlertSuccess message={ 'La rubrique a été supprimée avec succès !' } />
          ) : (null) }

          { isDisplayCategoriesList ? (
            <CategoriesList 
              categories={this.props.categories} 
              callBackDeleteCategory={this.deleteCategory} 
            />
          ):(<h5 className="card-header">Édition de la rubrique des Lexes suivante: </h5>)}
          <div className="card-body">

            { this.state.addSuccess ? ( 
              <AlertSuccess message={ 'La nouvelle rubrique a été ajoutée avec succès !' } />
            ) : (null) }

            { this.state.editSuccess ? ( 
              <AlertSuccess message={ 'La rubrique a été modifiée avec succès !' } />
            ) : (null) }

            { this.state.deleteSuccess ? ( 
              <AlertSuccess message={ 'La rubrique a été supprimée avec succès !' } />
            ) : (null) }
            
            <Formik
              onSubmit={ this.submitCategory }
              initialValues={ initialValues }
              validateOnBlur={ false }
              validateOnChange={ false }
                >
                {({
                    handleSubmit,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                }) => (    
                  <form onSubmit={ handleSubmit }>
                    <Field 
                      onChange={e => { handleChange(e); this.updateUserMsg();}}
                      onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                      placeholder="Nom de la rubrique en français à ajouter" name="nameFr" type="text" component={ CustomInput } />
                    <ErrorMessage name="nameFr" component={ CustomError } />

                    <Field 
                      onChange={e => { handleChange(e); this.updateUserMsg();}}
                      onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                      placeholder="Nom de la rubrique en anglais à ajouter" name="nameEn" type="text" component={ CustomInput } />
                    <ErrorMessage name="nameEn" component={ CustomError } />

                    <div className="my-1 text-right">
                        <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
                    </div>
                  </form>
                )}
            </Formik>
          </div>
        </Fragment>
      )
    }
    return content;
  }
}

export default withTracker(() => {
  Meteor.subscribe('categories');
  return {
    categories: Categories.find({}, {sort: {nameFr: 1}}).fetch(),
  };
})(Category);

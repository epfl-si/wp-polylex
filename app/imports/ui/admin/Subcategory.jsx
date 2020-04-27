import React, { Component, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Formik, Field, ErrorMessage } from 'formik';
import { Subcategories } from '../../api/collections';
import { CustomError, CustomInput } from '../CustomFields';
import { Link } from 'react-router-dom';
import { AlertSuccess, Loading } from '../Messages';
import { insertSubcategory, updateSubcategory, removeSubcategory } from '../../api/methods/subcategories';

class SubcategoriesList extends Component {
  render() { 
    return (
      <Fragment>
        <h5 className="card-header">Liste des sous-rubriques</h5>
        <ul className="list-group">
          {this.props.subcategories.map( (subcategory, index) => (
            <li key={subcategory._id} value={subcategory.nameFr} className="list-group-item">
              {subcategory.nameFr} / {subcategory.nameEn}
              <button type="button" className="close" aria-label="Close">
                <span  onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.props.callBackDeleteSubcategory(subcategory._id) }} aria-hidden="true">&times;</span>
              </button>
              <Link className="edit" to={`/admin/subcategory/${subcategory._id}/edit`}>
                <button type="button" className="btn btn-outline-primary">Éditer</button>
              </Link>
            </li>
          ))}
        </ul>
      </Fragment>
    )
  }
}

class Subcategory extends Component {

  constructor(props){
    super(props);
    
    let action;
    if (this.props.match.path == '/admin/subcategory/:_id/edit') {
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

  deleteSubcategory = (subcategoryId) => {
    removeSubcategory.call(
      {subcategoryId},
      (error, subcategoryId) => {
        if (error) {
          console.log(`ERROR Subcategory removeSubcategory ${error}`);
          alert(error);
        } else {
          this.setState({deleteSuccess: true});
        }
      }
    );
  }

  updateUserMsg = () => {
    this.setState({addSuccess: false, editSuccess: false, deleteSuccess: false});
  }

  submitSubcategory = (values, actions) => {
    if (this.state.action === 'add') {
      insertSubcategory.call(
        values, 
        (errors, SubcategoryId) => {
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
            actions.resetForm();
            this.setState({addSuccess: true});
          }
        }
      );
    } else if (this.state.action === 'edit') {
      updateSubcategory.call(
        values, 
        (errors, SubcategoryId) => {
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
            this.setState({editSuccess: true});
          }
        }
      );
    }
  }

  getSubcategory = () => {
    // Get the URL parameter
    let subcategoryId = this.props.match.params._id;
    let subcategory = Subcategories.findOne({_id: subcategoryId});
    return subcategory;
  }

  getInitialValues = () => {
    let initialValues;
    if (this.state.action == 'add') {
      initialValues = { nameFr: '', nameEn: ''};
    } else {
      initialValues = this.getSubcategory();
    }
    return initialValues;
  }
  
  render() {

    let content;
    let initialValues = this.getInitialValues();
    let isLoading = (this.props.subcategories == undefined || initialValues == undefined);

    if (isLoading) {
      content = <Loading />;
    } else {

      const isDisplaySubcategoriesList = (this.state.action == 'add');

      content = (
        <Fragment>
          { this.state.deleteSuccess ? ( 
            <AlertSuccess message={ 'La sous-rubrique a été supprimée avec succès !' } />
          ) : (null) }

          { isDisplaySubcategoriesList ? (
            <SubcategoriesList 
              subcategories={this.props.subcategories} 
              callBackDeleteSubcategory={this.deleteSubcategory} 
            />
          ):(<h5 className="card-header">Édition de la sous-rubrique des Lexes suivante: </h5>)}
          <div className="card-body">

            { this.state.addSuccess ? ( 
              <AlertSuccess message={ 'La nouvelle sous-rubrique a été ajoutée avec succès !' } />
            ) : (null) }

            { this.state.editSuccess ? ( 
              <AlertSuccess message={ 'La sous-rubrique a été modifiée avec succès !' } />
            ) : (null) }

            { this.state.deleteSuccess ? ( 
              <AlertSuccess message={ 'La sous-rubrique a été supprimée avec succès !' } />
            ) : (null) }
            
            <Formik
              onSubmit={ this.submitSubcategory }
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
                      placeholder="Nom de la sous rubrique en français à ajouter" name="nameFr" type="text" component={ CustomInput } />
                    <ErrorMessage name="nameFr" component={ CustomError } />
                    
                    <Field 
                      onChange={e => { handleChange(e); this.updateUserMsg();}}
                      onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                      placeholder="Nom de la sous rubrique en anglais à ajouter" name="nameEn" type="text" component={ CustomInput } />
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
  Meteor.subscribe('subcategories');
  return {
    subcategories: Subcategories.find({}, {sort: {nameFr: 1}}).fetch(),
  };
})(Subcategory);

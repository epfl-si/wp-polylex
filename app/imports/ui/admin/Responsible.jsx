import React, { Component, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Formik, Field, ErrorMessage } from 'formik';
import { Responsibles } from '../../api/collections';
import { CustomError, CustomInput } from '../CustomFields';
import { Link } from 'react-router-dom';
import { AlertSuccess, Loading } from '../Messages';

class ResponsiblesList extends Component {
  render() { 
    return (
      <Fragment>
        <h5 className="card-header">Liste des responsables des Lexes</h5>    
        <ul className="list-group">
          {this.props.responsibles.map( (responsible, index) => (
            <li key={responsible._id} value={responsible.lastName} className="list-group-item">
                <a href={responsible.urlFr} target="_blank">{responsible.lastName} {responsible.firstName}</a>
                <button type="button" className="close" aria-label="Close">
                  <span  onClick={() => this.props.callBackDeleteResponsible(responsible._id)} aria-hidden="true">&times;</span>
                </button>
                <Link className="edit" to={`/admin/responsible/${responsible._id}/edit`}>
                  <button type="button" className="btn btn-outline-primary">Éditer</button>
                </Link>
            </li>
          ))}
        </ul>
      </Fragment>
    )
  }
}

class Responsible extends Component {

  constructor(props){
    super(props);
    
    let action;
    if (this.props.match.path == '/admin/responsible/:_id/edit') {
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

  deleteResponsible = (responsibleID) => {
    Meteor.call(
      'removeResponsible',
      responsibleID,
      (error, responsibleID) => {
        if (error) {
          console.log(`ERROR Responsible removeResponsible ${error}`);
        } else {
          this.setState({deleteSuccess: true});
        }
      }
    );
  }

  updateUserMsg = () => {
    this.setState({addSuccess: false, editSuccess: false, deleteSuccess: false});
  }

  submitResponsible = (values, actions) => {
    let methodName;
    let state;
    let resetForm;

    if (this.state.action === 'add') {
      methodName = 'insertResponsible';
      state = {addSuccess: true};
      resetForm = true;
    } else if (this.state.action === 'edit') {
      methodName = 'updateResponsible';
      state = {editSuccess: true};
      resetForm = false;
    }

    Meteor.call(
      methodName,
      values, 
      (errors, ResponsibleId) => {
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

  getResponsible = () => {
    // Get the URL parameter
    let responsibleId = this.props.match.params._id;
    let responsible = Responsibles.findOne({_id: responsibleId});
    return responsible;
  }

  getInitialValues = () => {
    let initialValues;
    if (this.state.action == 'add') {
      initialValues = { firstName: '', lastName: '', urlFr: '', urlEn: ''};
    } else {
      initialValues = this.getResponsible();
    }
    return initialValues;
  }
  
  render() {

    let content;
    let initialValues = this.getInitialValues();
    let isLoading = (this.props.responsibles == undefined || initialValues == undefined);

    if (isLoading) {
      content = <Loading />;
    } else {

      const isDisplayResponsibleList = (this.state.action == 'add');

      content = (
        <Fragment>
          { this.state.deleteSuccess ? ( 
            <AlertSuccess message={ 'Le responsable a été supprimé avec succès !' } />
          ) : (null) }

          { isDisplayResponsibleList ? (
            <ResponsiblesList 
              responsibles={this.props.responsibles} 
              callBackDeleteResponsible={this.deleteResponsible} 
            />
          ):(<h5 className="card-header">Édition du responsable des Lexes suivant: </h5>)}
          <div className="card-body">

            { this.state.addSuccess ? ( 
              <AlertSuccess message={ 'Le nouveau responsable a été ajouté avec succès !' } />
            ) : (null) }

            { this.state.editSuccess ? ( 
              <AlertSuccess message={ 'Le responsable a été modifié avec succès !' } />
            ) : (null) }

            { this.state.deleteSuccess ? ( 
              <AlertSuccess message={ 'Le responsable a été supprimé avec succès !' } />
            ) : (null) }
            
            <Formik
              onSubmit={ this.submitResponsible }
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
                      label="Nom" placeholder="Nom du responsable à ajouter" name="lastName" type="text" component={ CustomInput } />
                    <ErrorMessage name="lastName" component={ CustomError } />
                    
                    <Field 
                      onChange={e => { handleChange(e); this.updateUserMsg();}}
                      onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                      label="Prénom" placeholder="Prénom du responsable à ajouter" name="firstName" type="text" component={ CustomInput } />
                    <ErrorMessage name="firstName" component={ CustomError } />

                    <Field 
                      onChange={e => { handleChange(e); this.updateUserMsg();}}
                      onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                      label="URL en français" placeholder="URL du responsable en français à ajouter" name="urlFr" type="text" component={ CustomInput } />
                    <ErrorMessage name="urlFr" component={ CustomError } />

                    <Field 
                      onChange={e => { handleChange(e); this.updateUserMsg();}}
                      onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                      label="URL en anglais" placeholder="URL du responsable en anglais à ajouter" name="urlEn" type="text" component={ CustomInput } />
                    <ErrorMessage name="urlEn" component={ CustomError } />

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
  Meteor.subscribe('responsibles');
  return {
      responsibles: Responsibles.find({}, {sort: {lastName: 1}}).fetch(),
  };
})(Responsible);

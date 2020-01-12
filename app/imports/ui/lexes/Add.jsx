import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Formik, Field, ErrorMessage } from 'formik';
import { Lexes, Categories, Subcategories, Responsibles } from '../../api/collections';
import { CustomError, CustomInput, CustomTextarea, CustomSelect } from '../CustomFields';
import { AlertSuccess, Loading } from '../Messages';

import './rich-editor.css';

//import { RichEditorExample } from './RichEditor';
import { RichEditorExample } from './RichEditor2';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

class Add extends Component {

  constructor(props){
    super(props);
    
    let action;
    if (this.props.match.path == '/edit/:_id') {
      action = 'edit';
    } else {
      action = 'add';
    }

    this.state = {
      action: action,
      addSuccess: false,
      editSuccess: false,
    }
  }

  updateUserMsg = () => {
    this.setState({addSuccess: false, editSuccess: false});
  }
    
  submit = (values, actions) => {

    values.dFr = JSON.stringify(convertToRaw(values.descriptionFr.getCurrentContent()));
    values.dEn = JSON.stringify(convertToRaw(values.descriptionEn.getCurrentContent()));

    let methodName;
    let state;
    if (this.state.action === 'add') {
      methodName = 'insertLex';
      state = {addSuccess: true};
    } else if (this.state.action === 'edit') {
      methodName = 'updateLex';
      state = {editSuccess: true};
    }

    Meteor.call(
      methodName,
      values, 
      (errors, lexId) => {
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
          if (this.state.action === 'add') {
            actions.resetForm();
          }
          this.setState(state);
        }
      }
    );
  }

  getLex = () => {
    // Get the URL parameter
    let lexId = this.props.match.params._id;
    let lex = Lexes.findOne({_id: lexId});

    if (lex !== undefined) {

      lex.descriptionFr = EditorState.createWithContent(
        convertFromRaw(JSON.parse(lex.descriptionFr))
      );
  
      lex.descriptionEn = EditorState.createWithContent(
        convertFromRaw(JSON.parse(lex.descriptionEn))
      );

    }
    
    return lex;
  }

  getInitialValues = () => {
    let initialValues;
    if (this.state.action == 'add') {
      initialValues = { 
        lex: '',
        titleFr: '',
        titleEn: '',
        urlFr: '',
        urlEn: '',
        descriptionFr: new EditorState.createEmpty(),
        descriptionEn: new EditorState.createEmpty(),
        effectiveDate: '',
        revisionDate: '',
        categoryId: this.props.defaultCategoryId,
        subcategoryId: this.props.defaultSubcategoryId,
        responsibleId: '',
      }
    } else {
      initialValues = this.getLex();
    }
    return initialValues;
  }

  isLoading = (initialValues) => {
    const isLoading = (
      this.props.lexes === undefined || 
      this.props.categories === undefined || 
      this.props.responsibles === undefined ||
      this.props.defaultCategoryId === undefined ||
      this.props.defaultSubcategoryId === undefined || 
      initialValues === undefined
    );
    return isLoading; 
  }

  getPageTitle = () => {
    let title;
    if (this.state.action === 'edit') {
      title = 'Modifier le lex ci-dessous'
    } else { 
      title = 'Ajouter un nouveau lex';
    }
    return title;
  }

  render() {

    let content;
    let initialValues = this.getInitialValues();

    if (this.isLoading(initialValues)) {
      content = <Loading />;
    } else {
      content = (   
        <div className="card my-2">
          <h5 className="card-header">{this.getPageTitle()}</h5> 
            
          { this.state.addSuccess ? ( 
            <AlertSuccess message={ 'Le nouveau lex a été ajouté avec succès !' } />
          ) : (null) }
            
          { this.state.editSuccess ? ( 
            <AlertSuccess message={ 'Le lex a été modifié avec succès !' } />
          ) : (null) }

          <Formik
              onSubmit={ this.submit }
              initialValues={ initialValues }
              validateOnBlur={ false }
              validateOnChange={ false }
          >
          {({
              values,
              handleSubmit,
              handleChange,
              handleBlur,
              setFieldValue,
              isSubmitting,
          }) => (
            <form onSubmit={ handleSubmit } className="bg-white border p-4">
              <div className="my-1 text-right">
                  <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
              </div>
              <Field 
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  placeholder="LEX à ajouter" label="LEX" name="lex" type="text" component={ CustomInput } 
              />
              <ErrorMessage name="lex" component={ CustomError } />
              
              <Field
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  placeholder="Titre en français du LEX à ajouter" label="Titre en français" name="titleFr" type="text" component={ CustomInput } 
              />
              <ErrorMessage name="titleFr" component={ CustomError } />

              <Field
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  placeholder="Titre en anglais du LEX à ajouter" label="Titre en anglais" name="titleEn" type="text" component={ CustomInput } 
              />
              <ErrorMessage name="titleEn" component={ CustomError } />

              <Field
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  placeholder="URL en français du LEX à ajouter" label="URL en français" name="urlFr" type="text" component={ CustomInput } 
              />
              <ErrorMessage name="urlFr" component={ CustomError } />

              <Field
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  placeholder="URL en anglais du LEX à ajouter" label="URL en anglais" name="urlEn" type="text" component={ CustomInput } 
              />
              <ErrorMessage name="urlEn" component={ CustomError } />

              <label>Description en français</label>
              <RichEditorExample
                editorState={values.descriptionFr}
                reference="descriptionFr"
                onChange={setFieldValue}
                onBlur={handleBlur}
              />
              
              <label>Description en anglais</label>
              <RichEditorExample
                editorState={values.descriptionEn}
                reference="descriptionEn"
                onChange={setFieldValue}
                onBlur={handleBlur}
              />

              <Field
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  placeholder="Date d'entrée en vigueur à ajouter" label="Date d'entrée en vigueur" name="effectiveDate" type="date" component={ CustomInput } 
              />
              <ErrorMessage name="effectiveDate" component={ CustomError } />

              <Field
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  placeholder="Date de révision à ajouter" label="Date de révision" name="revisionDate" type="date" component={ CustomInput } 
              />
              <ErrorMessage name="revisionDate" component={ CustomError } />

              <Field 
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  label="Rubrique" name="categoryId" component={ CustomSelect } >
                  {this.props.categories.map( (category, index) => (
                  <option key={category._id} value={category._id}>{category.nameFr}</option>
                  ))}
              </Field>
              <ErrorMessage name="category" component={ CustomError } />
              
              <Field 
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  label="Sous-rubrique" name="subcategoryId" component={ CustomSelect } >
                  {this.props.subcategories.map( (subcategory, index) => (
                  <option key={subcategory._id} value={subcategory._id}>{subcategory.nameFr}</option>
                  ))}
              </Field>
              <ErrorMessage name="subcategory" component={ CustomError } />
              
              <Field 
                  onChange={e => { handleChange(e); this.updateUserMsg();}}
                  onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                  label="Responsable" name="responsibleId" component={ CustomSelect } >
                  {this.props.responsibles.map( (responsible, index) => (
                  <option key={responsible._id} value={responsible._id}>{responsible.firstName} {responsible.lastName}</option>
                  ))}
              </Field>
              <ErrorMessage name="responsible" component={ CustomError } />
              
              <div className="my-1 text-right">
                  <button 
                      type="submit" 
                      disabled={ isSubmitting } 
                      className="btn btn-primary"
                  >Enregistrer</button>
              </div>
            </form>
          )}
         </Formik>

         { this.state.addSuccess ? ( 
            <AlertSuccess message={ 'Le nouveau lex a été ajouté avec succès !' } />
          ) : (null) }
            
          { this.state.editSuccess ? ( 
            <AlertSuccess message={ 'Le lex a été modifié avec succès !' } />
          ) : (null) }
          
        </div>
      )
    }
    return content;
  }
}

export default withTracker(() => {
    
    Meteor.subscribe('lexes');
    Meteor.subscribe('categories');
    Meteor.subscribe('subcategories');
    Meteor.subscribe('responsibles');

    let categories = Categories.find({}, {sort: {nameFr:1 }}).fetch();
    let subcategories = Subcategories.find({}, {sort: {nameFr:1 }}).fetch();
    let responsibles = Responsibles.find({}, {sort: {nameFr:1 }}).fetch()

    let defaultCategoryId = Categories.findOne({nameFr:"Autres"});
    if (defaultCategoryId != undefined) {
        defaultCategoryId = defaultCategoryId["_id"];
    }
    let defaultSubcategoryId = Subcategories.findOne({nameFr:"Achats et inventaire"});
    if (defaultSubcategoryId != undefined) {
        defaultSubcategoryId = defaultSubcategoryId["_id"];
    }

    return {
      lexes: Lexes.find({}, {sort: {lex: 1}}).fetch(),
      categories: categories,
      subcategories: subcategories,
      responsibles: responsibles,
      defaultCategoryId: defaultCategoryId,
      defaultSubcategoryId: defaultSubcategoryId,
    };  

})(Add);

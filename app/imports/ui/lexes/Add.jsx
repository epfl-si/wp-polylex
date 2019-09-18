import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withFormik, Formik, Field, ErrorMessage } from 'formik';
import { Lexes, Categories, Subcategories, Responsibles } from '../../api/collections';
import { CustomError, CustomInput, CustomTextarea, CustomSelect } from '../CustomFields';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { RichEditorExample } from './RichEditor';
import './rich-editor.css';

/*
const formikEnhancer = withFormik({
    mapPropsToValues: props => ({
    
      // editorState: new EditorState.createEmpty(),
      editorState: new EditorState.createWithContent(stateFromHTML('<p>Hello</p>'))
        
    }),
    
    handleSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        // you probably want to transform draftjs state to something else, but I'll leave that to you.
        console.log(stateToHTML(values['editorState'].getCurrentContent()));
        setSubmitting(false);
      }, 1000);
    },
    displayName: 'AddForm',
  });
*/
class AddForm extends React.Component {

    submit = (values, actions) => {
    
        if (this.props.action === 'add') {

            console.log(values);
            let result = stateToHTML(values['descriptionFrHTML'].getCurrentContent())
            console.log(result);

          Meteor.call(
            'insertLex',
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
                  actions.resetForm();
                  this.setState({addSuccess: true});
              }
            }
          );
        } else if (this.props.action === 'edit') {
    
          Meteor.call(
            'updateLex',
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
                this.setState({editSuccess: true});
              }
            }
          );
        }
      }
    

    render() {
        let initialValues;
    
        if (this.props.action === 'edit') {            
            initialValues = this.props.lex;
            let descriptionFrHTML = EditorState.createWithContent(stateFromHTML(initialValues.descriptionFr)); 
            initialValues['descriptionFrHTML'] = descriptionFrHTML;
        } else { 

            initialValues = { 
                lex: '',
                titleFr: '',
                titleEn: '',
                urlFr: '',
                urlEn: '',
                descriptionFr: '',
                descriptionEn: '',
                effectiveDate: '',
                revisionDate: '',
                categoryId: this.props.defaultCategoryId,
                subcategoryId: this.props.defaultSubcategoryId,
                responsibleId: '',
                //editorState: this.props.initialValues.editorState,
                // editorState: this.state.editorState,
                editorState: new EditorState.createEmpty(),
                descriptionFrHTML: new EditorState.createEmpty(),
            }

            console.log(initialValues);
        }

        return ( <Formik
            onSubmit={ this.submit }
            initialValues={ initialValues }
            validateOnBlur={ false }
            validateOnChange={ false }
        >
            {({
                handleSubmit,
                isSubmitting,
                values,
                touched,
                dirty,
                errors,
                handleChange,
                handleBlur,
                handleReset,
                setFieldValue,
                setFieldTouched,
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
                    
                    <RichEditorExample
                        editorState={values.editorState}
                        onChange={setFieldValue}
                        onBlur={handleBlur}
                        name="toto"
                    />
                    <RichEditorExample
                        editorState={values.descriptionFrHTML}
                        onChange={setFieldValue}
                        onBlur={handleBlur}
                        name="descriptionFrHTML"
                    />

                    <Field
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        placeholder="Description en français du LEX à ajouter" label="Description en Français" name="descriptionFr" type="text" component={ CustomTextarea } 
                    />
                    <ErrorMessage name="descriptionFr" component={ CustomError } />

                    <Field
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        placeholder="Description en anglais du LEX à ajouter" label="Description en anglais" name="descriptionEn" type="text" component={ CustomTextarea } 
                    />
                    <ErrorMessage name="descriptionEn" component={ CustomError } />

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
                        label="Catégorie" name="categoryId" component={ CustomSelect } >
                        {this.props.categories.map( (category, index) => (
                        <option key={category._id} value={category._id}>{category.nameFr}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="category" component={ CustomError } />
                    
                    <Field 
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        label="Sous-catégorie" name="subcategoryId" component={ CustomSelect } >
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
            </Formik>)

    }
}

// const MyEnhancedForm = formikEnhancer(AddForm);

class Add extends React.Component {

  constructor(props){
    super(props);
    
    let action;
    if (this.props.match.path.startsWith('/edit')) {
      action = 'edit';
    } else {
      action = 'add';
    }

    this.state = {
        saveSuccess: false,
        lex: '',
        action: action,
        addSuccess: false,
        editSuccess: false,
    }
  }

  updateSaveSuccess = (newValue) => {
    this.setState({ saveSuccess: newValue });
}

  updateUserMsg = () => {
    this.setState({addSuccess: false, editSuccess: false});
  }

  getLex = async () => {
    let lex = await Lexes.findOne({_id: this.props.match.params._id});
    return lex;
  }

  componentDidMount() {
    if (this.state.action === 'edit') {
        this.getLex().then((lex) => {
            this.setState({lex: lex});
        });
    }
  }
    
  
  render() {


    let content;
    const isLoadingEdit = (this.state.lex === undefined || this.state.lex === '') 
        && this.state.action === 'edit';
    const isLoadingAdd = (
            this.props.defaultCategoryId === undefined || 
            this.props.defaultSubcategoryId === undefined || 
            this.props.responsibles === undefined) && this.state.action === 'add';
    if (isLoadingAdd || isLoadingEdit) {
      content = <h1>Loading...</h1>
    } else {

      let title;

      if (this.state.action === 'edit') {
        title = 'Modifier le lex ci-dessous';
      } else {
        title = 'Ajouter un nouveau lex';
      }

      let msgAddSuccess = (
        <div className="alert alert-success" role="alert">
          Le nouveau lex a été ajouté avec succès ! 
        </div> 
      )

      let msgEditSuccess = (
        <div className="alert alert-success" role="alert">
          Le lex a été modifié avec succès ! 
        </div> 
      )
      
      content = (
          
        <div className="card my-2">
            <h5 className="card-header">{title}</h5> 
            
            { this.state.addSuccess && msgAddSuccess }
            { this.state.editSuccess && msgEditSuccess }

            <AddForm 
                action={this.state.action} 
                categories={this.props.categories} 
                subcategories={this.props.subcategories} 
                responsibles={this.props.responsibles}
                lex={this.state.lex}
            />
            
            { this.state.addSuccess && msgAddSuccess }
            { this.state.editSuccess && msgEditSuccess }
        </div>
      )
    }
    return content;
  }
}

export default withTracker(() => {
    
    Meteor.subscribe('lex.list');
    Meteor.subscribe('category.list');
    Meteor.subscribe('subcategory.list');
    Meteor.subscribe('responsible.list');

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

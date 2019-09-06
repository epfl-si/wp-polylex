import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Formik, Field, ErrorMessage } from 'formik';
import { Lexes, Categories, Subcategories, Responsibles } from '../../api/collections';
import { CustomError, CustomInput, CustomTextarea, CustomSelect } from '../CustomFields';
import { EditorState } from 'draft-js';
import { RichEditorExample } from './RichEditor';

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
    
  submit = (values, actions) => {
    
    console.log(values);

    if (this.state.action === 'add') {
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
    } else if (this.state.action === 'edit') {

      Meteor.call(
        'updateLex',
        values, 
        (errors, lexId) => {
          if (errors) {
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

    console.log(`Action: ${this.state.action}`);
    console.log(this.props);

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

      let initialValues;
      let title;

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
      
      if (this.state.action === 'edit') {
      
        title = 'Modifier le lex ci-dessous'
        initialValues = this.state.lex;
      
      } else { 
        title = 'Ajouter un nouveau lex';
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
        }
      }

      content = (
          
        <div className="card my-2">
            <h5 className="card-header">{title}</h5> 
            
            { this.state.addSuccess && msgAddSuccess }
            { this.state.editSuccess && msgEditSuccess }

            
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
    let subcategories = Subcategories.find({}, {sort: {name:1 }}).fetch();
    let responsibles = Responsibles.find({}, {sort: {name:1 }}).fetch()

    let defaultCategoryId = Categories.findOne({nameFr:"Autres"});
    if (defaultCategoryId != undefined) {
        defaultCategoryId = defaultCategoryId["_id"];
    }
    let defaultSubcategoryId = Subcategories.findOne({nameFr:"Achats"});
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

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Formik, Field, ErrorMessage } from 'formik';
import { Lexs } from '../../api/collections';
import { CustomError, CustomInput, CustomTextarea } from '../CustomFields';

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
        lex: '',
        action: action,
        addSuccess: false,
        editSuccess: false,
    }
  }

  updateUserMsg = () => {
    this.setState({addSuccess: false, editSuccess: false});
  }

  getLex = async () => {
    let lex = await Lexs.findOne({_id: this.props.match.params._id});
    return lex;
  }

  componentDidMount() {
    if (this.state.action === 'edit') {
      let lex = this.getLex().then((lex) => {
        this.setState({lex: lex});
      });
    }
  }
    
  submit = (values, actions) => {
    if (this.state.action === 'add') {
      Meteor.call(
        'insertLex',
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

    let content;
    const isLoading = (this.state.lex === undefined || this.state.lex === '')  && this.state.action === 'edit';
    
    if (isLoading) {
      content = <h1>Loading....</h1>
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
          title: '', 
          url: '',
          description: '',
          publicationDate: '',
        }
      }

      content = (
          
        <div className="card my-2">
            <h5 className="card-header">{title}</h5> 
            
            { this.state.addSuccess && msgAddSuccess }
            { this.state.editSuccess && msgEditSuccess }

            <Formik
                onSubmit={ this.submit }
                initialValues={ initialValues }
                validateOnBlur={ false }
                validateOnChange={ false }
            >
            { ({
                handleSubmit,
                handleChange,
                handleBlur,
                isSubmitting,
                values,
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
                        placeholder="Titre du LEX à ajouter" label="Titre" name="title" type="text" component={ CustomInput } 
                    />
                    <ErrorMessage name="title" component={ CustomError } />

                    <Field
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        placeholder="URL du LEX à ajouter" label="URL" name="url" type="text" component={ CustomInput } 
                    />
                    <ErrorMessage name="url" component={ CustomError } />

                    <Field
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        placeholder="Description du LEX à ajouter" label="Description" name="description" type="text" component={ CustomTextarea } 
                    />
                    <ErrorMessage name="description" component={ CustomError } />

                    <Field
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        placeholder="Date de publication du LEX à ajouter" label="Date de publication" name="publicationDate" type="date" component={ CustomInput } 
                    />
                    <ErrorMessage name="publicationDate" component={ CustomError } />

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

    return {
        lexs: Lexs.find({}, {sort: {lex: 1}}).fetch(),
    };  

})(Add);
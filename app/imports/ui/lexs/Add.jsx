import React from 'react';
import Select from 'react-select';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Formik, Field, ErrorMessage } from 'formik';
import { Lexs, Categories, Subcategories, Authors } from '../../api/collections';
import { CustomError, CustomInput, CustomTextarea, CustomSelect } from '../CustomFields';

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
    let lex = await Lexs.findOne({_id: this.props.match.params._id});
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
    
    

    let content;
    const isLoadingEdit = (this.state.lex === undefined || this.state.lex === '') 
        && this.state.action === 'edit';
    const isLoadingAdd = (
            this.props.defaultCategoryId === undefined || 
            this.props.defaultSubcategoryId === undefined
            ) && (this.props.authors === undefined) && this.state.action === 'add';
    if (isLoadingAdd || isLoadingEdit) {
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
          categoryId: this.props.defaultCategoryId,
          subcategoryId: this.props.defaultSubcategoryId,
          authors: [],
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

                    <Field 
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        label="Catégorie" name="categoryId" component={ CustomSelect } >
                        {this.props.categories.map( (category, index) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="category" component={ CustomError } />
                    
                    <Field 
                        onChange={e => { handleChange(e); this.updateUserMsg();}}
                        onBlur={e => { handleBlur(e); this.updateUserMsg();}}
                        label="Sous-catégorie" name="subcategoryId" component={ CustomSelect } >
                        {this.props.subcategories.map( (subcategory, index) => (
                        <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="subcategory" component={ CustomError } />

                    <MySelect
                        value={values.authors}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        error={errors.authors}
                        touched={touched.authors}
                        options={this.props.authors}
                        saveSuccess={this.updateSaveSuccess}
                        placeholder="Sélectionner un auteur"
                        name="authors"
                    />

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
    Meteor.subscribe('category.list');
    Meteor.subscribe('subcategory.list');
    Meteor.subscribe('author.list');

    let categories = Categories.find({}, {sort: {name:1 }}).fetch();
    let subcategories = Subcategories.find({}, {sort: {name:1 }}).fetch();

    let defaultCategoryId = Categories.findOne({name:"Autres"});
    if (defaultCategoryId != undefined) {
        defaultCategoryId = defaultCategoryId["_id"];
    }
    let defaultSubcategoryId = Subcategories.findOne({name:"Achats"});
    if (defaultSubcategoryId != undefined) {
        defaultSubcategoryId = defaultSubcategoryId["_id"];
    }

    return {
        lexs: Lexs.find({}, {sort: {lex: 1}}).fetch(),
        categories: categories,
        subcategories: subcategories,
        defaultCategoryId: defaultCategoryId,
        defaultSubcategoryId: defaultSubcategoryId,
        authors: Authors.find({}, {sort: {lastName: 1}}).fetch(),
    };  

})(Add);



class MySelect extends React.Component {
    handleChange = value => {
        // this is going to call setFieldValue and manually update values.topcis
        this.props.onChange(this.props.name, value);
        this.props.saveSuccess(!this.props.saveSuccess);
    };

    handleBlur = () => {
        // this is going to call setFieldTouched and manually update touched.topcis
        this.props.onBlur(this.props.name, true);
        this.props.saveSuccess(!this.props.saveSuccess);
    };

    render() {
    let content;

    content = 
    (
      <div style={{ margin: '1rem 0' }}>
       
        <Select
          isMulti
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          options={this.props.options}
          getOptionLabel ={(option)=>option.lastName}
          getOptionValue ={(option)=>option._id}
          placeholder={this.props.placeholder}

        />
        {!!this.props.error &&
          this.props.touched && (
            <div style={{ color: 'red', marginTop: '.5rem' }}>{this.props.error}</div>
          )}
      </div>
    );

    return content;
  }
}
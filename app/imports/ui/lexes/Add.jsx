import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker, withTracker } from "meteor/react-meteor-data";
import { useParams } from 'react-router-dom'
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Formik, Field, ErrorMessage, useFormikContext } from 'formik';
import {
  Lexes,
  Categories,
  Subcategories,
  Responsibles,
} from "../../api/collections";
import { CustomError, CustomInput, CustomSelect } from "../CustomFields";
import { AlertSuccess, Loading } from "../Messages";
import { insertLex, updateLex } from "../../api/methods/lexes";
import { MySelect } from "./Select";
import "./rich-editor.css";
import { PolylexRichEditor } from "./RichEditor";
import Switch from "react-switch";
import moment from 'moment';

const Add = ({ isLoading }) => {

  const { _id } = useParams();

  window.history.replaceState({}, document.title)

  const [addSuccess, setAddSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const clearUserMsg = () => {
    setAddSuccess(false);
    setEditSuccess(false);
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds, clear notifications
      clearUserMsg();
    }, 5000);

    return () => {
      clearTimeout(timeId);
    }
  }, []);

  const addLex = (values, actions) => {
    values.jsonDescriptionFr = JSON.stringify(
        convertToRaw(values.descriptionFr.getCurrentContent())
    );

    values.jsonDescriptionEn = JSON.stringify(
        convertToRaw(values.descriptionEn.getCurrentContent())
    );

    insertLex.call(values, (errors) => {
      if (errors) {
        console.log(errors);
        let formErrors = {};
        errors.details.forEach(function (error) {
          formErrors[error.name] = error.message;
        });
        actions.setErrors(formErrors);
        actions.setSubmitting(false);
      } else {
        actions.setSubmitting(false);
        actions.resetForm();
        setAddSuccess(true);
      }
    });
  }

  const editLex = (values, actions) => {
    values.jsonDescriptionFr = JSON.stringify(
        convertToRaw(values.descriptionFr.getCurrentContent())
    );

    values.jsonDescriptionEn = JSON.stringify(
        convertToRaw(values.descriptionEn.getCurrentContent())
    );

    updateLex.call(values, (errors) => {
      if (errors) {
        console.log(errors);
        let formErrors = {};
        errors.details.forEach(function (error) {
          formErrors[error.name] = error.message;
        });
        actions.setErrors(formErrors);
        actions.setSubmitting(false);
      } else {
        actions.setSubmitting(false);
        setEditSuccess(true);
      }
    });
  }

  if (isLoading) {
    return <Loading />;
  } else {
    return (<>
      <div className="card my-2">
        <h5 className="card-header">
          { _id ?
              "Modifier la lex ci-dessous" :
              "Ajouter une nouvelle lex"
          }
        </h5>
        { addSuccess &&
          <AlertSuccess
              message={"La nouvelle lex a été ajoutée avec succès !"}
          />
        }
        { editSuccess &&
          <AlertSuccess message={"La lex a été modifiée avec succès !"} />
        }
        { <LexForm
            lexId={ _id }
            onSubmit={ _id ? editLex : addLex }
            clearUserMsg={ clearUserMsg }
        />
        }

      </div>
      { addSuccess &&
      <AlertSuccess
          message={"La nouvelle lex a été ajoutée avec succès !"}
      />
      }
      { editSuccess &&
      <AlertSuccess message={"La lex a été modifiée avec succès !"} />
      }
    </>);
  }
}

const AbrogeSwitch = (props) => {
  const [checked, setChecked] = useState(!props.value);

  const {
    values: { abrogationDate },
    initialValues,
    setFieldValue,
  } = useFormikContext();

  const handleChange = nextChecked => {
    setChecked(nextChecked);
    props.setFieldValue(props.name, checked, false);


    // set or unset abrogation date on change
    if (!nextChecked) {
      if (!abrogationDate) {
        setFieldValue('abrogationDate', moment().format('YYYY-MM-DD'));
      }
    } else {
      // reset the value if it was not set initialy
      if (!initialValues.abrogationDate || initialValues.abrogationDate === '') {
        setFieldValue('abrogationDate', '');
      }
    }
  };

  return (
    <div className={'mb-3'}>
      <span>
        <Switch
            className="react-switch"
            checked={ checked }
            onChange={ handleChange }
            uncheckedIcon={false}
            offColor={'#F00'}
            name={props.name}
            value={checked}
        />
      </span>
      <span className={ 'pl-2' }>
        { checked ? `Actif` : `Abrogé` }
      </span>
    </div>);
}

const LexForm = ({
  lexId, onSubmit, clearUserMsg,
}) => {

  const categories = useTracker(
      () => Categories.find({}, { sort: { nameFr: 1 } }).fetch(), []
  );
  const subcategories = useTracker(
      () => Subcategories.find({}, { sort: { nameFr: 1 } }).fetch(), []
  );

  const responsibles = useTracker(
      () => Responsibles.find({}, { sort: { nameFr: 1 } }).fetch(), []
  );

  const getLex = (lexId) => {
    // Get the URL parameter
    let lex = Lexes.findOne({ _id: lexId });

    if (lex !== undefined) {
      lex.descriptionFr = EditorState.createWithContent(
          convertFromRaw(JSON.parse(lex.descriptionFr))
      );
      lex.descriptionEn = EditorState.createWithContent(
          convertFromRaw(JSON.parse(lex.descriptionEn))
      );
    }
    return lex;
  };

  const getInitialValues = (_id) => {
    if (_id) {
      return getLex(_id);
    } else {
      return {
        lex: "",
        titleFr: "",
        titleEn: "",
        urlFr: "",
        urlEn: "",
        urlLastConsEn: "",
        urlLastConsFR: "",
        descriptionFr: new EditorState.createWithText(""), // https://github.com/facebook/draft-js/commit/fc9395fe7ebf077db903c9c8fed71f136528ea5b
        descriptionEn: new EditorState.createWithText(""),
        effectiveDate: "",
        revisionDate: "",
        isAbrogated: false,
        abrogationDate: "",
        categoryId: "",
        subcategories: [],
        responsibleId: "",
      };
    }
  };

  return (
      <Formik
          enableReinitialize={ true }
          onSubmit={ onSubmit }
          initialValues={ getInitialValues(lexId) }
          validateOnBlur={ false }
          validateOnChange={ false }
      >
        { ({
          touched,
          errors,
          values,
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => (
            <form onSubmit={ handleSubmit } className="bg-white border p-4">
              <div className="text-right">
                <button
                    type="submit"
                    disabled={ isSubmitting }
                    className="btn btn-primary"
                >
                  Enregistrer
                </button>
              </div>
              <Field
                  name="isAbrogated"
                  type="checkbox"
                  as={ AbrogeSwitch }
                  setFieldValue={ setFieldValue }
                  className={'mb-2'}
              />
              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="LEX à ajouter"
                  label="Lex"
                  name="lex"
                  type="text"
                  component={ CustomInput }
              />
              <ErrorMessage name="lex" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="Titre en français de la lex à ajouter"
                  label="Titre en français"
                  name="titleFr"
                  type="text"
                  component={ CustomInput }
              />
              <ErrorMessage name="titleFr" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="Titre en anglais de la lex à ajouter"
                  label="Titre en anglais"
                  name="titleEn"
                  type="text"
                  component={ CustomInput }
              />
              <ErrorMessage name="titleEn" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="URL en français de la lex à ajouter"
                  label="URL en français"
                  name="urlFr"
                  type="text"
                  component={ CustomInput }
              />
              <ErrorMessage name="urlFr" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="URL en anglais de la lex à ajouter"
                  label="URL en anglais"
                  name="urlEn"
                  type="text"
                  component={ CustomInput }
              />
              <ErrorMessage name="urlEn" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="URL en anglais de la dernière consultation"
                  label="URL dernière consultation en anglais"
                  name="urlLastConsEn"
                  type="text"
                  component={ CustomInput }
              />
              <ErrorMessage name="urlLastConsEn" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="URL en français de la dernière consultation"
                  label="URL dernière consultation en français"
                  name="urlLastConsFr"
                  type="text"
                  component={ CustomInput }
              />
              <ErrorMessage name="urlLastConsFr" component={ CustomError }/>

              <label>Description en français</label>
              <PolylexRichEditor
                  editorState={ values.descriptionFr }
                  reference="descriptionFr"
                  onChange={ setFieldValue }
                  onBlur={ handleBlur }
              />

              <label>Description en anglais</label>
              <PolylexRichEditor
                  editorState={ values.descriptionEn }
                  reference="descriptionEn"
                  onChange={ setFieldValue }
                  onBlur={ handleBlur }
              />

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="Date d'entrée en vigueur à ajouter"
                  label="Date d'entrée en vigueur"
                  name="effectiveDate"
                  type="date"
                  component={ CustomInput }
              />
              <ErrorMessage name="effectiveDate" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="Date de révision à ajouter"
                  label="Date de révision"
                  name="revisionDate"
                  type="date"
                  component={ CustomInput }
              />
              <ErrorMessage name="revisionDate" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  placeholder="Date d'abrogation"
                  label="Date d'abrogation"
                  name="abrogationDate"
                  type="date"
                  component={ CustomInput }
              />
              <ErrorMessage name="abrogationDate" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  label="Rubrique"
                  name="categoryId"
                  component={ CustomSelect }
              >
                <option value={''}></option>
                { categories.map((category) => (
                    <option key={ category._id } value={ category._id }>
                      { category.nameFr }
                    </option>
                )) }
              </Field>
              <ErrorMessage name="category" component={ CustomError }/>

              <Field
                  onChange={ (e) => {
                    handleChange(e);
                    clearUserMsg();
                  } }
                  onBlur={ (e) => {
                    handleBlur(e);
                    clearUserMsg();
                  } }
                  label="Responsable"
                  name="responsibleId"
                  component={ CustomSelect }
              >
                <option value={''}></option>
                { responsibles.map((responsible) => (
                    <option key={ responsible._id } value={ responsible._id }>
                      { responsible.firstName } { responsible.lastName }
                    </option>
                )) }
              </Field>
              <ErrorMessage name="responsible" component={ CustomError }/>

              <label>Sélectionner une sous-rubrique</label>
              <div className="form-group clearfix">
                <MySelect
                    id="subcategories"
                    value={ values.subcategories }
                    onChange={ setFieldValue }
                    onBlur={ setFieldTouched }
                    error={ errors.subcategories }
                    touched={ touched.subcategories }
                    options={ subcategories }
                    placeholder="Sélectionner une sous-rubrique"
                    name="subcategories"
                />
              </div>
              <div className="text-right">
                <button
                    type="submit"
                    disabled={ isSubmitting }
                    className="btn btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </form>
        ) }
      </Formik>
  );
}

export default withTracker(() => {
  const handles = [
    Meteor.subscribe("lexes"),
    Meteor.subscribe("categories"),
    Meteor.subscribe("subcategories"),
    Meteor.subscribe("responsibles"),
  ];

  const areHandlesReady = () => {
    return handles.every((handle) => handle.ready());
  }

  return {
    isLoading: !areHandlesReady()
  };
})(Add);

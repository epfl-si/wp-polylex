import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Formik, Field, ErrorMessage } from "formik";
import Select from "react-select";
import {
  Lexes,
  Categories,
  Subcategories,
  Responsibles,
} from "../../api/collections";
import { CustomError, CustomInput, CustomSelect } from "../CustomFields";
import { AlertSuccess, Loading } from "../Messages";
import { insertLex, updateLex } from "../../api/methods/lexes";

import "./rich-editor.css";
import { PolylexRichEditor } from "./RichEditor";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

class Add extends Component {
  constructor(props) {
    super(props);

    let action;
    if (this.props.match.path == "/edit/:_id") {
      action = "edit";
    } else {
      action = "add";
    }

    this.state = {
      action: action,
      addSuccess: false,
      editSuccess: false,
    };
  }

  updateUserMsg = () => {
    this.setState({ addSuccess: false, editSuccess: false });
  };

  submit = (values, actions) => {
    values.jsonDescriptionFr = JSON.stringify(
      convertToRaw(values.descriptionFr.getCurrentContent())
    );
    values.jsonDescriptionEn = JSON.stringify(
      convertToRaw(values.descriptionEn.getCurrentContent())
    );

    if (this.state.action === "add") {
      insertLex.call(values, (errors, lexId) => {
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
          this.setState({ addSuccess: true });
        }
      });
    } else if (this.state.action === "edit") {
      updateLex.call(values, (errors, lexId) => {
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
          this.setState({ editSuccess: true });
        }
      });
    }
  };

  getLex = () => {
    // Get the URL parameter
    let lexId = this.props.match.params._id;
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

  getInitialValues = () => {
    let initialValues;
    if (this.state.action == "add") {
      initialValues = {
        lex: "",
        titleFr: "",
        titleEn: "",
        urlFr: "",
        urlEn: "",
        descriptionFr: new EditorState.createWithText(""), // https://github.com/facebook/draft-js/commit/fc9395fe7ebf077db903c9c8fed71f136528ea5b
        descriptionEn: new EditorState.createWithText(""), 
        effectiveDate: "",
        revisionDate: "",
        categoryId: this.props.defaultCategoryId,
        subcategories: [],
        responsibleId: "",
      };
    } else {
      initialValues = this.getLex();
    }
    return initialValues;
  };

  isLoading = (initialValues) => {
    const isLoading =
      this.props.lexes === undefined ||
      this.props.categories === undefined ||
      this.props.responsibles === undefined ||
      this.props.defaultCategoryId === undefined ||
      this.props.defaultSubcategoryId === undefined ||
      initialValues === undefined;
    return isLoading;
  };

  getPageTitle = () => {
    let title;
    if (this.state.action === "edit") {
      title = "Modifier le lex ci-dessous";
    } else {
      title = "Ajouter un nouveau lex";
    }
    return title;
  };

  render() {
    let content;
    let initialValues = this.getInitialValues();

    if (this.isLoading(initialValues)) {
      content = <Loading />;
    } else {
      content = (
        <div className="card my-2">
          <h5 className="card-header">{this.getPageTitle()}</h5>

          {this.state.addSuccess ? (
            <AlertSuccess
              message={"Le nouveau lex a été ajouté avec succès !"}
            />
          ) : null}

          {this.state.editSuccess ? (
            <AlertSuccess message={"Le lex a été modifié avec succès !"} />
          ) : null}

          <Formik
            onSubmit={this.submit}
            initialValues={initialValues}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({
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
              <form onSubmit={handleSubmit} className="bg-white border p-4">
                <div className="my-1 text-right">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    Enregistrer
                  </button>
                </div>
                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  placeholder="LEX à ajouter"
                  label="LEX"
                  name="lex"
                  type="text"
                  component={CustomInput}
                />
                <ErrorMessage name="lex" component={CustomError} />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  placeholder="Titre en français du LEX à ajouter"
                  label="Titre en français"
                  name="titleFr"
                  type="text"
                  component={CustomInput}
                />
                <ErrorMessage name="titleFr" component={CustomError} />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  placeholder="Titre en anglais du LEX à ajouter"
                  label="Titre en anglais"
                  name="titleEn"
                  type="text"
                  component={CustomInput}
                />
                <ErrorMessage name="titleEn" component={CustomError} />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  placeholder="URL en français du LEX à ajouter"
                  label="URL en français"
                  name="urlFr"
                  type="text"
                  component={CustomInput}
                />
                <ErrorMessage name="urlFr" component={CustomError} />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  placeholder="URL en anglais du LEX à ajouter"
                  label="URL en anglais"
                  name="urlEn"
                  type="text"
                  component={CustomInput}
                />
                <ErrorMessage name="urlEn" component={CustomError} />

                <label>Description en français</label>
                <PolylexRichEditor
                  editorState={values.descriptionFr}
                  reference="descriptionFr"
                  onChange={setFieldValue}
                  onBlur={handleBlur}
                />

                <label>Description en anglais</label>
                <PolylexRichEditor
                  editorState={values.descriptionEn}
                  reference="descriptionEn"
                  onChange={setFieldValue}
                  onBlur={handleBlur}
                />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  placeholder="Date d'entrée en vigueur à ajouter"
                  label="Date d'entrée en vigueur"
                  name="effectiveDate"
                  type="date"
                  component={CustomInput}
                />
                <ErrorMessage name="effectiveDate" component={CustomError} />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  placeholder="Date de révision à ajouter"
                  label="Date de révision"
                  name="revisionDate"
                  type="date"
                  component={CustomInput}
                />
                <ErrorMessage name="revisionDate" component={CustomError} />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  label="Rubrique"
                  name="categoryId"
                  component={CustomSelect}
                >
                  {this.props.categories.map((category, index) => (
                    <option key={category._id} value={category._id}>
                      {category.nameFr}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component={CustomError} />

                <Field
                  onChange={(e) => {
                    handleChange(e);
                    this.updateUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    this.updateUserMsg();
                  }}
                  label="Responsable"
                  name="responsibleId"
                  component={CustomSelect}
                >
                  {this.props.responsibles.map((responsible, index) => (
                    <option key={responsible._id} value={responsible._id}>
                      {responsible.firstName} {responsible.lastName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="responsible" component={CustomError} />

                <label>Sélectionner une sous-rubrique</label>
                <div className="form-group clearfix">
                  <MySelect
                    id="subcategories"
                    value={values.subcategories}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    error={errors.subcategories}
                    touched={touched.subcategories}
                    options={this.props.subcategories}
                    placeholder="Sélectionner une sous-rubrique"
                    name="subcategories"
                  />
                </div>

                <div className="my-1 text-right">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            )}
          </Formik>

          {this.state.addSuccess ? (
            <AlertSuccess
              message={"Le nouveau lex a été ajouté avec succès !"}
            />
          ) : null}

          {this.state.editSuccess ? (
            <AlertSuccess message={"Le lex a été modifié avec succès !"} />
          ) : null}
        </div>
      );
    }
    return content;
  }
}

export default withTracker(() => {
  Meteor.subscribe("lexes");
  Meteor.subscribe("categories");
  Meteor.subscribe("subcategories");
  Meteor.subscribe("responsibles");

  let categories = Categories.find({}, { sort: { nameFr: 1 } }).fetch();
  let subcategories = Subcategories.find({}, { sort: { nameFr: 1 } }).fetch();
  let responsibles = Responsibles.find({}, { sort: { nameFr: 1 } }).fetch();

  let defaultCategoryId = Categories.findOne({ nameFr: "Autres" });
  if (defaultCategoryId != undefined) {
    defaultCategoryId = defaultCategoryId["_id"];
  }
  let defaultSubcategoryId = Subcategories.findOne({
    nameFr: "Achats et inventaire",
  });
  if (defaultSubcategoryId != undefined) {
    defaultSubcategoryId = defaultSubcategoryId["_id"];
  }

  return {
    lexes: Lexes.find({}, { sort: { lex: 1 } }).fetch(),
    categories: categories,
    subcategories: subcategories,
    responsibles: responsibles,
    defaultCategoryId: defaultCategoryId,
    defaultSubcategoryId: defaultSubcategoryId,
  };
})(Add);

class MySelect extends React.Component {
  handleChange = (value) => {
    // this is going to call setFieldValue and manually update values
    this.props.onChange(this.props.name, value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched
    this.props.onBlur(this.props.name, true);
  };

  render() {
    let content;
    content = (
      <div style={{ margin: "0 0" }}>
        <Select
          isMulti
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          options={this.props.options}
          getOptionLabel={(option) => option.nameFr + " / " + option.nameEn}
          getOptionValue={(option) => option._id}
          placeholder={this.props.placeholder}
        />
        {!!this.props.error && this.props.touched && (
          <div style={{ color: "red", marginTop: ".5rem" }}>
            {this.props.error}
          </div>
        )}
      </div>
    );
    return content;
  }
}

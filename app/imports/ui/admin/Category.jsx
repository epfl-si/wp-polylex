import React, { useState, useEffect } from "react";
import { useFind, useSubscribe } from 'meteor/react-meteor-data'
import { Formik, Field, ErrorMessage } from "formik";
import { Categories } from '../../api/collections'
import { CustomError, CustomInput } from "../CustomFields";
import { Link, useParams } from 'react-router-dom'
import { AlertSuccess, Loading } from "../Messages";
import {
  insertCategory,
  updateCategory,
  removeCategory,
} from "../../api/methods/categories";


export const Category = () => {
  const isLoading = useSubscribe('responsibles');
  const { _id } = useParams();

  window.history.replaceState({}, document.title)

  const [addSuccess, setAddSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const clearUserMsg = () => {
    setAddSuccess(false);
    setEditSuccess(false);
    setDeleteSuccess(false);
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

  const addCategory = (values, actions) => {
    insertCategory.call(values, (errors) => {
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
        setAddSuccess(true);
      }
    });
  }

  const editCategory = (values, actions) => {
    updateCategory.call(values, (errors) => {
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
  };

  const deleteCategory = (categoryId) => {
    removeCategory.call({ categoryId }, (error) => {
      if (error) {
        console.log(`ERROR Category removeCategory ${error}`);
        alert(error);
      } else {
        setDeleteSuccess(true);
      }
    });
  };

  if (isLoading()) {
    return <Loading/>
  } else {
    return (
      <>
        { _id ?
          <h5 className="card-header">
            Édition de la rubrique
          </h5> :
          <CategoriesList
              callBackDeleteCategory={deleteCategory}
          />
        }
        <div className="card-body">
          { addSuccess &&
            <AlertSuccess
              message={"La nouvelle rubrique a été ajoutée avec succès !"}
            />
          }
          { editSuccess &&
            <AlertSuccess
              message={"La rubrique a été modifiée avec succès !"}
            />
          }
          { deleteSuccess &&
            <AlertSuccess
              message={"La rubrique a été supprimée avec succès !"}
            />
          }
          { <CategoryForm
              category={ _id ? Categories.findOne({ _id: _id }) : null }
              onSubmit={ _id ? editCategory : addCategory }
              clearUserMsg={ clearUserMsg }
            />
          }
        </div>
      </>
    );
  }
}

export const CategoriesList = (props) => {
  const isLoading = useSubscribe('categories');
  const categories = useFind(() => Categories.find({}, { sort: { nameFr: 1 } }), []);

  if (isLoading()) {
    return <Loading />;
  } else {
    return (
        <>
          <h5 className="card-header">Liste des rubriques</h5>
          <ul className="list-group">
            { categories.map((category) => (
                <li
                    key={ category._id }
                    value={ category.nameFr }
                    className="list-group-item"
                >
                  { category.nameFr } / { category.nameEn }
                  <button type="button" className="close" aria-label="Close">
              <span
                  onClick={ () => { window.confirm("Are you sure you wish to delete this item?") &&
                  props.callBackDeleteCategory(category._id);
                  } }
                  aria-hidden="true"
              >
                &times;
              </span>
                  </button>
                  <Link
                      className="edit"
                      to={ `/admin/category/${ category._id }/edit` }
                  >
                    <button type="button" className="btn btn-outline-primary">
                      Éditer
                    </button>
                  </Link>
                </li>
            )) }
          </ul>
        </>
    );
  }
}

const CategoryForm = ({ category, onSubmit, clearUserMsg }) => {
  const getInitialValues = (category) => {
    return category ? category : { nameFr: "", nameEn: "" };
  };

  return (
      <Formik
          enableReinitialize={true}
          onSubmit={onSubmit}
          initialValues={getInitialValues(category)}
          validateOnBlur={false}
          validateOnChange={false}
      >
        {({ handleSubmit, isSubmitting, handleChange, handleBlur }) => (
            <form onSubmit={handleSubmit}>
              <Field
                  onChange={(e) => {
                    handleChange(e);
                    clearUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    clearUserMsg();
                  }}
                  placeholder="Nom de la rubrique en français à ajouter"
                  name="nameFr"
                  type="text"
                  component={CustomInput}
              />
              <ErrorMessage name="nameFr" component={CustomError} />

              <Field
                  onChange={(e) => {
                    handleChange(e);
                    clearUserMsg();
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    clearUserMsg();
                  }}
                  placeholder="Nom de la rubrique en anglais à ajouter"
                  name="nameEn"
                  type="text"
                  component={CustomInput}
              />
              <ErrorMessage name="nameEn" component={CustomError} />

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
  );
}

export default Category;

import React, { useState, useEffect } from "react";
import { useFind, useSubscribe } from 'meteor/react-meteor-data'
import { Formik, Field, ErrorMessage } from "formik";
import { Subcategories, SubCategory } from '../../api/collections/categories'
import { CustomError, CustomInput } from "../CustomFields";
import { Link, useParams } from 'react-router-dom'
import { AlertSuccess, Loading } from "../Messages";
import { insertSubcategory, updateSubcategory, removeSubcategory } from '../../api/methods/subcategories';


const Subcategory = () => {
  const isLoading = useSubscribe('subcategories');
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

  const addSubCategory = (values, actions) => {
    insertSubcategory.call(
        values,
        (errors) => {
          if (errors) {
            console.log(errors);
            let formErrors = {};
            // @ts-ignore
            errors.details?.forEach(function(error) {
              formErrors[error.name] = error.message;
            });
            actions.setErrors(formErrors);
            actions.setSubmitting(false);
          } else {
            actions.setSubmitting(false);
            actions.resetForm();
            setAddSuccess(true);
          }
        }
    );
  };

  const editSubCategory = (values, actions) => {
    updateSubcategory.call(
      values,
      (errors) => {
        if (errors) {
          console.log(errors);
          let formErrors = {};
          // @ts-ignore
          errors.details?.forEach(function(error) {
            formErrors[error.name] = error.message;
          });
          actions.setErrors(formErrors);
          actions.setSubmitting(false);
        } else {
          actions.setSubmitting(false);
          setEditSuccess(true);
        }
      }
    );
  };

  const deleteSubcategory = (subcategoryId) => {
    removeSubcategory.call(
        {subcategoryId},
        (error) => {
          if (error) {
            console.log(`ERROR Subcategory removeSubcategory ${error}`);
            alert(error);
          } else {
            setDeleteSuccess(true);
          }
        }
    );
  };

  if (isLoading()) {
    return <Loading/>;
  } else {
    return (
      <>
        { _id ?
            <h5 className="card-header">
              Édition de la sous-rubrique
            </h5> :
            <SubcategoriesList
                callBackDeleteSubcategory={deleteSubcategory}
            />
        }
        <div className="card-body">
          { addSuccess &&
            <AlertSuccess message={ 'La nouvelle sous-rubrique a été ajoutée avec succès !' } />
          }
          { editSuccess &&
            <AlertSuccess message={ 'La sous-rubrique a été modifiée avec succès !' } />
          }
          { deleteSuccess &&
            <AlertSuccess message={ 'La sous-rubrique a été supprimée avec succès !' } />
          }
          { <SubcategoryForm
              subcategory={ _id ? Subcategories.findOne({ _id: _id }) : null }
              onSubmit={ _id ? editSubCategory : addSubCategory }
              clearUserMsg={ clearUserMsg }
          />
          }
        </div>
      </>
    );
  }
}

const SubcategoriesList = (props) => {
  const isLoading = useSubscribe('subcategories');
  const subcategories: SubCategory[] = useFind(
    () => Subcategories.find({}, { sort: { lastName: 1 } }) as any,
    []
  );

  if (isLoading()) {
    return <Loading />;
  } else {
    return (
        <>
          <h5 className="card-header">Liste des sous-rubriques</h5>
          <ul className="list-group">
            { subcategories.map((subcategory) => (
                <li key={ subcategory._id } value={ subcategory.nameFr } className="list-group-item">
                  { subcategory.nameFr } / { subcategory.nameEn }
                  <button type="button" className="close" aria-label="Close">
                  <span onClick={ () => {
                    window.confirm('Are you sure you wish to delete this item?') &&
                    props.callBackDeleteSubcategory(subcategory._id)
                  } }
                        aria-hidden="true">&times;</span>
                  </button>
                  <Link className="edit" to={ `/admin/subcategory/${ subcategory._id }/edit` }>
                    <button type="button" className="btn btn-outline-primary">Éditer</button>
                  </Link>
                </li>
            )) }
          </ul>
        </>
    );
  }
}

const SubcategoryForm = ({ subcategory, onSubmit, clearUserMsg }) => {
  const getInitialValues = (subcategory) => {
    return subcategory ? subcategory :
      { nameFr: '', nameEn: ''};
  }

  return (
      <Formik
          enableReinitialize={true}
          onSubmit={ onSubmit }
          initialValues={ getInitialValues(subcategory) }
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
                  onChange={e => { handleChange(e); clearUserMsg();}}
                  onBlur={e => { handleBlur(e); clearUserMsg();}}
                  placeholder="Nom de la sous-rubrique en français à ajouter" name="nameFr" type="text" component={ CustomInput } />
              <ErrorMessage name="nameFr" component={ CustomError } />

              <Field
                  onChange={e => { handleChange(e); clearUserMsg();}}
                  onBlur={e => { handleBlur(e); clearUserMsg();}}
                  placeholder="Nom de la sous-rubrique en anglais à ajouter" name="nameEn" type="text" component={ CustomInput } />
              <ErrorMessage name="nameEn" component={ CustomError } />

              <div className="my-1 text-right">
                <button type="submit" disabled={ isSubmitting } className="btn btn-primary">Enregistrer</button>
              </div>

            </form>
        )}
      </Formik>
  );
}

export default Subcategory;

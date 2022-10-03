import React, { useEffect, useState } from 'react'
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { Formik, Field, ErrorMessage } from 'formik'
import { Responsibles } from "../../api/collections";
import { CustomError, CustomInput } from "../CustomFields";
import { Link, useParams } from 'react-router-dom'
import { AlertSuccess, Loading } from "../Messages";
import { insertResponsible, updateResponsible, removeResponsible } from "../../api/methods/responsibles";

const Responsible = () => {
  const isLoading = useSubscribe('responsibles');

  window.history.replaceState({}, document.title)

  const { _id } = useParams();

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

  const addResponsible = (values, actions) => {
    insertResponsible.call(values, (errors) => {
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
  };

  const editResponsible = (values, actions) => {
    updateResponsible.call(values, (errors) => {
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

  const deleteResponsible = (responsibleId) => {
    removeResponsible.call({responsibleId}, (error) => {
      if (error) {
        console.log(`ERROR Responsible removeResponsible ${error}`);
        alert(error);
      } else {
        setDeleteSuccess(true);
      }
    });
  };

  if (isLoading()) {
    return <Loading />;
  } else {
    return (
      <>
        { _id ?
          <h5 className="card-header">
            Édition du responsable
          </h5> :
          <ResponsiblesList
          callBackDeleteResponsible={deleteResponsible}
          />
        }
        <div className="card-body">
          { addSuccess &&
              <AlertSuccess
                  message={"Le nouveau responsable a été ajouté avec succès !"}
              />
          }
          { editSuccess &&
              <AlertSuccess
                  message={"Le responsable a été modifié avec succès !"}
              />
          }
          { deleteSuccess &&
              <AlertSuccess
                  message={"Le responsable a été supprimé avec succès !"}
              />
          }
          { <ResponsibleForm
                  responsible={ _id ? Responsibles.findOne({ _id: _id }) : null }
                  onSubmit={ _id ? editResponsible : addResponsible }
                  clearUserMsg={ clearUserMsg }
            />
          }
        </div>
      </>
    );
  }
}

const ResponsiblesList = (props) => {
  const isLoading = useSubscribe('responsibles');
  const responsibles = useFind(() => Responsibles.find({}, { sort: { lastName: 1 } }), []);

  if (isLoading()) {
    return <Loading />;
  } else {
    return (
        <>
          <h5 className="card-header">Liste des responsables des Lexes</h5>
          <ul className="list-group">
            { responsibles.map( responsible =>
                <li
                  key={responsible._id}
                  value={responsible.lastName}
                  className="list-group-item"
                >
                  <a href={responsible.urlFr} target="_blank">
                    {responsible.lastName} {responsible.firstName}
                  </a>
                  <button type="button" className="close" aria-label="Close">
                    <span
                      onClick={() => { window.confirm("Are you sure you wish to delete this item?") &&
                        props.callBackDeleteResponsible(responsible._id);
                      }}
                      aria-hidden="true"
                    >
                      &times;
                    </span>
                  </button>
                  <Link
                      className="edit"
                      to={`/admin/responsible/${responsible._id}/edit`}
                  >
                    <button type="button" className="btn btn-outline-primary">
                      Éditer
                    </button>
                  </Link>
                </li>
            )}
          </ul>
        </>
    );
  }
}

const ResponsibleForm = ({ responsible, onSubmit, clearUserMsg }) => {
  const getInitialValues = (responsible) => {
    return responsible ? responsible :
     {
       firstName: '',
       lastName: '',
       urlFr: '',
       urlEn: ''
     };
  }

  return (
    <Formik
        enableReinitialize={true}
        initialValues={getInitialValues(responsible)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
    >
      {({
        handleSubmit,
        isSubmitting,
        handleChange,
        handleBlur
      }) => (
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
                label="Nom"
                placeholder="Nom du responsable à ajouter"
                name="lastName"
                type="text"
                component={CustomInput}
            />
            <ErrorMessage name="lastName" component={CustomError} />

            <Field
                onChange={(e) => {
                  handleChange(e);
                  clearUserMsg();
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  clearUserMsg();
                }}
                label="Prénom"
                placeholder="Prénom du responsable à ajouter"
                name="firstName"
                type="text"
                component={CustomInput}
            />
            <ErrorMessage name="firstName" component={CustomError} />

            <Field
                onChange={(e) => {
                  handleChange(e);
                  clearUserMsg();
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  clearUserMsg();
                }}
                label="URL en français"
                placeholder="URL du responsable en français à ajouter"
                name="urlFr"
                type="text"
                component={CustomInput}
            />
            <ErrorMessage name="urlFr" component={CustomError} />

            <Field
                onChange={(e) => {
                  handleChange(e);
                  clearUserMsg();
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  clearUserMsg();
                }}
                label="URL en anglais"
                placeholder="URL du responsable en anglais à ajouter"
                name="urlEn"
                type="text"
                component={CustomInput}
            />
            <ErrorMessage name="urlEn" component={CustomError} />

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

export default Responsible;

import React from 'react';
import { withTracker } from 'meteor/react-meteor-data'
import { Link } from 'react-router-dom';
import { Lexes, Categories, Subcategories, Responsibles } from '../../api/collections'
import { Loading } from '../Messages';
import moment from 'moment';
import { removeLex } from '../../api/methods/lexes';

const Cells = (props) => {
  const getCategoryNameFr = (categoryId) => {
    let categoryNameFr;
    for(const category of props.categories) {
      if (category._id === categoryId) {
        categoryNameFr = category.nameFr;
        break;
      }
    }
    return categoryNameFr;
  }

  const getSubcategoryNameFr = (subcategoryId) => {
    let subcategoryNameFr;
    for(const subcategory of props.subcategories) {
      if (subcategory._id === subcategoryId) {
        subcategoryNameFr = subcategory.nameFr;
        break;
      }
    }
    return subcategoryNameFr;
  }

  return (
      <tbody>
      {props.lexes.map( (lex) => (
          <tr key={lex._id}>
            <td><a href={lex.urlFr} target="_blank">{lex.lex}</a></td>
            <td>{lex.titleFr}</td>
            <td>{moment(lex.effectiveDate).format('DD-MM-YYYY')}</td>
            <td>{moment(lex.revisionDate).format('DD-MM-YYYY')}</td>
            <td>{getCategoryNameFr(lex.categoryId)}</td>
            <td>{getSubcategoryNameFr(lex.subcategoryId)}</td>
            <td>
              <Link className="mr-2" to={`/edit/${lex._id}`}>
                <button type="button" className="btn btn-outline-primary">Éditer</button>
              </Link>
              <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={ () => { if (window.confirm('Are you sure you wish to delete this item?')) this.props.deleteLex(lex._id) }}
              >Supprimer</button>
            </td>
          </tr>
      ))}
      </tbody>
  )
}

export const List = ({isLoading, lexes, categories, subcategories}) => {
  const deleteLex = (lexId) => {
    removeLex.call(
        {lexId},
        function(error) {
          if (error) {
            console.log(`ERROR removeLex ${error}`);
          }
        }
    );
  }

  const exporter = () => {
    lexes.forEach(function (lex) {
      // Responsible info
      let responsible = Responsibles.findOne({ _id: lex.responsibleId });
      lex.responsibleFirstName = responsible.firstName;
      lex.responsibleLastName = responsible.lastName;
      lex.responsibleUrlFr = responsible.urlFr;
      lex.responsibleUrlEn = responsible.urlEn;

      // Category info
      let category = Categories.findOne({ _id: lex.categoryId });
      lex.categoryNameFr = category.nameFr;
      lex.categoryNameEn = category.nameEn;
    });
    const csv = Papa.unparse({
      // Define fields to export
      fields: [
        "_id",
        "lex",
        "titleFr",
        "titleEn",
        "urlFr",
        "urlEn",
        "effectiveDate",
        "revisionDate",
        "responsibleFirstName",
        "responsibleLastName",
        "responsibleUrlFr",
        "responsibleUrlEn",
        "categoryNameFr",
        "categoryNameEn",
      ],
      data: lexes,
    });

    const blob = new Blob([csv], { type: "text/plain;charset=utf-8;" });
    saveAs(blob, "polylex.csv");
  }

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className="">
        <h4 className="py-3 float-left">Polylex</h4>
        <div className="mt-1 text-right">
          <button onClick={(e) => exporter(e)} className="btn btn-primary">
            Exporter CSV
          </button>
        </div>
        <table className="table table-striped">
          <thead>
          <tr>
            <th scope="col">LEX</th>
            <th scope="col">Title</th>
            <th scope="col" className="w-25">Date d'entrée en vigueur</th>
            <th scope="col" className="w-25">Date de révision</th>
            <th scope="col">Rubrique</th>
            <th scope="col">Sous-rubrique</th>
            <th className="w-50">Actions</th>
          </tr>
          </thead>
          <Cells
              lexes={lexes}
              categories={categories}
              subcategories={subcategories}
              deleteLex={ deleteLex }/>
        </table>
      </div>
    )
  }


}

export default withTracker(() => {
  const handles = [
    Meteor.subscribe('lexes'),
    Meteor.subscribe('categories'),
    Meteor.subscribe('subcategories'),
    Meteor.subscribe('responsibles'),
  ];

  const areHandlesReady = () => {
    return handles.every((handle) => handle.ready());
  }

  return {
    isLoading: !areHandlesReady(),
    lexes: Lexes.find({}).fetch(),
    categories: Categories.find({}).fetch(),
    subcategories: Subcategories.find({}).fetch(),
  };
})(List);

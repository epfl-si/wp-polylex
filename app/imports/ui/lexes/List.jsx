import React from 'react';
import { withTracker } from 'meteor/react-meteor-data'
import { Link } from 'react-router-dom';
import { Lexes, Categories, Subcategories } from '../../api/collections'
import { Loading } from '../Messages';
import exporter from './exporter'
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

  return (
      <tbody>
      {props.lexes.map( (lex) => (
          <tr key={lex._id}>
            <td><a href={lex.urlFr} target="_blank">{lex.lex}</a></td>
            <td>{lex.titleFr}</td>
            <td>{lex.effectiveDate && moment(lex.effectiveDate).format('DD.MM.YYYY')}</td>
            <td>
              { props.isAbrogated ?
              lex.isAbrogated && lex.abrogationDate && moment(lex.abrogationDate).format('DD.MM.YYYY') :
              lex.revisionDate && moment(lex.revisionDate).format('DD.MM.YYYY')
              }
            </td>
            <td>{getCategoryNameFr(lex.categoryId)}</td>
            <td>{ lex.subcategories && lex.subcategories.map(
                (sub) => <div key={sub._id}>{sub.nameFr}</div>
            )}</td>
            <td style={{whiteSpace: "nowrap"}}>
              <Link className="mr-2" to={`/edit/${lex._id}`}>
                <button type="button" className="btn btn-outline-primary">Éditer</button>
              </Link>&nbsp;
              <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={ () => { if (window.confirm('Are you sure you wish to delete this item?')) props.deleteLex(lex._id) }}
              >Supprimer</button>
            </td>
          </tr>
      ))}
      </tbody>
  )
}

export const List = ({isLoading, lexes, categories, subcategories, isAbrogated}) => {
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

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className="">
        <h4 className="py-3 float-left">Polylex</h4>
        <div className="mt-1 text-right">
          <button onClick={() => exporter(lexes)} className="btn btn-primary">
            Exporter CSV
          </button>
        </div>
        <table className="table table-striped">
          <thead>
          <tr>
            <th scope="col">LEX</th>
            <th scope="col">Title</th>
            <th scope="col" className="w-25">Entrée en vigueur</th>
            <th scope="col" className="w-25">
            { isAbrogated ?
              <>Abrogation</> : <>Révision</>
            }
            </th>
            <th scope="col">Rubrique</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>Sous-rubrique</th>
            <th className="w-50">Actions</th>
          </tr>
          </thead>
          <Cells
              lexes={lexes}
              categories={categories}
              subcategories={subcategories}
              deleteLex={ deleteLex }
              isAbrogated={ isAbrogated }
          />
        </table>
      </div>
    )
  }
}

export const ListActive = withTracker(() => {
  const handles = [
    Meteor.subscribe('lexesActive'),
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
    isAbrogated: false,
  };
})(List);

export const ListAbrogated = withTracker(() => {
  const handles = [
    Meteor.subscribe('lexesAbrogated'),
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
    isAbrogated: true,
  };
})(List);

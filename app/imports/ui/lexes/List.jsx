import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Lexes, Categories, Subcategories } from '../../api/collections';

class Cells extends Component {

  getCategoryNameFr = (categoryId) => {
    let categoryNameFr;
    for(const category of this.props.categories) {
      if (category._id == categoryId) {
        categoryNameFr = category.nameFr;
        break;   
      }
    }
    return categoryNameFr;
  }

  getSubcategoryNameFr = (subcategoryId) => {
    let subcategoryNameFr;
    for(const subcategory of this.props.subcategories) {
      if (subcategory._id == subcategoryId) {
        subcategoryNameFr = subcategory.nameFr;
        break;   
      }
    }
    return subcategoryNameFr;
  }

  render() {
    return (
      <tbody>
        {this.props.lexes.map( (lex, index) => (
          <tr key={lex._id}>
            <td><a href={lex.urlFr} target="_blank">{lex.lex}</a></td>
            <td>{lex.titleFr}</td>
            <td>{moment(lex.effectiveDate).format('DD-MM-YYYY')}</td>
            <td>{moment(lex.revisionDate).format('DD-MM-YYYY')}</td>
            <td>{this.getCategoryNameFr(lex.categoryId)}</td>
            <td>{this.getSubcategoryNameFr(lex.subcategoryId)}</td>
            <td>
              <Link className="mr-2" to={`/edit/${lex._id}`}>
                <button type="button" className="btn btn-outline-primary">Éditer</button>
              </Link>
              <button type="button" className="btn btn-outline-primary" onClick={() => this.props.deleteLex(lex._id)}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    )
  }
}

class List extends Component {
  
  deleteLex = (lexId) => {
    Meteor.call(
      'removeLex',
      lexId, 
      function(error, lexId) {
        if (error) {
          console.log(`ERROR removeLex ${error}`);
        }
      }
    );
  }

  render() {
    let content;
    let isLoading = (this.props.categories == undefined || this.props.lexes == undefined);
    if (isLoading) {
      content = "Loading";
    } else {
      content = (
        <div className="">
          <h4 className="py-4 float-left">Polylex</h4>
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
              lexes={this.props.lexes} 
              categories={this.props.categories} 
              subcategories={this.props.subcategories} 
              deleteLex={ this.deleteLex }/>
          </table>
        </div>
      )
    }
    return content;
  }
}
export default withTracker(() => {
  Meteor.subscribe('lexes');
  Meteor.subscribe('categories');
  Meteor.subscribe('subcategories');
  
  return {
    lexes: Lexes.find({}).fetch(),
    categories: Categories.find({}).fetch(),
    subcategories: Subcategories.find({}).fetch(),
  };
})(List);
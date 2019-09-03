import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Lexes } from '../../api/collections';

class Cells extends React.Component {
    render() {
        return (
            <tbody>
                {this.props.lexes.map( (lex, index) => (
                    <tr key={lex._id}>
                        <td>{lex.lex}</td>
                        <td>{lex.titleFr}</td>
                        <td><a href={lex.urlFr} target="_blank">{lex.urlFr}</a></td>
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

class List extends React.Component {

    deleteLex = (lexId) => {
        const lexes = [...this.props.lexes.filter(lex => lex._id !== lexId)];
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
        let content = (
            <div className="">
                <h4 className="py-4 float-left">Polylex</h4>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">LEX</th>
                            <th scope="col">Title</th>
                            <th scope="col">URL</th>
                            <th className="w-50">Actions</th>
                        </tr>
                    </thead>
                    <Cells lexes={this.props.lexes} deleteLex={ this.deleteLex }/>
                </table>
            </div>
        )
        return content;
    }
}

export default withTracker(() => {
    Meteor.subscribe('lex.list');
    
    return {
        lexes: Lexes.find({}).fetch()
    };
})(List);


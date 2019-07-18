import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Lexs } from '../../api/collections';

class Cells extends React.Component {
    render() {
        return (
            <tbody>
                {this.props.lexs.map( (lex, index) => (
                    <tr key={lex._id}>
                        <td>{lex.lex}</td>
                        <td>{lex.title}</td>
                        <td><a href={lex.url} target="_blank">{lex.url}</a></td>
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
        const lexs = [...this.props.lexs.filter(lex => lex._id !== lexId)];
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
                    <Cells lexs={this.props.lexs} deleteLex={ this.deleteLex }/>
                </table>
            </div>
        )
        return content;
    }
}

export default withTracker(() => {
    Meteor.subscribe('lex.list');
    
    return {
        lexs: Lexs.find({}).fetch()
    };
})(List);


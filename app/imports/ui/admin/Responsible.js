import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Lexes, Categories, Subcategories, Responsibles } from '../../api/collections';
import { CustomError, CustomInput } from '../CustomFields';

export default class Responsible extends React.Component {

    constructor(props){
        super(props);
        
        /*
        let responsibleId = this.props.match.params._id;
        console.log(`ID: ${responsibleId}`);
        let responsible = Responsibles.findOne({_id: responsibleId});
        console.log(responsible);
        */
      }

    getResponsible = async () => {
        /*
        let responsibleId = this.props.match.params._id;
        console.log(`ID: ${responsibleId}`);
        let responsible = await Responsibles.findOne({_id: responsibleId});
        console.log(responsible);
        return responsible;
        */
      }
    
    componentDidMount() {

        Tracker.autorun(() => {
            //let tags = Tags.find({}, {sort: {name_fr: this.state.orderNameFr}}).fetch();
            let tag = '';
            //if (this.state.action === 'edit') {
                tag = Responsibles.findOne({_id: this.props.match.params._id});
            //}
            console.log(tag);
            //this.setState({tags: tags, tag:tag});  
        })    
        /*
        this.getResponsible().then((responsible) => {
            console.log(responsible);
            //this.setState({responsible: responsible});
        });
        */

        /*
        let responsibleId = this.props.match.params._id;
        console.log(`ID: ${responsibleId}`);
        let responsible = Responsibles.findOne({_id: responsibleId});
        console.log(responsible);
        */
    }

    render() {

        // ICI ON PEUT FAIRE APPEL MAIS PAS DANS :
        // - le constructeur 
        // - componentDidMount même de manière asynchrone
        
        /*
        let responsibleId = this.props.match.params._id;
        console.log(`ID: ${responsibleId}`);
        let responsible = Responsibles.findOne({_id: responsibleId});
        console.log(responsible);
        */
        return (
            <h1>Test</h1>
        )
    }
}

/*
export default withTracker(() => {
        
    Meteor.subscribe('responsible.list');

    return {
        responsibles: Responsibles.find({}, {sort: {lastName: 1}}).fetch(),
    };
    
})(Responsible);
*/
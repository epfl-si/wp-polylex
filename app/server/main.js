import { Meteor } from 'meteor/meteor';
import { Lexs } from '../imports/api/collections.js';
import '../imports/api/methods';
import './publications';

function insertLex(lex, title, url, description, publicationDate) {
    Lexs.insert(
        { lex, title, url, description, publicationDate }
    );
}

Meteor.startup(() => {

    if (Lexs.find({}).count() === 0) {

        insertLex(
            '1.0.1',
            'Loi fédérale sur les écoles polytechniques fédérale',
            'https://www.admin.ch/opc/fr/classified-compilation/19910256/index.html',
            'description 1',
            '',
        );

        insertLex(
            '1.0.2',
            'Ordonnance sur le domaine des Ecoles polytechniques fédérales',
            'https://www.admin.ch/opc/fr/classified-compilation/20032108/index.html',
            'description 2',
            '',
        );

        insertLex(
            '1.0.3',
            'Ordonnance du CEPF sur les EPF de Zurich et Lausanne',
            'https://www.admin.ch/opc/fr/classified-compilation/20031283/index.html',
            'description 3',
            '',
        );
        
    }
});

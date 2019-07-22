import { Meteor } from 'meteor/meteor';
import { Lexs } from '../imports/api/collections.js';
import { importData } from './import-data';
import '../imports/api/methods';
import './publications';

Meteor.startup(() => {
    let needImportData = true;

    if (needImportData) {
        importData();
    }
});

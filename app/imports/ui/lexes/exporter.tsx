import Papa from 'papaparse'
import { saveAs } from 'file-saver';

import { Categories, Responsibles } from '../../api/collections'
import {Lex} from "/imports/api/collections/lexes";


type LexExportable = Lex & {
  responsibleFirstName?: string
  responsibleLastName?: string
  responsibleUrlFr?: string
  responsibleUrlEn?: string
  categoryNameFr?: string
  categoryNameEn?: string
  status: 'Abrogé' | 'Actif'
}

export const exporter = (lexes: Lex[]) => {
    lexes.forEach(function (lex: LexExportable) {
        // Responsible info
        let responsible = Responsibles.findOne({ _id: lex.responsibleId });
        lex.responsibleFirstName = responsible?.firstName;
        lex.responsibleLastName = responsible?.lastName;
        lex.responsibleUrlFr = responsible?.urlFr;
        lex.responsibleUrlEn = responsible?.urlEn;

        // Category info
        let category = Categories.findOne({ _id: lex.categoryId });
        lex.categoryNameFr = category?.nameFr;
        lex.categoryNameEn = category?.nameEn;

        // abrogated status
        lex.status = lex.isAbrogated ? 'Abrogé' : 'Actif';
    });
    const csv = Papa.unparse({
        // Define fields to export
        fields: [
            "_id",
            "type",
            "number",
            "titleFr",
            "titleEn",
            "urlFr",
            "urlEn",
            "effectiveDate",
            "revisionDate",
            "status",
            "abrogationDate",
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

export default exporter

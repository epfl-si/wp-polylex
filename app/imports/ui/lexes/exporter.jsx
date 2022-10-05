import { Categories, Responsibles } from '../../api/collections'

export const exporter = (lexes) => {
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

        // abrogated status
        lex.status = lex.isAbrogated ? 'Abrogé' : 'Actif';
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

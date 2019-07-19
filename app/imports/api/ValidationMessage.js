import MessageBox from 'message-box';

const messageBox = new MessageBox({
    messages: {
        fr: {
          required: 'Le champ "{{label}}" est obligatoire',
          minString: 'Le champ "{{label}}" doit contenir au moins {{min}} caractères',
          maxString: 'Le champ "{{label}}" ne peut pas avoir plus de {{max}} caractères',
          minNumber: 'Le champ "{{label}}" a pour valeur minimale {{min}}',
          maxNumber: 'Le champ "{{label}}" a pour valeur maximale {{max}}',
          minNumberExclusive: 'Le champ "{{label}}" doit être plus supérieur à {{min}}',
          maxNumberExclusive: 'Le champ "{{label}}" doit être plus inférieur à {{max}}',
          minDate: 'Le champ "{{label}}" doit être le ou après le {{min}}',
          maxDate: 'Le champ "{{label}}" ne peut pas être après le {{max}}',
          badDate: 'Le champ "{{label}}" n\'est pas une date valide',
          minCount: 'Vous devez spécifier au moins {{minCount}}} valeurs',
          maxCount: 'Vous ne pouvez pas spécifier plus de {{maxCount}}} valeurs',
          noDecimal: 'Ce champ doit être un entier',
          notAllowed: 'Ce champ n\'a pas une valeur autorisée',
          expectedType: '{{label}} doit être de type {{dataType}}',
          regEx({ label, regExp }) {
            switch (regExp) {
                case (SimpleSchema.RegEx.Url.toString()):
                return "Cette URL est invalide";
            }
        },
        keyNotInSchema: '{{name}} n\'est pas autorisé par le schéma',
        },
      },
    tracker: Tracker,
  });

messageBox.setLanguage('fr');

export function isRequired() {
    if (this.value === '') {
        return "required";
    }
}

export default messageBox;
import MessageBox from "message-box";
import SimpleSchema from "simpl-schema";

const messageBox = new MessageBox({
  messages: {
    fr: {
      required: (context) => `Le champ "${context.label}" est obligatoire`,
      minString: (context) =>
        `Le champ "${context.label}" doit contenir au moins ${context.min} caractères`,
      maxString: (context) =>
        `Le champ "${context.label}" ne peut pas avoir plus de ${context.max} caractères`,
      minNumber: (context) =>
        `Le champ "${context.label}" a pour valeur minimale ${context.min}`,
      maxNumber: (context) =>
        `Le champ "${context.label}" a pour valeur maximale ${context.max}`,
      minNumberExclusive: (context) =>
        `Le champ "${context.label}" doit être plus supérieur à ${context.min}`,
      maxNumberExclusive: (context) =>
        `Le champ "${context.label}" doit être plus inférieur à ${context.max}`,
      minDate: (context) =>
        `Le champ "${context.label}" doit être le ou après le ${context.min}`,
      maxDate: (context) =>
        `Le champ "${context.label}" ne peut pas être après le ${context.max}`,
      badDate: (context) =>
        `Le champ "${context.label}" n\'est pas une date valide`,
      minCount: (context) =>
        `Vous devez spécifier au moins ${context.minCount} valeurs`,
      maxCount: (context) =>
        `Vous ne pouvez pas spécifier plus de ${context.maxCount} valeurs`,
      noDecimal: () => `Ce champ doit être un entier`,
      notAllowed: () => `Ce champ n\'a pas une valeur autorisée`,
      expectedType: (context) =>
        `${context.label} doit être de type ${context.dataType}`,
      regEx({ regExp }) {
        switch (regExp) {
          case SimpleSchema.RegEx.Url.toString():
            return "Cette URL est invalide";
        }
      },
      keyNotInSchema:  (context) => `${context.name} n'est pas autorisé par le schéma`,
      invalidUrl: () => `Cette URL est invalide`,
    },
  },
  tracker: Tracker,
});

messageBox.setLanguage("fr");

export function isRequired() {
  if (this.value === "") {
    return "required";
  }
}

export default messageBox;

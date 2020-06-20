const FILE_LIMIT_SIZE = 500 * 1000;
const FILE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];

const PSEUDO_ALLOWED_CHAR = /[a-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž -]/i;
const NAME_ALLOWED_CHAR = /[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž -]/i;

const NAME_PATTERN_BASE = `a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð`;
const NAME_PATTERN = `^[${NAME_PATTERN_BASE}]+(([' -][${NAME_PATTERN_BASE}])?[${NAME_PATTERN_BASE}]*)*$`;
const PSEUDO_PATTERN = `^[${NAME_PATTERN_BASE}0-9]+(([' -][${NAME_PATTERN_BASE}0-9])?[${NAME_PATTERN_BASE}0-9]*)*$`;
const EMAIL_PATTERN = `^([a-zA-Z0-9.]+)@([a-zA-Z0-9-.]+).([a-zA-Z]{2,5})$`;


const FORMAT_RULES = {
  fileLimit: FILE_LIMIT_SIZE,
  fileExtensions: FILE_EXTENSIONS,
  pseudoAllowedChars: PSEUDO_ALLOWED_CHAR,
  nameAllowedChars: NAME_ALLOWED_CHAR,
  pseudoPattern: PSEUDO_PATTERN,
  namePattern: NAME_PATTERN,
  emailPattern: EMAIL_PATTERN,
  pseudoMax: 20,
  nameMax: 30,
  emailMax: 50,
  passwordMax: 30,
  presentation: 140
}

const TOOL_TIPS = {
  pseudo: 'format alphanumérique avec apostrophe, tiret et espace permis',
  name: 'format alphabétique avec apostrophe, tiret et espace permis',
  password: 'Saisir 8 caractères minimum avec 3 des caractéristiques suivantes: 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial'
}

export { FORMAT_RULES, TOOL_TIPS }

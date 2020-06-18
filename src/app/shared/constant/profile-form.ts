const FILE_LIMIT_SIZE = 500 * 1000;
const FILE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];

const PSEUDO_ALLOWED_CHAR = /[a-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž -]/i;
const NAME_ALLOWED_CHAR = /[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž -]/i;

const NAME_PATTERN_BASE = `a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð`;
const NAME_PATTERN = `^[${NAME_PATTERN_BASE}]+(([' -][${NAME_PATTERN_BASE}])?[${NAME_PATTERN_BASE}]*)*$`;
const PSEUDO_PATTERN = `^[${NAME_PATTERN_BASE}0-9]+(([' -][${NAME_PATTERN_BASE}0-9])?[${NAME_PATTERN_BASE}0-9]*)*$`;
const EMAIL_PATTERN = `^([a-zA-Z0-9.]+)@([a-zA-Z0-9-.]+).([a-zA-Z]{2,5})$`;
const PSEUDO_MAX = 20, NAME_MAX = 30, EMAIL_MAX = 50, PASSWORD_MAX = 30, PRESENTATION_MAX = 140;


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

export { FORMAT_RULES }

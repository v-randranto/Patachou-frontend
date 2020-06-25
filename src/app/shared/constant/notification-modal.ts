const EDIT_PROFILE = {
  color: '#28a745',
  title: 'A y est, demande traitée.',
  credentials_text: 'Vos identifiants sont modifiés.',
  personal_data_text: 'Vos données personnelles sont modifiées'
};

const REGISTER_PROFILE = {
  color: '#28a745',
  title: 'A y est, vous êtes des nôtres!',
  text: 'Un email vous a été envoyé pour confirmer votre inscription. Si vous ne le recevez pas, vérifiez votre adresse dans le profil de votre compte.'
};

const LOST_PASSWORD = {
  color: '#28a745',
  title: 'A y est, demande traitée!',
  text: 'Un mot de passe provisoire vous a été envoyé par email. Pensez à le modifier après connexion.'
};

const NETWORK_REQUEST = {
  color: '#28a745',
  title: 'A y est, demande traitée!',
  request_text: 'Votre demande a été envoyée à',
  confirm_text: 'Vous êtes désormais pote avec',
  reject_text: 'Vous avez refusé la demande de',
  unfriend_text: `Vous n'êtes plus pote avec`
};

const ERROR_NOTIFICATION = {
  title: 'Oups, une saucisse dans la pâte',
  text: 'Nous sommes désolés, un incident est intervenu. Merci de réessayer plus tard.'
};

export { EDIT_PROFILE, REGISTER_PROFILE , ERROR_NOTIFICATION, NETWORK_REQUEST, LOST_PASSWORD}

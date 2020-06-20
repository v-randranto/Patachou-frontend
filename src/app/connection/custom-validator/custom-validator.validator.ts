import { FormGroup } from "@angular/forms";

/**
 *
 * @param controlName
 * @param matchingControlName
 * la fonction contrôle que la confirmation est égale au mot de passe
 */
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

/**
 *
 * @param controlName
 * La fonction contrôle la robustesse du mot de passe
 * il doit comporter un minimum de caractères cf. const minLength
 * et au moins 3 des caractéristiques suivantes :
 * - une minuscule
 * - une majuscule
 * - un numérique
 * - un caractère spécial
 */
export function PasswordStrength(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    //ce contrôle ne doit pas être fait que si le password est saisi (cas modification du profil)
    if (control.untouched && control.pristine) {
      return;
    }

    if (control.errors && !control.errors.strength) {
      return;
    }

    const minLength = 4;
    const minPassedTests = 4;
    const upperCaseCharacters = /[A-Z]+/g;
    const lowerCaseCharacters = /[a-z]+/g;
    const numberCharacters = /[0-9]+/g;
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let passedTests = 0;
    let result = {
      passedTests: 0,
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    }

    let value = control.value;

    if (value.length >= minLength) {
      result.hasMinLength = true;
      passedTests++;
    }

    if (upperCaseCharacters.test(value) === true) {
      result.hasUpperCase = true;
      passedTests++;
    }

    if (lowerCaseCharacters.test(value) === true) {
      result.hasLowerCase = true;
      passedTests++;
    }

    if (numberCharacters.test(value) === true) {
      passedTests++;
      result.hasNumber = true;
    }

    if (specialCharacters.test(value) === true) {
      result.hasSpecialChar = true;
      passedTests++;

    }
    result.passedTests = passedTests;

    if (passedTests < minPassedTests) {
      control.setErrors({ strength: true });
    } else {
      control.setErrors(null);
    }
  }
}

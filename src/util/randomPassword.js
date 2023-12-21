export const generatePassword = (length = 8)=>{
    // Define character sets
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialCharacters = '!@#$%^&*()-_+=<>?';
  
    // Ensure minimum length requirement
    if (length < 8) {
      throw new Error('Password length must be at least 8 characters');
    }
  
    // Ensure each character set is represented in the password
    if (length < 4) {
      throw new Error('Password length must be at least 4 characters for each character set');
    }
  
    // Generate password
    let password = (
      randomChoice(uppercaseLetters) +
      randomChoice(lowercaseLetters) +
      randomChoice(digits) +
      randomChoice(specialCharacters)
    );
  
    // Fill the rest of the password with random characters
    for (let i = 0; i < length - 4; i++) {
      password += randomChoice(uppercaseLetters + lowercaseLetters + digits + specialCharacters);
    }
  
    // Shuffle the password to randomize the character order
    password = password.split('').sort(() => Math.random() - 0.5).join('');
  
    return password;
  }
  
  function randomChoice(str) {
    const randomIndex = Math.floor(Math.random() * str.length);
    return str.charAt(randomIndex);
  }
  
export const containsUppercase = (str) => {
    return /[A-Z]/.test(str);
}

export const containsLowercase = (str) => {
    return /[a-z]/.test(str);
}

export const containsNumeric = (str) => {
    return /\d/.test(str);
}

export const containsSpecialCharacter = (str) => {
    return /[!=@#$%^&*()-_+=<>?]/.test(str);
}
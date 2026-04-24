/** Placeholder validation helpers; extend or replace when wiring auth. */

export type FieldErrors = {
  username?: string;
  password?: string;
};

export function validateLoginFields(username: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!username.trim()) {
    errors.username = "Username or email is required.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

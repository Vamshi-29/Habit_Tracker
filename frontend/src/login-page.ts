import { hasErrors, validateLoginFields } from "./validation.js";
import "./styles/login.css";

/**
 * Renders the login screen into `root`.
 * Isolated module so the shell can later swap in a router or framework root.
 */
export function mountLoginPage(root: HTMLElement): void {
  root.innerHTML = `
    <div class="login-shell">
      <main class="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Habit Tracker</h1>
        <p class="subtitle">Sign in to continue</p>
        <form id="login-form" novalidate>
          <div class="field">
            <label for="username">Username or email</label>
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              aria-describedby="username-error"
            />
            <p id="username-error" class="field-error" role="alert" aria-live="polite"></p>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              aria-describedby="password-error"
            />
            <p id="password-error" class="field-error" role="alert" aria-live="polite"></p>
          </div>
          <div class="form-actions">
            <button type="submit">Login</button>
          </div>
        </form>
      </main>
    </div>
  `;

  const form = root.querySelector<HTMLFormElement>("#login-form");
  const usernameInput = root.querySelector<HTMLInputElement>("#username");
  const passwordInput = root.querySelector<HTMLInputElement>("#password");
  const usernameErrorEl = root.querySelector<HTMLElement>("#username-error");
  const passwordErrorEl = root.querySelector<HTMLElement>("#password-error");

  if (
    !form ||
    !usernameInput ||
    !passwordInput ||
    !usernameErrorEl ||
    !passwordErrorEl
  ) {
    return;
  }

  function clearFieldErrors(): void {
    usernameErrorEl.textContent = "";
    passwordErrorEl.textContent = "";
    usernameInput.removeAttribute("aria-invalid");
    passwordInput.removeAttribute("aria-invalid");
  }

  function applyErrors(username: string, password: string): boolean {
    clearFieldErrors();
    const errors = validateLoginFields(username, password);
    if (!hasErrors(errors)) {
      return false;
    }
    if (errors.username) {
      usernameErrorEl.textContent = errors.username;
      usernameInput.setAttribute("aria-invalid", "true");
    }
    if (errors.password) {
      passwordErrorEl.textContent = errors.password;
      passwordInput.setAttribute("aria-invalid", "true");
    }
    return true;
  }

  usernameInput.addEventListener("input", () => {
    if (usernameErrorEl.textContent) {
      usernameErrorEl.textContent = "";
      usernameInput.removeAttribute("aria-invalid");
    }
  });

  passwordInput.addEventListener("input", () => {
    if (passwordErrorEl.textContent) {
      passwordErrorEl.textContent = "";
      passwordInput.removeAttribute("aria-invalid");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    applyErrors(username, password);
    // Backend integration can hook here later.
  });
}

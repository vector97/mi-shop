import { openModal, closeModal } from './modals';
import { getData } from './api';

export const authFunc = () => {
  const authBtn = document.getElementById('open-auth-btn');
  const openCartBtn = document.getElementById('open-cart-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const adminBtn = document.getElementById('open-admin-btn');
  const authModal = document.getElementById('auth-modal');
  const loginInput = authModal.querySelector('#login-control');
  const passwordInput = authModal.querySelector('#password-control');
  const loginBtn = authModal.querySelector('.login-btn');
  const closeModalBtns = authModal.querySelectorAll('.close-btn');

  passwordInput.type = 'password';

  const logIn = () => {
    authBtn.classList.add('d-none');
    openCartBtn.classList.remove('d-none');
    logoutBtn.classList.remove('d-none');
    adminBtn.classList.remove('d-none');
    closeModal(authModal);
  };

  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem('auth'));

    if (user) {
      getData('/profile').then((data) => {
        if (
          (data.login && data.login === user.login) &&
          (data.password && data.password === user.password)
        ) {
          logIn();
        }
      });
    }
  }

  const logOut = () => {
    authBtn.classList.remove('d-none');
    openCartBtn.classList.add('d-none');
    logoutBtn.classList.add('d-none');
    adminBtn.classList.add('d-none');
  };

  authBtn.addEventListener('click', () => {
    openModal(authModal);
  });

  closeModalBtns.forEach((closeModalBtn) => {
    closeModalBtn.addEventListener('click', () => {
      closeModal(authModal);
    });
  });

  loginBtn.addEventListener('click', () => {
    const user = {
      login: loginInput.value,
      password: passwordInput.value,
    };

    const loginErrorLayout = `<p class="login__error" style="color: red;">Неверный логин</p>`;
    const passwordErrorLayout = `<p class="password__error" style="color: red;">Неверный пароль</p>`;

    getData('/profile').then((data) => {
      const loginErrorMessage = document.querySelector('.login__error');
      const passwordErrorMessage = document.querySelector('.password__error');
      const loginCorrect = data.login && data.login === user.login;
      const passwordCorrect = data.password && data.password === user.password;

      if (loginCorrect && passwordCorrect) {
        loginErrorMessage && loginErrorMessage.remove();
        passwordErrorMessage && passwordErrorMessage.remove();

        localStorage.setItem('auth', JSON.stringify(data));
        logIn();
      } else if (!loginCorrect && !passwordCorrect) {
        !loginErrorMessage ? loginInput.insertAdjacentHTML('afterend', loginErrorLayout) : null;
        !passwordErrorMessage ? passwordInput.insertAdjacentHTML('afterend', passwordErrorLayout) : null;
      } else if (!loginCorrect && passwordCorrect) {
        !loginErrorMessage ? loginInput.insertAdjacentHTML('afterend', loginErrorLayout) : null;
        passwordErrorMessage && passwordErrorMessage.remove();
      } else if (loginCorrect && !passwordCorrect) {
        !passwordErrorMessage ? passwordInput.insertAdjacentHTML('afterend', passwordErrorLayout) : null;
        loginErrorMessage && loginErrorMessage.remove();
      } else {
        alert('Введите данные от аккаунта');
      }
    });
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('auth');

    logOut();
  });

  checkAuth();
};
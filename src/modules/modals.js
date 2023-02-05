export const openModal = (modal) => {
  const backdrop = document.createElement('div');
  backdrop.classList.add('modal-backdrop');
  backdrop.classList.add('fade');
  document.body.append(backdrop);

  modal.classList.add('d-block');

  setTimeout(() => {
    backdrop.classList.add('show');
    modal.classList.add('show');
  }, 1);
};

export const closeModal = (modal) => {
  const backdrop = document.querySelector('.modal-backdrop');

  modal.classList.remove('show');
  backdrop && backdrop.classList.remove('show');

  setTimeout(() => {
    modal.classList.remove('d-block');
    backdrop && backdrop.remove();
  }, 300);
};
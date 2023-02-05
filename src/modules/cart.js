import { getData, putData, patchData } from './api';
import { openModal, closeModal } from './modals';

export const cartFunc = () => {
  const container = document.getElementById('cart-container');
  const openCartBtn = document.getElementById('open-cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const totalPrice = document.getElementById('cart-total-price');
  const closeModalBtns = cartModal.querySelectorAll('.close-btn');

  const render = (data) => {
    container.innerHTML = '';

    data.forEach((item) => {
      const formatter = new Intl.NumberFormat('ru', {
        style: "currency",
        currency: "RUB",
      });
      const formatPrice = formatter.format(item.price);

      container.insertAdjacentHTML('beforeend', `
        <div class="row border-bottom pb-3 pt-3">
          <div class="col col-12 col-md-6 mb-3 mb-md-0 fs-4">
            ${item.name}
          </div>
          <div class="col col-12 col-md-6 fs-4 d-flex align-items-center justify-content-end flex-wrap">
            <h4 class="me-3 d-flex align-itemns-center">${formatPrice}</h4>
            <button type="button" class="btn btn-outline-dark btn-sm cart-item-controls" id="control-dec" data-id="${item.id}" data-count="${item.count}">
              -
            </button>
            <h6 class="cart-item-count me-3 ms-3">${item.count}</h6>
            <button type="button" class="btn btn-outline-dark btn-sm cart-item-controls" id="control-inc" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-count="${item.count}">
              +
            </button>
          </div>
        </div>
      `)
    });
  };

  const updateCart = () => {
    getData('/cart')
      .then((data) => {
        render(data);
        updateTotalPrice(data);
      })
      .catch((error) => {
        console.error('Произошла ошибка');
      })
  };

  const updateTotalPrice = (data) => {
    let total = 0;

    data.forEach((product) => {
      total += Number(product.price) * product.count;
    });

    const formatter = new Intl.NumberFormat('ru', {
      style: "currency",
      currency: "RUB",
    });
    const formatTotal = formatter.format(total);

    totalPrice.textContent = `${formatTotal}`;
  };

  openCartBtn.addEventListener('click', () => {
    updateCart();
    openModal(cartModal);
  });

  closeModalBtns.forEach((closeModalBtn) => {
    closeModalBtn.addEventListener('click', () => {
      closeModal(cartModal);
    });
  });

  container.addEventListener('click', (event) => {
    const target = event.target;

    if (target.closest('button')) {
      if (target.id && target.id === 'control-inc') {
        const id = target.dataset.id;
        const name = target.dataset.name;
        const count = Number(target.dataset.count);
        const price = target.dataset.price;

        const item = {
          id: id,
          name: name,
          count: count + 1,
          price: price,
        };

        putData(`/cart/${id}`, item).then(() => {
          updateCart();
        });
      } else if (target.id && target.id === 'control-dec') {
        const id = target.dataset.id;
        const count = Number(target.dataset.count);

        if (count > 0) {
          const item = {
            count: count - 1,
          };

          patchData(`/cart/${id}`, item).then(() => {
            updateCart();
          });
        }
      }
    }
  });
};
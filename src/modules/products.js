import { getData, postData } from './api';

export const productsFunc = () => {
  const container = document.getElementById('products-container');
  const catalogSearch = document.querySelector('.catalog-search');

  const render = (data) => {
    container.innerHTML = '';

    data.forEach((item) => {
      const formatter = new Intl.NumberFormat('ru', {
        style: "currency",
        currency: "RUB",
      });
      const formatPrice = formatter.format(item.price);

      container.insertAdjacentHTML('beforeend', `
        <div class="col col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
          <a href="#" class="card-link">
            <div class="card">
              <img src="${item.preview}" class="card-img-top" alt="phone-1">
              <div class="card-body">
                <span class="mb-2 d-block text-secondary">${item.title}</span>
                <h6 class="card-title mb-3">${item.name}</h6>

                <div class="row">
                  <div class="col d-flex align-itemns-center justify-content-between">
                    <h4>${formatPrice}</h4>
                    <button type="button" class="btn btn-outline-dark" data-product="${item.id}">
                      <img src="/images/icon/shopping-cart-big.svg" alt="login">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      `);
    });
  };

  catalogSearch.addEventListener('input', (event) => {
    const target = event.target;
    const params = window.location.search;
    const urlSearchParams = new URLSearchParams(params);
    const id = urlSearchParams.get('id');

    getData(`/products?category=${id}&q=${target.value}`)
      .then((data) => {
        render(data);
      })
      .catch((error) => {
        console.error('Произошла ошибка');
      });
  });

  container.addEventListener('click', (event) => {
    const target = event.target;

    if (target.closest('button')) {
      const id = target.closest('button').dataset.product;

      getData(`/products/${id}`)
        .then((product) => {
          postData('/cart', {
            name: product.name,
            price: product.price,
            count: 1,
          }).then(() => {
            console.log('Добавлено');
          })
        })
        .catch((error) => {
          console.error('Произошла ошибка');
        })
    }
  });

  const init = () => {
    const params = window.location.search;
    const urlSearchParams = new URLSearchParams(params);
    const id = urlSearchParams.get('id');
    const url = id ? `/products?category=${id}` : `/products`;

    getData(url)
      .then((data) => {
        render(data);
      })
      .catch((error) => {
        console.error('Произошла ошибка');
      })
  };

  init();
};
import { postData, getData, deleteData } from '../api';

export const addProduct = () => {
  const select = document.getElementById('product-category');
  const titleInput = document.getElementById('product-title');
  const nameInput = document.getElementById('product-name');
  const priceInput = document.getElementById('product-price');
  const previewInput = document.getElementById('product-image');
  const saveBtn = document.getElementById('product-add-btn');
  const container = document.getElementById('product-table');

  const productData = {
    title: '',
    name: '',
    price: 0,
    preview: '',
    category: 0,
  };

  const render = (data) => {
    container.innerHTML = '';

    data.forEach((item, index) => {
      const formatter = new Intl.NumberFormat('ru', {
        style: "currency",
        currency: "RUB",
      });
      const formatPrice = formatter.format(item.price);

      container.insertAdjacentHTML('beforeend', `
        <tr>
          <th scope="row">${index + 1}</th>
          <td>${item.title}</td>
          <td>${item.name}</td>
          <td>${formatPrice}</td>
          <td class="text-end">
            <button type="button" class="btn btn-outline-danger btn-sm" data-product="${item.id}">
              удалить
            </button>
          </td>
        </tr>
      `);
    });
  };

  const checkValues = () => {
    if (
      select.value === 'default' ||
      titleInput.value === '' ||
      nameInput.value === '' ||
      Number(priceInput.value) === 0 ||
      previewInput.value === ''
    ) {
      saveBtn.disabled = true;
    } else {
      saveBtn.disabled = false;
    }
  };

  const updateTable = () => {
    getData('/products').then((data) => {
      render(data);
    });
  };

  select.addEventListener('change', () => {
    productData.category = select.value;
    const url = select.value !== 'default' ? `/products?category=${select.value}` : `/products`;

    getData(url).then((data) => {
      render(data);
    });

    checkValues();
  });

  titleInput.addEventListener('input', () => {
    productData.title = titleInput.value;
    checkValues();
  });

  nameInput.addEventListener('input', () => {
    productData.name = nameInput.value;
    checkValues();
  });

  priceInput.addEventListener('input', () => {
    productData.price = Number(priceInput.value);
    checkValues();
  });

  previewInput.addEventListener('input', () => {
    const file = previewInput.files[0];

    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
      const reader = new FileReader();

      reader.onload = () => {
        productData.preview = reader.result;
      };

      reader.onerror = () => {
        productData.preview = '';
        previewInput.value = '';
      };

      reader.readAsDataURL(file);
    } else {
      previewInput.value = '';
    }

    checkValues();
  });

  saveBtn.addEventListener('click', () => {
    postData('/products', productData).then(() => {
      titleInput.value = '';
      nameInput.value = '';
      priceInput.value = 0;
      previewInput.value = '';
      updateTable();
    })
  });

  container.addEventListener('click', (event) => {
    const target = event.target;

    if (target.tagName === 'BUTTON') {
      const id = target.dataset.product;

      deleteData(`/products/${id}`).then((data) => {
        updateTable();
      });
    }
  });

  updateTable();
  checkValues();
};
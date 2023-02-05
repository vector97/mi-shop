import { postData, getData, deleteData } from '../api';

export const addCategory = () => {
  const nameInput = document.getElementById('category-name');
  const previewInput = document.getElementById('category-image');
  const saveBtn = document.getElementById('category-add-btn');
  const container = document.getElementById('category-container');
  const select = document.getElementById('product-category');

  const categoryData = {
    name: '',
    preview: '',
  };

  const render = (data) => {
    container.innerHTML = '';
    select.innerHTML = `
      <option value="default" selected>Выберите категорию</option>
    `;

    data.forEach((item, index) => {
      container.insertAdjacentHTML('beforeend', `
        <tr>
          <th scope="row">${index + 1}</th>
          <td>${item.name}</td>
          <td class="text-end">
            <button type="button" class="btn btn-outline-danger btn-sm" data-category="${item.id}">
              удалить
            </button>
          </td>
        </tr>
      `);

      select.insertAdjacentHTML('beforeend', `
        <option value="${item.id}">${item.name}</option>
      `);
    });
  };

  const checkValues = () => {
    if (nameInput.value === '' || previewInput.value === '') {
      saveBtn.disabled = true;
    } else {
      saveBtn.disabled = false;
    }
  };

  const updateTable = () => {
    getData('/categories').then((data) => {
      render(data);
    });
  };

  nameInput.addEventListener('input', () => {
    categoryData.name = nameInput.value;
    checkValues();
  });

  previewInput.addEventListener('input', () => {
    const file = previewInput.files[0];

    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
      const reader = new FileReader();

      reader.onload = () => {
        categoryData.preview = reader.result;
      };

      reader.onerror = () => {
        categoryData.preview = '';
        previewInput.value = '';
      };

      reader.readAsDataURL(file);
    } else {
      previewInput.value = '';
    }

    checkValues();
  });

  saveBtn.addEventListener('click', () => {
    postData('/categories', categoryData).then(() => {
      nameInput.value = '';
      previewInput.value = '';
      updateTable();
    })
  });

  container.addEventListener('click', (event) => {
    const target = event.target;

    if (target.tagName === 'BUTTON') {
      const id = target.dataset.category;

      deleteData(`/categories/${id}`).then((data) => {
        updateTable();
      });
    }
  });

  updateTable();
  checkValues();
};
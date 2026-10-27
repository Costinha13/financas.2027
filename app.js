(() => {
  'use strict';

  // The category labels and field names below are kept compatible with the
  // existing Google Sheets / Apps Script setup. We can reorganize them later.
  const categories = [
    { name: 'Alimentação', subcategories: [
      { name: 'Supermercado', fields: ['Descrição'] },
      { name: 'Restaurante', options: ['Almoço', 'Jantar', 'Lanche'] },
      { name: 'Suplementação', fields: ['Descrição'], options: ['Proteina', 'Creatina', 'Cremes para barrar', 'Aveia', 'Outros'] },
      { name: 'Capsulas de café' }
    ]},
    { name: 'Saúde', subcategories: [
      { name: 'Consulta', fields: ['Especialidade', 'Observações'] },
      { name: 'Exames', fields: ['Descrição do Exame'] },
      { name: 'Medicamentos', fields: ['Descrição dos medicamentos'] },
      { name: 'Oftalmologia', options: ['Lentes', 'Óculos', 'Outros'] },
      { name: 'Nutricionista' }
    ]},
    { name: 'Desporto', subcategories: [
      { name: 'Ginásio' },
      { name: 'Equipamento', fields: ['Descrição'], options: ['Vestuário', 'Acessórios'] },
      { name: 'Calçado', options: ['Futebol', 'Futsal', 'Desporto geral'] },
      { name: 'Padel', options: ['Aluguer de campo', 'Raquete', 'Acessórios'] }
    ]},
    { name: 'Vestuário', subcategories: [
      { name: 'Camisola' }, { name: 'Camisa' }, { name: 'Casaco' }, { name: 'Calças' },
      { name: 'Boxers' }, { name: 'Meias' }, { name: 'Polos' }, { name: 'T-shirts' },
      { name: 'Outro', fields: ['Descrição'] }
    ]},
    { name: 'Calçado', subcategories: [
      { name: 'Nike' }, { name: 'Adidas' }, { name: 'New Balance' }, { name: 'Lacoste' },
      { name: 'Outro', fields: ['Descrição'] }
    ]},
    { name: 'Automóvel', subcategories: [
      { name: 'Abastecimento', fields: ['Quilômetros Atuais', 'Litros Abastecidos'], options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Portagens', options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Seguro', options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Estacionamento', options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'IUC', options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Manutenção', fields: ['Descrição'], options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Peças', fields: ['Descrição'], options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Pneus', fields: ['Quilômetros Atuais', 'Descrição'], options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Avarias', fields: ['Descrição'], options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Multas', fields: ['Descrição'], options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] },
      { name: 'Outro', fields: ['Descrição'], options: ['Ford Fiesta', 'Toyota Celica', 'Outro'] }
    ]},
    { name: 'Casa', subcategories: [
      { name: 'Renda', fields: ['Descrição'] }, { name: 'Despesas Gerais', fields: ['Descrição'] }
    ]},
    { name: 'Lazer', subcategories: [
      { name: 'Café/Bar', fields: ['Descrição'] }, { name: 'Cinema', fields: ['Descrição'] },
      { name: 'Viagens', fields: ['Descrição'] }, { name: 'Férias', fields: ['Descrição'] },
      { name: 'Karts', fields: ['Descrição'] }
    ]},
    { name: 'Cuidados Pessoais', subcategories: [
      { name: 'Cabeleireiro', fields: ['Descrição'] }, { name: 'Depilação', fields: ['Descrição'] },
      { name: 'Perfumes', fields: ['Descrição'] }
    ]},
    { name: 'Eletrônica e tecnologia', subcategories: [
      { name: 'Computador', fields: ['Descrição'] }, { name: 'Telemóvel', fields: ['Descrição'] },
      { name: 'Eletrodoméstico', fields: ['Descrição'] }, { name: '3D Printing', fields: ['Descrição'] },
      { name: 'Outro', fields: ['Descrição'] }
    ]},
    { name: 'Jogo', subcategories: [
      { name: 'Raspadinha' }, { name: 'Euromilhões' }, { name: 'Apostas' }, { name: 'Outro' }
    ]},
    { name: 'Banco', subcategories: [
      { name: 'Manutenção de conta' }, { name: 'Comissão MBway' }, { name: 'Outro' }
    ]},
    { name: 'Investimentos', subcategories: [
      { name: 'XTB', fields: ['Descrição'] }, { name: 'PPR', fields: ['Descrição'] },
      { name: 'Outro', fields: ['Descrição'] }
    ]},
    { name: 'Outros', subcategories: [{ name: 'Prenda', fields: ['Descrição'] }] },
    { name: 'Apartamento', subcategories: [{ name: 'Outro', fields: ['Descrição'] }] }
  ];

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyq76ezXA8GFMMljz9lY8uCPgYds_rIWrtyGLDemjdRIuTBimkRBTtDaXOu5PS5yxHMmg/exec';
  const form = document.getElementById('expenseForm');
  const dateInput = document.getElementById('expenseDate');
  const amountInput = document.getElementById('expenseAmount');
  const categorySelect = document.getElementById('categorySelect');
  const subcategoryCard = document.getElementById('subcategoryCard');
  const subcategoryOptions = document.getElementById('subcategoryOptions');
  const detailCard = document.getElementById('detailCard');
  const detailHint = document.getElementById('detailHint');
  const subdetailOptions = document.getElementById('subdetailOptions');
  const extraFields = document.getElementById('extraFields');
  const submitButton = document.getElementById('submitButton');
  const buttonLabel = submitButton.querySelector('.button-label');
  const formError = document.getElementById('formError');
  const statusMessage = document.getElementById('statusMessage');
  let selectedSubcategory = null;
  let selectedDetail = '';

  function localDateString(date = new Date()) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function makeChoice(label, group, isSelected = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `choice-button${isSelected ? ' selected' : ''}`;
    button.textContent = label;
    button.setAttribute('aria-pressed', String(isSelected));
    button.dataset.group = group;
    button.dataset.value = label;
    return button;
  }

  function clearDetails() {
    selectedSubcategory = null;
    selectedDetail = '';
    subcategoryOptions.replaceChildren();
    subdetailOptions.replaceChildren();
    extraFields.replaceChildren();
    subcategoryCard.hidden = true;
    detailCard.hidden = true;
  }

  function renderExtraFields(fields = []) {
    extraFields.replaceChildren();
    fields.forEach((name) => {
      const wrapper = document.createElement('label');
      wrapper.className = 'extra-field';
      const label = document.createElement('span');
      label.textContent = name;
      const input = document.createElement('input');
      input.name = name;
      input.type = 'text';
      input.autocomplete = 'off';
      input.placeholder = name === 'Descrição' ? 'Ex.: compra ou motivo' : `Preencher ${name.toLowerCase()}`;
      if (/quilômetros/i.test(name)) input.inputMode = 'numeric';
      if (/litros/i.test(name)) input.inputMode = 'decimal';
      wrapper.append(label, input);
      extraFields.append(wrapper);
    });
  }

  function selectSubcategory(index) {
    selectedSubcategory = Number(index);
    selectedDetail = '';
    const category = categories[Number(categorySelect.value)];
    const subcategory = category?.subcategories[selectedSubcategory];
    [...subcategoryOptions.children].forEach((button, buttonIndex) => {
      const chosen = buttonIndex === selectedSubcategory;
      button.classList.toggle('selected', chosen);
      button.setAttribute('aria-pressed', String(chosen));
    });
    subdetailOptions.replaceChildren();
    (subcategory?.options || []).forEach((option) => subdetailOptions.append(makeChoice(option, 'detail')));
    detailHint.textContent = subcategory?.options?.length
      ? 'Escolhe uma opção ou completa os campos'
      : 'Completa os campos, se aplicável';
    renderExtraFields(subcategory?.fields || []);
    detailCard.hidden = !subcategory?.options?.length && !subcategory?.fields?.length;
  }

  function setMessage(element, message, type) {
    element.textContent = message;
    element.className = type === 'error' ? 'form-error' : `status-message ${type || 'success'}`;
    element.hidden = false;
  }

  function clearMessages() {
    formError.hidden = true;
    statusMessage.hidden = true;
  }

  function formPayload() {
    const category = categories[Number(categorySelect.value)];
    const subcategory = category?.subcategories[selectedSubcategory];
    const extra = {};
    extraFields.querySelectorAll('input').forEach((input) => { extra[input.name] = input.value.trim(); });
    return {
      Data: dateInput.value,
      Categoria: category?.name || '',
      Subcategoria: subcategory?.name || '',
      Subsubcategoria: selectedDetail,
      Valor: amountInput.value.trim(),
      ...extra
    };
  }

  function validate() {
    const amount = amountInput.value.trim().replace(',', '.');
    if (!dateInput.value) return 'Seleciona a data da despesa.';
    if (!amountInput.value.trim() || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return 'Introduz um valor válido, por exemplo 12,50.';
    }
    if (categorySelect.value === '') return 'Seleciona uma categoria.';
    if (selectedSubcategory === null) return 'Seleciona o tipo de despesa.';
    return '';
  }

  categorySelect.addEventListener('change', () => {
    clearMessages();
    clearDetails();
    if (categorySelect.value === '') return;
    const category = categories[Number(categorySelect.value)];
    category.subcategories.forEach((subcategory, index) => {
      subcategoryOptions.append(makeChoice(subcategory.name, 'subcategory', false));
      subcategoryOptions.lastElementChild.dataset.index = String(index);
    });
    subcategoryCard.hidden = false;
  });

  subcategoryOptions.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-group="subcategory"]');
    if (!button) return;
    clearMessages();
    selectSubcategory(button.dataset.index);
  });

  subdetailOptions.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-group="detail"]');
    if (!button) return;
    const wasSelected = button.classList.contains('selected');
    selectedDetail = wasSelected ? '' : button.dataset.value;
    [...subdetailOptions.children].forEach((option) => {
      const chosen = option === button && !wasSelected;
      option.classList.toggle('selected', chosen);
      option.setAttribute('aria-pressed', String(chosen));
    });
    clearMessages();
  });

  amountInput.addEventListener('input', clearMessages);
  dateInput.addEventListener('change', clearMessages);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessages();
    const validationMessage = validate();
    if (validationMessage) {
      setMessage(formError, validationMessage, 'error');
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add('loading');
    buttonLabel.textContent = 'A guardar…';
    try {
      // Keep the same URL-encoded field names and endpoint as the old site.
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams(formPayload()).toString()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await response.text();
      setMessage(statusMessage, 'Despesa registada com sucesso.', 'success');
      form.reset();
      dateInput.value = localDateString();
      clearDetails();
      categorySelect.value = '';
      amountInput.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Falha ao enviar despesa:', error);
      setMessage(formError, 'Não foi possível confirmar o registo. Verifica a ligação e a folha antes de tentares novamente.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
      buttonLabel.textContent = 'Registar despesa';
    }
  });

  categories.forEach((category, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = category.name;
    categorySelect.append(option);
  });
  dateInput.value = localDateString();

  const installDialog = document.getElementById('installDialog');
  document.getElementById('installHelp').addEventListener('click', () => installDialog.showModal());
  document.getElementById('closeInstall').addEventListener('click', () => installDialog.close());
  document.getElementById('closeInstallDone').addEventListener('click', () => installDialog.close());
  installDialog.addEventListener('click', (event) => {
    if (event.target === installDialog) installDialog.close();
  });
})();

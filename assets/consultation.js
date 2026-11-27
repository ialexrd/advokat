(() => {
  const topic = document.getElementById('quiz-topic');
  const questions = [
    ['С каким вопросом нужна помощь?', ['Гражданский спор', 'Уголовное дело', 'Арбитражный спор', 'Спор с государственным органом', 'Административное правонарушение', 'Нужна консультация, пока не знаю']],
    ['На каком этапе ваше дело?', ['Проблема только возникла', 'Уже есть спор с другой стороной', 'Идёт проверка или следствие', 'Дело в суде', 'Уже есть решение']],
    ['Насколько срочно нужна помощь?', ['В ближайшие дни', 'В течение недели', 'Пока изучаю варианты']],
    ['Есть ли документы по делу?', ['Есть все документы', 'Есть часть документов', 'Документов пока нет', 'Нужно уточнить, что подготовить']],
    ['Как вам удобно проконсультироваться?', ['По телефону', 'В мессенджере', 'На личной встрече', 'Онлайн']]
  ];
  if (topic) questions.splice(0, 1, JSON.parse(topic.textContent));
  const answers = [];
  let step = 0;
  const get = id => document.getElementById(id);
  const panel = get('quiz-step');
  const skip = get('quiz-skip');
  const contactForm = get('contact-booking-form');
  const contactFields = skip && contactForm ? document.createElement('fieldset') : null;
  const sendButton = get('quiz-send');
  let contactPhone;
  if (contactFields) {
    contactFields.className = 'quiz-contact-fields';
    const legend = document.createElement('legend');
    legend.textContent = 'Оставьте контакты';
    const fields = contactForm.querySelector('.contact-fields').cloneNode(true);
    const consent = contactForm.querySelector('.booking-consent').cloneNode(true);
    const note = contactForm.querySelector('.booking-note').cloneNode(true);
    note.id = 'quiz-contact-note';
    const contactSubmit = contactForm.querySelector('button[type="submit"]').cloneNode(true);
    contactSubmit.id = 'quiz-contact-submit';
    contactSubmit.setAttribute('aria-describedby', note.id);
    contactFields.append(legend, fields, contactSubmit, consent, note);
    contactPhone = fields.querySelector('[name="phone"]');
    contactPhone.addEventListener('input', () => contactPhone.setCustomValidity(''));
  }
  const categories = ['⚖', '§', '▤', '▥', '✓', '…'];
  function telegramLink(contact = []) {
    const responses = questions.flatMap(([question], index) => answers[index] ? [question + ' — ' + answers[index]] : []);
    const message = ['Здравствуйте! Хочу обратиться за консультацией.', ...contact, ...responses];
    return 'https://t.me/vary0707?text=' + encodeURIComponent(message.join('\n'));
  }

  function render() {
    const finished = step === questions.length;
    panel.replaceChildren();
    get('quiz-back').hidden = !step;
    get('quiz-next').hidden = finished;
    sendButton.hidden = !finished || Boolean(contactFields);
    if (skip) skip.hidden = finished;
    if (skip) {
      const progress = document.createElement('div');
      progress.className = 'quiz-progress';
      const current = Math.min(step + 1, questions.length);
      const position = document.createElement('span');
      position.textContent = finished ? 'Проверка ответов' : 'Вопрос ' + current + ' из ' + questions.length;
      const percentage = document.createElement('span');
      percentage.textContent = Math.round(current / questions.length * 100) + '%';
      const bar = document.createElement('progress');
      bar.max = questions.length;
      bar.value = current;
      bar.setAttribute('aria-label', 'Положение в анкете');
      progress.append(position, percentage, bar);
      panel.append(progress);
    }
    if (finished) {
      const heading = document.createElement('h3');
      heading.textContent = 'Проверьте обращение';
      const list = document.createElement('dl');
      questions.forEach(([question], index) => {
        const term = document.createElement('dt');
        const value = document.createElement('dd');
        term.textContent = question;
        value.textContent = answers[index] || 'Пропущено';
        list.append(term, value);
      });
      panel.append(heading, list);
      if (contactFields) {
        panel.append(contactFields);
      } else {
        const note = document.createElement('p');
        note.textContent = 'В Telegram откроется черновик. Можно добавить имя и контакт для ответа, затем нажать «Отправить».';
        panel.append(note);
        sendButton.href = telegramLink();
      }
    } else {
      const counter = document.createElement('small');
      counter.textContent = 'Вопрос ' + (step + 1) + ' из ' + questions.length;
      const field = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = questions[step][0];
      field.append(legend);
      const options = document.createElement('div');
      options.className = 'quiz-options';
      questions[step][1].forEach((option, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.required = true;
        input.value = option;
        input.checked = answers[step] === option;
        input.onchange = () => { answers[step] = option; };
        label.append(input);
        if (skip && step === 0 && !topic) {
          const icon = document.createElement('span');
          icon.className = 'quiz-option-icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.textContent = categories[index];
          label.append(icon);
        }
        const text = document.createElement('span');
        text.textContent = option;
        label.append(text);
        options.append(label);
      });
      field.append(options);
      if (!skip) panel.append(counter);
      panel.append(field);
      get('quiz-next').textContent = step === questions.length - 1 ? 'Проверить ответы' : 'Далее';
    }
  }
  function move(delta) {
    step += delta;
    render();
    panel.tabIndex = -1;
    panel.focus();
  }
  get('quiz-form').onsubmit = event => {
    event.preventDefault();
    if (step < questions.length) {
      if (answers[step]) move(1);
      return;
    }
    if (!contactFields || !validateBookingPhone(contactPhone)) return;
    const fields = new FormData(event.currentTarget);
    window.location.href = telegramLink([
      'Имя: ' + fields.get('name').trim(),
      'Телефон: ' + fields.get('phone').trim()
    ]);
  };
  get('quiz-back').onclick = () => move(-1);
  if (skip) skip.onclick = () => {
    delete answers[step];
    move(1);
  };
  render();
  get('quiz').hidden = false;
  if (get('quiz-entry')) get('quiz-entry').hidden = false;
})();

const booking = document.getElementById('booking');

for (const trigger of document.querySelectorAll('#booking-open, .about-button')) {
  trigger.addEventListener('click', event => {
    event.preventDefault();
    booking.showModal();
  });
}

document.getElementById('booking-close').addEventListener('click', () => booking.close());
for (const bookingForm of document.querySelectorAll('#booking-form, #contact-booking-form')) {
  const bookingPhone = bookingForm.elements.phone;
  bookingPhone.addEventListener('input', () => bookingPhone.setCustomValidity(''));

  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(bookingForm);
    const phone = fields.get('phone').trim();
    const digits = phone.replace(/\D/g, '');
    if (!/^\+?[0-9 ()-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
      bookingPhone.setCustomValidity('Введите номер телефона с кодом города или страны.');
      bookingPhone.reportValidity();
      return;
    }

    const message = [
      'Здравствуйте! Хочу записаться на консультацию.',
      'Имя: ' + fields.get('name').trim(),
      'Телефон: ' + phone
    ];
    const question = fields.get('question').trim();
    if (question) message.push('Вопрос: ' + question);

    window.location.href = 'https://t.me/vary0707?text=' + encodeURIComponent(message.join('\n'));
  });
}

if (new URLSearchParams(window.location.search).get('zapis') === '1') booking.showModal();

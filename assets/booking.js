const booking = document.getElementById('booking');

for (const trigger of document.querySelectorAll('#booking-open, .about-button')) {
  trigger.addEventListener('click', event => {
    event.preventDefault();
    booking.showModal();
  });
}

document.getElementById('booking-close').addEventListener('click', () => booking.close());

function validateBookingPhone(input) {
  const phone = input.value.trim();
  const digits = phone.replace(/\D/g, '');
  const valid = /^\+?[0-9 ()-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
  input.setCustomValidity(valid ? '' : 'Введите номер телефона с кодом города или страны.');
  if (!valid) input.reportValidity();
  return valid;
}

for (const bookingForm of document.querySelectorAll('#booking-form, #contact-booking-form')) {
  const bookingPhone = bookingForm.elements.phone;
  bookingPhone.addEventListener('input', () => bookingPhone.setCustomValidity(''));

  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateBookingPhone(bookingPhone)) return;
    const fields = new FormData(bookingForm);
    const phone = fields.get('phone').trim();

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

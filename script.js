const screens = [...document.querySelectorAll('.screen')];
const audio = document.getElementById('our-song');
const musicStatus = document.getElementById('music-status');
const musicToggle = document.getElementById('music-toggle');
const memoryImage = document.getElementById('memory-image');
const memoryFrame = document.getElementById('memory-frame');
const modal = document.getElementById('coupon-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalEyebrow = document.getElementById('modal-eyebrow');
const hasAudioSource = Boolean(audio && (audio.getAttribute('src') || audio.querySelector('source[src]')));

function setMusicPlaying(isPlaying) {
  musicToggle.textContent = isPlaying ? 'Ⅱ' : '▶';
  musicToggle.setAttribute('aria-label', isPlaying ? 'Поставить музыку на паузу' : 'Включить музыку');
  if (isPlaying) musicStatus.textContent = 'Сейчас играет наша песня';
}

function playOurSong() {
  if (!hasAudioSource) {
    musicStatus.textContent = 'Музыкальный файл не найден';
    return;
  }
  musicToggle.disabled = false;
  musicStatus.textContent = 'Запускаем нашу песню…';
  const playAttempt = audio.play();
  if (playAttempt && typeof playAttempt.then === 'function') {
    playAttempt.then(() => setMusicPlaying(true)).catch((error) => {
      setMusicPlaying(false);
      musicStatus.textContent = error && error.name === 'NotAllowedError'
        ? 'Нажми ▶, чтобы разрешить воспроизведение'
        : 'Не удалось загрузить песню. Нажми ▶ или проверь файл на GitHub';
    });
  } else {
    setMusicPlaying(true);
  }
}

const coupons = {
  ring: {
    eyebrow: 'КУПОН № 01 · ОСОБЕННЫЙ',
    title: 'Любое кольцо, которое пожелаешь',
    description: 'Выбираем вместе именно то кольцо, от которого у тебя загорятся глаза. Без спешки, сомнений и ограничений с моей стороны. Этот подарок — мой способ сказать «я бы выбрал тебя снова».'
  },
  date: {
    eyebrow: 'КУПОН № 02 · ВПЕЧАТЛЕНИЯ',
    title: 'Свидание-сюрприз',
    description: 'Я полностью организую наш вечер: место, настроение, детали и маленький сюрприз. Тебе останется только красиво улыбаться и провести это время со мной.'
  },
  rest: {
    eyebrow: 'КУПОН № 03 · ЗАБОТА',
    title: 'День полного отдыха',
    description: 'Один день без бытовых забот и обязательных дел. Я беру всё на себя, а ты отдыхаешь так, как хочется именно тебе.'
  },
  massage: {
    eyebrow: 'КУПОН № 04 · НЕЖНОСТЬ',
    title: 'Массаж без спешки',
    description: 'Время для расслабления, заботы и внимания. Продолжительность и настроение выбираешь ты. Купон действует тогда, когда тебе захочется.'
  },
  trip: {
    eyebrow: 'КУПОН № 05 · ПРИКЛЮЧЕНИЕ',
    title: 'Маленькое путешествие',
    description: 'Выбираем направление и устраиваем небольшое приключение для нас двоих. Новые места, совместные фотографии и ещё одно воспоминание в нашу копилку.'
  },
  wish: {
    eyebrow: 'КУПОН № 06 · ТВОЁ ЖЕЛАНИЕ',
    title: 'Исполнение одного желания',
    description: 'Одно твоё желание, которое я постараюсь исполнить с радостью. Главное условие — оно должно сделать тебя счастливее.'
  }
};

function showScreen(id) {
  screens.forEach((screen) => {
    const active = screen.id === id;
    screen.hidden = !active;
    screen.classList.toggle('is-active', active);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('yes-button').addEventListener('click', () => {
  showScreen('yes-page');
  // Источник задан вложенным <source>, поэтому проверяем и его, а не только audio[src].
  // play() вызывается непосредственно после нажатия — это важно для iOS Safari.
  playOurSong();
});

document.getElementById('no-button').addEventListener('click', () => showScreen('no-page'));
document.getElementById('gift-button').addEventListener('click', () => showScreen('gifts-page'));
document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => showScreen(button.dataset.go));
});

memoryImage.addEventListener('load', () => memoryFrame.classList.add('has-image'));
memoryImage.addEventListener('error', () => memoryFrame.classList.remove('has-image'));
if (memoryImage.complete && memoryImage.naturalWidth > 0) memoryFrame.classList.add('has-image');

musicToggle.addEventListener('click', () => {
  if (audio.paused) {
    playOurSong();
  } else {
    audio.pause();
    setMusicPlaying(false);
    musicStatus.textContent = 'Музыка на паузе';
  }
});

audio.addEventListener('playing', () => setMusicPlaying(true));
audio.addEventListener('pause', () => {
  if (!audio.ended) setMusicPlaying(false);
});
audio.addEventListener('error', () => {
  musicToggle.disabled = false;
  setMusicPlaying(false);
  musicStatus.textContent = 'Не удалось загрузить MP3. Проверь, что assets/our-song.mp3 загружен на GitHub';
});

audio.addEventListener('ended', () => {
  setMusicPlaying(false);
  musicStatus.textContent = 'Наша песня закончилась';
});

document.querySelectorAll('[data-coupon]').forEach((button) => {
  button.addEventListener('click', () => {
    const coupon = coupons[button.dataset.coupon];
    if (!coupon) return;
    modalEyebrow.textContent = coupon.eyebrow;
    modalTitle.textContent = coupon.title;
    modalDescription.textContent = coupon.description;
    modal.hidden = false;
    document.getElementById('modal-close').focus();
  });
});

function closeModal() {
  modal.hidden = true;
}
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-accept').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

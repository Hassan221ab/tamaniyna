// --- إدارة الوضع الداكن والنهاري ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  if (themeToggleBtn) themeToggleBtn.textContent = '☀️ الوضع الفاتح';
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    let theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    themeToggleBtn.textContent = theme === 'dark' ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن';
    localStorage.setItem('theme', theme);
  });
}

// --- مراقبة الاتصال (Offline First) ---
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;
  banner.style.display = navigator.onLine ? 'none' : 'block';
}
updateOnlineStatus();

// --- الوقت الحالي ---
function updateCurrentTime() {
  const timeDisplay = document.getElementById('current-time');
  if (!timeDisplay) return;
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12;
  timeDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// --- آية اليوم المتجددة تلقائياً ---
const dailyVerses = [
  { text: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", ref: "سورة الضحى (5)" },
  { text: "إِنَّ مَعَ العُسْرِ يُسْرًا", ref: "سورة الشرح (6)" },
  { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ القُلُوبُ", ref: "سورة الرعد (28)" },
  { text: "وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا", ref: "سورة الطور (48)" },
  { text: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", ref: "سورة الطلاق (2-3)" }
];

function loadDailyVerse() {
  const textEl = document.getElementById('verse-text');
  const refEl = document.getElementById('verse-ref');
  if (!textEl || !refEl) return;
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const selected = dailyVerses[dayOfYear % dailyVerses.length];
  textEl.textContent = `"${selected.text}"`;
  refEl.textContent = `[${selected.ref}]`;
}
loadDailyVerse();

// --- المساعد الروحي الذكي ---
const aiResponses = {
  قلق: "قال تعالى: ﴿الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ القُلُوبُ﴾. استغفر الله كثيراً، وردد: (حسبي الله ونعم الوكيل).",
  ضيق: "قال تعالى: ﴿فَإِنَّ مَعَ العُسْرِ يُسْرًا إنَّ مَعَ العُسْرِ يُسْرًا﴾. تذكر أن مع العسر يسرين ولن يغلب عسر يسرين.",
  شكر: "قال تعالى: ﴿لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾. ردد بقلبك: (الحمد لله حمداً كثيراً طيباً مباركاً فيه).",
  رزق: "عليك بالاستغفار، فمن لزم الاستغفار جعل الله له من كل هم فرجاً ومن كل ضيق مخرجاً ورزقه من حيث لا يحتسب."
};

document.querySelectorAll('.ai-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const mood = chip.getAttribute('data-mood');
    const box = document.getElementById('ai-response-box');
    const text = document.getElementById('ai-response-text');
    if (box && text) {
      text.textContent = aiResponses[mood];
      box.style.display = 'block';
    }
  });
});

// --- مواقيت الصلاة والعد التنازلي ---
function getPrayerTimesAndHijri() {
  const prayerGrid = document.getElementById('prayer-times-grid');
  const hijriDisplay = document.getElementById('hijri-date');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchTimings(pos.coords.latitude, pos.coords.longitude),
      () => fetchTimingsByCity('Jerusalem', 'Palestine')
    );
  } else {
    fetchTimingsByCity('Jerusalem', 'Palestine');
  }

  async function fetchTimings(lat, lng) {
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=5`);
      const data = await res.json();
      renderPrayerAndHijri(data.data);
    } catch (e) {
      if (prayerGrid) prayerGrid.innerHTML = '<p class="placeholder">تعذر جلب الأوقات.</p>';
    }
  }

  async function fetchTimingsByCity(city, country) {
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`);
      const data = await res.json();
      renderPrayerAndHijri(data.data);
    } catch (e) {
      if (prayerGrid) prayerGrid.innerHTML = '<p class="placeholder">تعذر جلب الأوقات.</p>';
    }
  }

  function renderPrayerAndHijri(data) {
    const timings = data.timings;
    const hijri = data.date.hijri;
    if (hijriDisplay) hijriDisplay.textContent = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

    function format12h(t24) {
      const [h, m] = t24.split(':');
      let hours = parseInt(h, 10);
      const ampm = hours >= 12 ? 'م' : 'ص';
      hours = hours % 12 || 12;
      return `${hours}:${m} ${ampm}`;
    }

    const mainPrayers = { Fajr: "الفجر", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" };
    if (prayerGrid) {
      prayerGrid.innerHTML = '';
      for (let [key, name] of Object.entries(mainPrayers)) {
        prayerGrid.innerHTML += `
          <div class="prayer-item">
            <span class="name">${name}</span>
            <span class="time">${format12h(timings[key])}</span>
          </div>`;
      }
    }
    calculateNextPrayer(timings);
  }
}

function calculateNextPrayer(timings) {
  const countdownEl = document.getElementById('next-prayer-countdown');
  if (!countdownEl) return;
  const now = new Date();
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerKeys = [
    { key: 'Fajr', name: 'الفجر' },
    { key: 'Dhuhr', name: 'الظهر' },
    { key: 'Asr', name: 'العصر' },
    { key: 'Maghrib', name: 'المغرب' },
    { key: 'Isha', name: 'العشاء' }
  ];

  let nextPrayerName = '';
  let timeDifferenceMinutes = Infinity;

  for (let p of prayerKeys) {
    const timeStr = timings[p.key];
    if (!timeStr) continue;
    const [pHour, pMin] = timeStr.split(':').map(Number);
    const pTotalMinutes = pHour * 60 + pMin;
    if (pTotalMinutes > currentTimeMinutes) {
      nextPrayerName = p.name;
      timeDifferenceMinutes = pTotalMinutes - currentTimeMinutes;
      break;
    }
  }

  if (timeDifferenceMinutes === Infinity) {
    const [fHour, fMin] = timings['Fajr'].split(':').map(Number);
    timeDifferenceMinutes = (24 * 60 - currentTimeMinutes) + (fHour * 60 + fMin);
    nextPrayerName = 'الفجر (غداً)';
  }

  const hoursLeft = Math.floor(timeDifferenceMinutes / 60);
  const minutesLeft = timeDifferenceMinutes % 60;
  countdownEl.textContent = `متبقي لـ ${nextPrayerName}: ${hoursLeft > 0 ? hoursLeft + 'س و ' : ''}${minutesLeft}د`;
}

// --- القرآن الكريم وحفظ التقدم ---
const surahSelect = document.getElementById('surah-select');
const readerSelect = document.getElementById('reader-select');
const surahContainer = document.getElementById('surah-container');
const quranAudio = document.getElementById('quran-audio');
const audioStatus = document.getElementById('audio-status');
const savedProgressBanner = document.getElementById('saved-progress-banner');
const progressText = document.getElementById('progress-text');
const resumeProgressBtn = document.getElementById('resume-progress-btn');

async function loadSurahList() {
  if (!surahSelect) return;
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await res.json();
    data.data.forEach(surah => {
      const option = document.createElement('option');
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.name}`;
      surahSelect.appendChild(option);
    });
    checkSavedProgress();
  } catch (e) {}
}

function checkSavedProgress() {
  const saved = localStorage.getItem('quran_progress');
  if (saved && savedProgressBanner && progressText) {
    const data = JSON.parse(saved);
    progressText.textContent = `متابعة سورة رقم ${data.surahNum} (الآية ${data.ayahNum})`;
    savedProgressBanner.style.display = 'flex';
  }
}

if (resumeProgressBtn) {
  resumeProgressBtn.addEventListener('click', () => {
    const saved = localStorage.getItem('quran_progress');
    if (saved) {
      const data = JSON.parse(saved);
      surahSelect.value = data.surahNum;
      loadSurahData(data.surahNum);
      savedProgressBanner.style.display = 'none';
    }
  });
}

async function loadSurahData(targetSurahNum = null) {
  const surahNum = targetSurahNum || (surahSelect ? surahSelect.value : '');
  const reader = readerSelect ? readerSelect.value : 'ar.alafasy';

  if (!surahNum) {
    if (surahContainer) surahContainer.innerHTML = '<p class="placeholder-text">اختر سورة للبدء بالقراءة والاستماع...</p>';
    if (quranAudio) quranAudio.src = '';
    return;
  }

  if (surahContainer) surahContainer.innerHTML = '<p class="placeholder-text">جاري التحميل...</p>';
  if (audioStatus) audioStatus.textContent = 'جاري إعداد الصوت والنص...';

  try {
    const textRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-simple-enhanced`);
    const textData = await textRes.json();

    let html = '';
    textData.data.ayahs.forEach(ayah => {
      html += `<span class="ayah" onclick="saveProgress(${surahNum}, ${ayah.numberInSurah})" title="انقر لحفظ مكان التوقف">${ayah.text} <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span></span> `;
    });
    if (surahContainer) surahContainer.innerHTML = html;

    const formattedSurah = String(surahNum).padStart(3, '0');
    let audioUrl = `https://server8.mp3quran.net/afs/${formattedSurah}.mp3`;
    if (reader === 'ar.minshawi') audioUrl = `https://server10.mp3quran.net/minsh/${formattedSurah}.mp3`;
    else if (reader === 'ar.husary') audioUrl = `https://server13.mp3quran.net/husr/${formattedSurah}.mp3`;
    else if (reader === 'ar.abdulbasitmurattal') audioUrl = `https://server7.mp3quran.net/basit/${formattedSurah}.mp3`;

    if (quranAudio) {
      quranAudio.src = audioUrl;
      quranAudio.load();
    }
    if (audioStatus) audioStatus.textContent = `جاهز للتشغيل (انقر على أي آية لحفظ موضعك)`;
  } catch (err) {
    if (surahContainer) surahContainer.innerHTML = '<p class="placeholder-text">تعذر جلب بيانات السورة.</p>';
  }
}

function saveProgress(surahNum, ayahNum) {
  localStorage.setItem('quran_progress', JSON.stringify({ surahNum, ayahNum }));
  alert(`تم حفظ موضع القراءة بنجاح عند السورة رقم ${surahNum}، الآية ${ayahNum}`);
  checkSavedProgress();
}

if (surahSelect) surahSelect.addEventListener('change', () => loadSurahData());
if (readerSelect) readerSelect.addEventListener('change', () => loadSurahData());

// --- الأحاديث الشريفة (موسعة) ---
const hadithText = document.getElementById('hadith-text');
const hadithInfo = document.getElementById('hadith-info');
const nextHadithBtn = document.getElementById('next-hadith-btn');
const stars = document.querySelectorAll('.star');

const hadithsList = [
  { text: "عَنْ أَمِيرِ الْمُؤْمِنِينَ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى».", info: "رواه البخاري ومسلم" },
  { text: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ».", info: "رواه البخاري ومسلم" },
  { text: "عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ عَنْ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ».", info: "رواه البخاري ومسلم" },
  { text: "عَنْ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: كُنْتُ خَلْفَ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَوْمًا فَقَالَ: «يَا غُلَامُ إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظْ اللَّهَ يَحْفَظْكَ».", info: "رواه الترمذي وقال: حسن صحيح" },
  { text: "عَنْ أَبِي مَسْعُودٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلَامِ النُّبُوَّةِ الأُولَى: إِذَا لَمْ تَسْتَحْيِ فَاصْنَعْ مَا شِئْتَ».", info: "رواه البخاري" }
];

let currentHadithIndex = 0;
let ratings = {};

function updateStarVisuals(rating) {
  stars.forEach(star => {
    const val = parseInt(star.getAttribute('data-value'));
    if (val <= rating) star.classList.add('active');
    else star.classList.remove('active');
  });
}

stars.forEach(star => {
  star.addEventListener('click', () => {
    const val = parseInt(star.getAttribute('data-value'));
    ratings[currentHadithIndex] = val;
    updateStarVisuals(val);
  });
});

function displayHadith(index) {
  if (!hadithText || !hadithInfo) return;
  hadithText.textContent = hadithsList[index].text;
  hadithInfo.textContent = hadithsList[index].info;
  updateStarVisuals(ratings[index] || 0);
}

if (nextHadithBtn) {
  nextHadithBtn.addEventListener('click', () => {
    currentHadithIndex = (currentHadithIndex + 1) % hadithsList.length;
    displayHadith(currentHadithIndex);
  });
}

// --- الأذكار (الصباح والمساء) ---
const sabahBtn = document.getElementById('sabah-btn');
const massaBtn = document.getElementById('massa-btn');
const azkarDisplay = document.getElementById('azkar-display');

const azkarData = {
  sabah: [
    { text: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", count: "مرة واحدة" },
    { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", count: "مرة واحدة" },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ.", count: "ثلاث مرات" }
  ],
  massa: [
    { text: "أَمْسَيْنَا وَأَمْسَى المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", count: "مرة واحدة" },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ المَصِيرُ.", count: "مرة واحدة" }
  ]
};

function renderAzkar(type) {
  if (!azkarDisplay) return;
  let html = '';
  azkarData[type].forEach(item => {
    html += `<div style="padding: 12px 0; border-bottom: 1px solid var(--card-border);"><p style="font-size: 1.05rem; margin-bottom: 5px; line-height: 1.7;">${item.text}</p><span style="color: var(--primary-color); font-size: 0.9rem; font-weight: bold;">التكرار: ${item.count}</span></div>`;
  });
  azkarDisplay.innerHTML = html;
}

if (sabahBtn && massaBtn) {
  sabahBtn.addEventListener('click', () => {
    sabahBtn.classList.add('active');
    sabahBtn.style.background = 'var(--primary-color)';
    massaBtn.classList.remove('active');
    massaBtn.classList.add('btn-secondary');
    renderAzkar('sabah');
  });
  massaBtn.addEventListener('click', () => {
    massaBtn.classList.add('active');
    massaBtn.style.background = 'var(--primary-color)';
    sabahBtn.classList.remove('active');
    sabahBtn.classList.add('btn-secondary');
    renderAzkar('massa');
  });
}

// --- المسبحة الإلكترونية ---
let tasbihCount = 0;
const tasbihDisplay = document.getElementById('tasbih-count');
const tasbihCircle = document.getElementById('tasbih-btn-circle');
const tasbihReset = document.getElementById('tasbih-reset');
const tasbihSelect = document.getElementById('tasbih-select');
const tasbihDisplayText = document.getElementById('tasbih-display-text');

if (tasbihSelect) {
  tasbihSelect.addEventListener('change', (e) => {
    tasbihDisplayText.textContent = e.target.value;
    tasbihCount = 0;
    if (tasbihDisplay) tasbihDisplay.textContent = tasbihCount;
  });
}

if (tasbihCircle) {
  tasbihCircle.addEventListener('click', () => {
    tasbihCount++;
    if (tasbihDisplay) tasbihDisplay.textContent = tasbihCount;
    tasbihCircle.style.transform = 'scale(0.95)';
    setTimeout(() => { tasbihCircle.style.transform = 'scale(1)'; }, 100);
    if (navigator.vibrate) navigator.vibrate(40);
  });
}

if (tasbihReset) {
  tasbihReset.addEventListener('click', () => {
    tasbihCount = 0;
    if (tasbihDisplay) tasbihDisplay.textContent = tasbihCount;
  });
}

// --- بوصلة القبلة ---
function initQiblaCompass() {
  const qiblaArrow = document.getElementById('qibla-arrow');
  const qiblaStatus = document.getElementById('qibla-status');
  if (!navigator.geolocation) {
    if (qiblaStatus) qiblaStatus.textContent = "الموقع الجغرافي غير مدعوم في متصفحك.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const kaabaLat = 21.4225, kaabaLng = 39.8262;
      const phiK = (kaabaLat * Math.PI) / 180, lambdaK = (kaabaLng * Math.PI) / 180;
      const phi = (lat * Math.PI) / 180, lambda = (lng * Math.PI) / 180;
      const y = Math.sin(lambdaK - lambda);
      const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
      let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);
      qiblaAngle = (qiblaAngle + 360) % 360;
      if (qiblaStatus) qiblaStatus.textContent = `تم تحديد اتجاه القبلة بنجاح (زاوية ${qiblaAngle.toFixed(1)}°).`;
      if (qiblaArrow) qiblaArrow.style.transform = `rotate(${qiblaAngle}deg)`;
    },
    () => { if (qiblaStatus) qiblaStatus.textContent = "يرجى السماح بالوصول للموقع لحساب اتجاه القبلة."; }
  );
}

// --- الأدعية (موسوعة واسعة) ---
const duaBtns = document.querySelectorAll('.tab-btn-dua');
const duaDisplay = document.getElementById('dua-display');

const duaData = {
  rizq: [
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.",
    "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ.",
    "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ."
  ],
  prophetic: [
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
    "اللَّهُمَّ إنِّي أسْأَلُكَ الهُدَى والتُّقَى، والعَفَافَ والغِنَى.",
    "اللَّهُمَّ مقلّب القلوب ثبّت قلبي على دينك."
  ],
  specific: [
    "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لي شَأْنِي كُلَّهُ.",
    "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ."
  ]
};

function renderDua(type) {
  if (!duaDisplay) return;
  duaDisplay.innerHTML = duaData[type].map(d => `<p style="padding: 12px 0; border-bottom: 1px solid var(--card-border); font-size: 1.05rem; line-height: 1.7;">${d}</p>`).join('');
}

duaBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    duaBtns.forEach(b => {
      b.classList.remove('active');
      b.classList.add('btn-secondary');
    });
    e.target.classList.add('active');
    e.target.classList.remove('btn-secondary');
    renderDua(e.target.getAttribute('data-type'));
  });
});

// التشغيل الأولي
document.addEventListener('DOMContentLoaded', () => {
  getPrayerTimesAndHijri();
  loadSurahList();
  displayHadith(0);
  renderAzkar('sabah');
  renderDua('rizq');
  initQiblaCompass();

  let visits = Number(localStorage.getItem('visit_count') || 0) + 1;
  localStorage.setItem('visit_count', visits);
  const counterElement = document.getElementById('count');
  if (counterElement) counterElement.innerText = visits;
});
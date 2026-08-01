function updateCurrentTime() {
  const timeDisplay = document.getElementById('current-time');
  if (!timeDisplay) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'م' : 'ص';

  hours = hours % 12;
  hours = hours ? hours : 12;

  timeDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

function getPrayerTimesAndHijri() {
  const prayerGrid = document.getElementById('prayer-times-grid');
  const hijriDisplay = document.getElementById('hijri-date');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => fetchTimings(position.coords.latitude, position.coords.longitude),
      () => fetchTimingsByCity('Jerusalem', 'Palestine')
    );
  } else {
    fetchTimingsByCity('Jerusalem', 'Palestine');
  }

  async function fetchTimings(lat, lng) {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=5`);
      const data = await response.json();
      renderPrayerAndHijri(data.data);
    } catch (e) {
      if (prayerGrid) prayerGrid.innerHTML = '<p class="placeholder">تعذر جلب الأوقات.</p>';
    }
  }

  async function fetchTimingsByCity(city, country) {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`);
      const data = await response.json();
      renderPrayerAndHijri(data.data);
    } catch (e) {
      if (prayerGrid) prayerGrid.innerHTML = '<p class="placeholder">تعذر جلب الأوقات.</p>';
    }
  }

  function renderPrayerAndHijri(data) {
    const timings = data.timings;
    const hijri = data.date.hijri;

    if (hijriDisplay) hijriDisplay.textContent = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

    function format12h(time24) {
      const [h, m] = time24.split(':');
      let hours = parseInt(h, 10);
      const ampm = hours >= 12 ? 'م' : 'ص';
      hours = hours % 12;
      hours = hours ? hours : 12;
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
  }
}

const surahSelect = document.getElementById('surah-select');
const readerSelect = document.getElementById('reader-select');
const surahContainer = document.getElementById('surah-container');
const quranAudio = document.getElementById('quran-audio');
const audioStatus = document.getElementById('audio-status');

async function loadSurahList() {
  if (!surahSelect) return;
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    data.data.forEach(surah => {
      const option = document.createElement('option');
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.name}`;
      surahSelect.appendChild(option);
    });
  } catch (e) {}
}

async function loadSurahData() {
  const surahNum = surahSelect ? surahSelect.value : '';
  const reader = readerSelect ? readerSelect.value : 'ar.alafasy';

  if (!surahNum) {
    if (surahContainer) surahContainer.innerHTML = '<p class="placeholder-text">اختر سورة للبدء بالقراءة والاستماع...</p>';
    if (quranAudio) quranAudio.src = '';
    if (audioStatus) audioStatus.textContent = 'جاهز للتشغيل';
    return;
  }

  if (surahContainer) surahContainer.innerHTML = '<p class="placeholder-text">جاري التحميل...</p>';
  if (audioStatus) audioStatus.textContent = 'جاري إعداد الصوت والنص...';

  try {
    const textRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-simple-enhanced`);
    const textData = await textRes.json();

    let html = '';
    textData.data.ayahs.forEach(ayah => {
      html += `<span class="ayah">${ayah.text} <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span></span> `;
    });
    if (surahContainer) surahContainer.innerHTML = html;

    let audioUrl = '';
    const formattedSurah = String(surahNum).padStart(3, '0');

    if (reader === 'ar.minshawi') {
      audioUrl = `https://server10.mp3quran.net/minsh/${formattedSurah}.mp3`;
    } else if (reader === 'ar.husary') {
      audioUrl = `https://server13.mp3quran.net/husr/${formattedSurah}.mp3`;
    } else if (reader === 'ar.abdulbasitmurattal') {
      audioUrl = `https://server7.mp3quran.net/basit/${formattedSurah}.mp3`;
    } else {
      audioUrl = `https://server8.mp3quran.net/afs/${formattedSurah}.mp3`;
    }

    if (quranAudio) {
      quranAudio.src = audioUrl;
      quranAudio.load();
    }
    if (audioStatus) audioStatus.textContent = `جاهز للتشغيل بصوت القارئ المختار`;
  } catch (err) {
    if (surahContainer) surahContainer.innerHTML = '<p class="placeholder-text">حدث خطأ أثناء جلب السورة.</p>';
  }
}

if (surahSelect) surahSelect.addEventListener('change', loadSurahData);
if (readerSelect) readerSelect.addEventListener('change', loadSurahData);

const hadithText = document.getElementById('hadith-text');
const hadithInfo = document.getElementById('hadith-info');
const nextHadithBtn = document.getElementById('next-hadith-btn');
const stars = document.querySelectorAll('.star');

const hadithsList = [
  { text: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».", info: "رواه البخاري ومسلم" },
  { text: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ».", info: "رواه البخاري ومسلم" },
  { text: "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ».", info: "رواه البخاري ومسلم" }
];

let currentHadithIndex = 0;
let ratings = {};

function setRating(rating) {
  ratings[currentHadithIndex] = rating;
  updateStarVisuals(rating);
}

function updateStarVisuals(rating) {
  stars.forEach(star => {
    const val = parseInt(star.getAttribute('data-value'));
    if (val <= rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

stars.forEach(star => {
  star.addEventListener('click', () => {
    setRating(parseInt(star.getAttribute('data-value')));
  });
});

function displayHadith(index) {
  if (!hadithText || !hadithInfo) return;
  const selected = hadithsList[index];
  hadithText.textContent = selected.text;
  hadithInfo.textContent = selected.info;
  updateStarVisuals(ratings[index] || 0);
}

if (nextHadithBtn) {
  nextHadithBtn.addEventListener('click', () => {
    currentHadithIndex = (currentHadithIndex + 1) % hadithsList.length;
    displayHadith(currentHadithIndex);
  });
}

const sabahBtn = document.getElementById('sabah-btn');
const massaBtn = document.getElementById('massa-btn');
const azkarDisplay = document.getElementById('azkar-display');

const azkarData = {
  sabah: [
    { text: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", count: "مرة واحدة" },
    { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", count: "مرة واحدة" },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.", count: "ثلاث مرات" }
  ],
  massa: [
    { text: "أَمْسَيْنَا وَأَمْسَى المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", count: "مرة واحدة" },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ المَصِيرُ.", count: "مرة واحدة" },
    { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", count: "ثلاث مرات" }
  ]
};

function renderAzkar(type) {
  if (!azkarDisplay) return;
  let html = '';
  azkarData[type].forEach(item => {
    html += `<div style="padding: 12px 0; border-bottom: 1px solid #eee;"><p style="font-size: 1.05rem; margin-bottom: 5px;">${item.text}</p><span style="color: #2d6a4f; font-size: 0.9rem; font-weight: bold;">التكرار: ${item.count}</span></div>`;
  });
  azkarDisplay.innerHTML = html;
}

if (sabahBtn && massaBtn) {
  sabahBtn.addEventListener('click', () => {
    sabahBtn.classList.add('active');
    massaBtn.classList.remove('active');
    renderAzkar('sabah');
  });
  massaBtn.addEventListener('click', () => {
    massaBtn.classList.add('active');
    sabahBtn.classList.remove('active');
    renderAzkar('massa');
  });
}

const duaBtns = document.querySelectorAll('.tab-btn-dua');
const duaDisplay = document.getElementById('dua-display');
const duaData = {
  rizq: [
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.",
    "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ."
  ],
  prophetic: [
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى."
  ],
  specific: [
    "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
    "رَبِّ اشْرَحْ لي صَدْرِي، وَيَسِّرْ لي أَمْرِي، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلي."
  ]
};

function renderDua(type) {
  if (!duaDisplay) return;
  duaDisplay.innerHTML = duaData[type].map(d => `<p style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 1.05rem;">${d}</p>`).join('');
}

duaBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    duaBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderDua(e.target.getAttribute('data-type'));
  });
});
document.addEventListener('DOMContentLoaded', () => {
    getPrayerTimesAndHijri();
    loadSurahList();
    displayHadith(0);
    renderAzkar('sabah');
    renderDua('rizq');

    // --- أضف كود عداد الزوار هنا ---
    let visits = localStorage.getItem('visit_count');
    if (!visits) {
        visits = 1;
    } else {
        visits = Number(visits) + 1;
    }
    localStorage.setItem('visit_count', visits);
    
    const counterElement = document.getElementById('count');
    if (counterElement) {
        counterElement.innerText = visits;
    }
});
// --- كود عداد المشرف الخاص بك وحدك ---
document.addEventListener("DOMContentLoaded", function () {
    let myVisits = localStorage.getItem('my_private_visits');
    if (!myVisits) {
        myVisits = 1;
    } else {
        myVisits = Number(myVisits) + 1;
    }
    localStorage.setItem('my_private_visits', myVisits);

    const adminBox = document.getElementById('admin-counter-box');
    const adminCount = document.getElementById('admin-count');

    // يظهر العداد فقط إذا فتحت الرابط الخاص بالمشرف
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin') && adminBox && adminCount) {
        adminBox.style.display = 'block';
        adminCount.innerText = myVisits;
    }
});
document.addEventListener('DOMContentLoaded', () => {
  getPrayerTimesAndHijri();
  loadSurahList();
  displayHadith(0);
  renderAzkar('sabah');
  renderDua('rizq');
});

/* =================================================ُ=========
   1. الثوابت والمتغيرات العامة والتخزين المحلي
   ========================================================== */
let currentTimeInterval = null;
let currentHijriDate = "";
let countdownInterval = null;
let currentPrayerTimes = null;

// قاعدة بيانات الأحاديث (كاملة وموسعة)
const hadithsList = [
  {
    text: "عَنْ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: كُنْتُ خَلْفَ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَوْماً فَقَالَ: «يَا غُلَامُ إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظْ اللَّهَ يَحْفَظْكَ، احْفَظْ اللَّهَ تَجِدْه تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلْ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ، وَاعْلَمْ أَنَّ الأُمَّةَ لَوْ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ، وَلَوْ اجْتَمَعَتْ عَلَى أَنْ يَضُرُّوكَ بِشَيْءٍ لَمْ يَضُرُّوكَ إِلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْكَ، رُفِعَتْ الأَقْلَامُ وَجَفَّتْ الصُّحُفُ».",
    source: "رواه الترمذي وقال: حسن صحيح"
  },
  {
    text: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ، عَنْ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ يَسَّرَ اللَّهُ عَلَيْهِ فِي الدُّنْيَا وَالْآخِرَةِ، وَمَنْ سَتَرَ مُسْلِماً سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالْآخِرَةِ، وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ».",
    source: "رواه مسلم"
  },
  {
    text: "عَنْ أَبِي ذَرٍّ جُنْدُبِ بْنِ جُنَادَةَ، وَأَبِي عَبْدِ الرَّحْمَنِ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللَّهُ عَنْهُمَا، عَنْ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ».",
    source: "رواه الترمذي وقال: حسن صحيح"
  },
  {
    text: "عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ خَادِمِ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، عَنْ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ».",
    source: "رواه البخاري ومسلم"
  },
  {
    text: "عَنْ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّ الْحَلَالَ بَيِّنٌ، وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا مُشْتَبِهَاتٌ لَا يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ، وَمَنْ وَقَعَ فِي الشُّبُهَاتِ وَقَعَ فِي الْحَرَامِ».",
    source: "رواه البخاري ومسلم"
  }
];

let currentHadithIndex = 0;

// محتوى الأذكار
const azkarData = {
  sabah: [
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...", count: 1 },
    { text: "اللَّهُمَّ بِمَاصَبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", count: 1 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (مائة مرة)", count: 100 }
  ],
  massa: [
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.", count: 1 },
    { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ...", count: 1 }
  ]
};

// موسوعة الأدعية
const duasData = {
  rizq: [
    "«اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ».",
    "«اللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقاً طَيِّباً، وَعِلْماً نَافِعاً، وَعَمَلاً مُتَقَبَّلاً».",
    "«رَبِّ إنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ»."
  ],
  prophetic: [
    "«رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ».",
    "«اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَغَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ».",
    "«يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ»."
  ],
  specific: [
    "«اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ».",
    "«رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي».",
    "«حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ، عَلَى اللَّهِ تَوَكَّلْنَا»."
  ]
};

/* ==========================================================
   2. التهيئة العامة عند تحميل الصفحة
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initThemeToggle();
  initAiCompanion();
  loadPrayerTimes();
  initQuranSection();
  initHadithSection();
  initAzkarSection();
  initTasbihSection();
  initQiblaCompass();
  initDuaSection();
  initVisitorCounter();
});

/* ==========================================================
   3. الساعة والتقويم الهجري
   ========================================================== */
function initClock() {
  const timeEl = document.getElementById('current-time');
  const hijriEl = document.getElementById('hijri-date');

  function update() {
    const now = new Date();
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('ar-EG');
    
    // جلب التاريخ الهجري رسمياً عبر Intl
    try {
      const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (hijriEl) hijriEl.textContent = hijriFormatter.format(now);
    } catch {
      if (hijriEl) hijriEl.textContent = "التاريخ الهجري";
    }
  }

  update();
  currentTimeInterval = setInterval(update, 1000);
}

/* ==========================================================
   4. تفعيل وضع الليل والنهار (Theme Toggle)
   ========================================================== */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('tamaniyna_theme') || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (btn) btn.textContent = '☀️ الوضع الفاتح';
  }

  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('tamaniyna_theme', isDark ? 'dark' : 'light');
      btn.textContent = isDark ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن';
    });
  }
}

/* ==========================================================
   5. المساعد الروحي الذكي
   ========================================================== */
function initAiCompanion() {
  const chips = document.querySelectorAll('.ai-chip');
  const responseBox = document.getElementById('ai-response-box');
  const responseText = document.getElementById('ai-response-text');

  const responses = {
    "قلق": "قال تعالى: ﴿الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ [الرعد: 28]. استعذ بالله من الشيطان الرجيم وأكثر من الحوقلة.",
    "ضيق": "قال تعالى: ﴿فَإِنَّ مَعَ الْعُسْرِ يُسْراً، إِنَّ مَعَ الْعُسْرِ يُسْراً﴾ [الشرح: 5-6]. تذكر دائماً أن رحمة الله وسعت كل شيء.",
    "شكر": "قال تعالى: ﴿لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾ [إبراهيم: 7]. ردد دائماً: 'الحمد لله حمداً كثيراً طيباً مباركاً فيه'.",
    "رزق": "عليك بالاستغفار، قال تعالى: ﴿فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّاراً يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَاراً﴾."
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const mood = chip.getAttribute('data-mood');
      if (responses[mood] && responseBox && responseText) {
        responseText.textContent = responses[mood];
        responseBox.style.display = 'block';
      }
    });
  });
}

/* ==========================================================
   6. مواقيت الصلاة والعد التنازلي
   ========================================================== */
function loadPrayerTimes() {
  const grid = document.getElementById('prayer-times-grid');
  const countdownEl = document.getElementById('next-prayer-countdown');

  // إحداثيات افتراضية (مثلاً القدس / فلسطين) كاحتياط
  let latitude = 31.9522;
  let longitude = 35.2332;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        fetchAndDisplayTimes(latitude, longitude);
      },
      () => { fetchAndDisplayTimes(latitude, longitude); },
      { timeout: 5000 }
    );
  } else {
    fetchAndDisplayTimes(latitude, longitude);
  }

  function fetchAndDisplayTimes(lat, lon) {
    const dateStr = new Date().toISOString().split('T')[0];
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=5`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const timings = data.data.timings;
          currentPrayerTimes = timings;
          renderPrayerUI(timings);
          startCountdown(timings);
        }
      })
      .catch(() => {
        if (grid) grid.innerHTML = `<p class="error">تعذر جلب مواقيت الصلاة، يجدر التحقق من الاتصال.</p>`;
      });
  }

  function renderPrayerUI(timings) {
    if (!grid) return;
    const namesAr = {
      Fajr: 'الفجر',
      Sunrise: 'الشروق',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };

    grid.innerHTML = '';
    for (let key in namesAr) {
      if (timings[key]) {
        grid.innerHTML += `
          <div class="prayer-item">
            <span class="prayer-name">${namesAr[key]}</span>
            <span class="prayer-time">${timings[key]}</span>
          </div>
        `;
      }
    }
  }

  function startCountdown(timings) {
    if (!countdownEl) return;
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      const now = new Date();
      const currentTimeMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

      const prayersKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let nextPrayerName = '';
      let nextPrayerMins = Infinity;

      prayersKeys.forEach(p => {
        if (timings[p]) {
          const [h, m] = timings[p].split(':').map(Number);
          const pMins = h * 60 + m;
          if (pMins > currentTimeMins && pMins < nextPrayerMins) {
            nextPrayerMins = pMins;
            nextPrayerName = p;
          }
        }
      });

      if (nextPrayerMins === Infinity) {
        // إذا انتهت صلوات اليوم، فالصلاة القادمة هي فجر اليوم التالي
        nextPrayerName = 'Fajr (غداً)';
        countdownEl.textContent = 'الصلاة القادمة: الفجر غداً';
      } else {
        const diffMins = nextPrayerMins - currentTimeMins;
        const hoursLeft = Math.floor(diffMins / 60);
        const minsLeft = Math.floor(diffMins % 60);
        const namesMap = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
        countdownEl.textContent = `الصلاة القادمة: ${namesMap[nextPrayerName] || nextPrayerName} بعد ${hoursLeft}س و ${minsLeft}د`;
      }
    }, 1000);
  }
}

/* ==========================================================
   7. القرآن الكريم والصوتيات وتتبع التقدم
   ========================================================== */
function initQuranSection() {
  const surahSelect = document.getElementById('surah-select');
  const readerSelect = document.getElementById('reader-select');
  const surahContainer = document.getElementById('surah-container');
  const audioEl = document.getElementById('quran-audio');
  const audioStatus = document.getElementById('audio-status');
  const progressBanner = document.getElementById('saved-progress-banner');
  const resumeBtn = document.getElementById('resume-progress-btn');
  const progressText = document.getElementById('progress-text');

  let allSurahs = [];

  // جلب قائمة السور
  fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {
      if (data && data.data) {
        allSurahs = data.data;
        allSurahs.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.number;
          opt.textContent = `${s.number}. ${s.englishName} (${s.name})`;
          surahSelect.appendChild(opt);
        });
      }
    });

  // فحص الحفظ السابق في localStorage
  const savedProgress = JSON.parse(localStorage.getItem('quran_progress'));
  if (savedProgress && progressBanner && progressText) {
    progressText.textContent = `لديك قراءة سابقة في سورة ${savedProgress.surahName} (الآية ${savedProgress.ayahNum})`;
    progressBanner.style.display = 'flex';
    
    resumeBtn.addEventListener('click', () => {
      surahSelect.value = savedProgress.surahNum;
      loadSurahContent(savedProgress.surahNum, readerSelect.value);
      progressBanner.style.display = 'none';
    });
  }

  surahSelect.addEventListener('change', () => {
    const surahNum = surahSelect.value;
    if (!surahNum) return;
    loadSurahContent(surahNum, readerSelect.value);
  });

  readerSelect.addEventListener('change', () => {
    const surahNum = surahSelect.value;
    if (surahNum) {
      updateAudioSource(surahNum, readerSelect.value);
    }
  });

  function loadSurahContent(num, reader) {
    surahContainer.innerHTML = '<p class="placeholder-text">جاري تحميل الآيات...</p>';
    
    // جلب النص العثماني والآيات
    fetch(`https://api.alquran.cloud/v1/surah/${num}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const surahObj = data.data;
          let html = `<h3>${surahObj.name} (${surahObj.englishName})</h3>`;
          if (num !== "1" && num !== "9") {
            html += `<p class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>`;
          }
          html += `<div class="ayahs-wrapper">`;
          
          surahObj.ayahs.forEach(ayah => {
            html += `<span class="ayah-span" data-ayah="${ayah.numberInSurah}"> ${ayah.text} <span class="ayah-num">(${ayah.numberInSurah})</span> </span>`;
          });
          html += `</div>`;
          surahContainer.innerHTML = html;

          // تفعيل النقر لحفظ التقدم التلقائي عند أي آية
          const spans = surahContainer.querySelectorAll('.ayah-span');
          spans.forEach(span => {
            span.addEventListener('click', () => {
              const ayahNum = span.getAttribute('data-ayah');
              const progressObj = {
                surahNum: num,
                surahName: surahObj.name,
                ayahNum: ayahNum
              };
              localStorage.setItem('quran_progress', JSON.stringify(progressObj));
              
              // تأثير بصري بسيط عند الحفظ
              spans.forEach(s => s.style.backgroundColor = 'transparent');
              span.style.backgroundColor = 'rgba(46, 125, 50, 0.15)';
              alert(`تم حفظ موقع القراءة عند ${surahObj.name} - الآية ${ayahNum}`);
            });
          });

          updateAudioSource(num, reader);
        }
      })
      .catch(() => {
        surahContainer.innerHTML = '<p class="error">تعذر تحميل السورة. تأكد من الاتصال بالإنترنت.</p>';
      });
  }

  function updateAudioSource(surahNum, readerKey) {
    // تنسيق رقم السورة ليصبح ثلاثي الأماكن (مثال: 001)
    const formattedNum = String(surahNum).padStart(3, '0');
    // رابط تلاوة عالي الجودة من EveryAyah أو QuranCentral المعتمد
    const audioUrl = `https://everyayah.com/data/${readerKey}_128kbps/${formattedNum}.mp3`;
    
    if (audioEl) {
      audioEl.src = audioUrl;
      audioStatus.textContent = `جاهز للتشغيل للقارئ المختارة`;
    }
  }
}

/* ==========================================================
   8. قسم الأحاديث النبوية الشريفة (عرض كامل ونظيف)
   ========================================================== */
function initHadithSection() {
  const textEl = document.getElementById('hadith-text');
  const infoEl = document.getElementById('hadith-info');
  const nextBtn = document.getElementById('next-hadith-btn');
  const stars = document.querySelectorAll('.stars-rating .star');

  function renderHadith(index) {
    const current = hadithsList[index];
    if (textEl && current) {
      // إسناد النص كاملاً بدون أي اقتطاع
      textEl.textContent = current.text;
      infoEl.textContent = current.source;
    }
  }

  renderHadith(currentHadithIndex);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentHadithIndex = (currentHadithIndex + 1) % hadithsList.length;
      renderHadith(currentHadithIndex);
    });
  }

  // تقييم الحديث بالنجوم
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = star.getAttribute('data-value');
      stars.forEach(s => {
        if (s.getAttribute('data-value') <= val) {
          s.style.color = '#f39c12';
        } else {
          s.style.color = '#ccc';
        }
      });
      localStorage.setItem('hadith_rating_' + currentHadithIndex, val);
    });
  });
}

/* ==========================================================
   9. أذكار المسلم (الصباح والمساء)
   ========================================================== */
function initAzkarSection() {
  const sabahBtn = document.getElementById('sabah-btn');
  const massaBtn = document.getElementById('massa-btn');
  const display = document.getElementById('azkar-display');

  function renderList(type) {
    if (!display) return;
    const items = azkarData[type];
    let html = '';
    items.forEach((item, idx) => {
      html += `
        <div class="zkar-box">
          <p class="zkar-text">${item.text}</p>
          <div class="zkar-footer">
            <span class="zkar-badge">التكرار: ${item.count}</span>
            <button class="btn btn-sm zkar-counter-btn" data-type="${type}" data-index="${idx}">تم الذكر</button>
          </div>
        </div>
      `;
    });
    display.innerHTML = html;

    // أزرار العد لكل ذكر
    const countBtns = display.querySelectorAll('.zkar-counter-btn');
    countBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.style.backgroundColor = '#2e7d32';
        btn.textContent = '✓ جزاك الله خيراً';
        btn.disabled = true;
      });
    });
  }

  if (sabahBtn && massaBtn) {
    renderList('sabah');
    sabahBtn.addEventListener('click', () => {
      sabahBtn.classList.add('active');
      massaBtn.classList.remove('active');
      renderList('sabah');
    });

    massaBtn.addEventListener('click', () => {
      massaBtn.classList.add('active');
      sabahBtn.classList.remove('active');
      renderList('massa');
    });
  }
}

/* ==========================================================
   10. عداد التسبيح الرقمي
   ========================================================== */
function initTasbihSection() {
  const select = document.getElementById('tasbih-select');
  const displayText = document.getElementById('tasbih-display-text');
  const circleBtn = document.getElementById('tasbih-btn-circle');
  const countSpan = document.getElementById('tasbih-count');
  const resetBtn = document.getElementById('tasbih-reset');

  let currentCount = parseInt(localStorage.getItem('tasbih_count') || '0');
  if (countSpan) countSpan.textContent = currentCount;

  if (select && displayText) {
    select.addEventListener('change', () => {
      displayText.textContent = select.value;
    });
  }

  if (circleBtn && countSpan) {
    circleBtn.addEventListener('click', () => {
      currentCount++;
      countSpan.textContent = currentCount;
      localStorage.setItem('tasbih_count', currentCount);
      
      // تأثير اهتزاز خفيف إن وجد الدعم
      if (navigator.vibrate) navigator.vibrate(40);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCount = 0;
      if (countSpan) countSpan.textContent = currentCount;
      localStorage.removeItem('tasbih_count');
    });
  }
}

/* ==========================================================
   11. بوصلة القبلة
   ========================================================== */
function initQiblaCompass() {
  const arrow = document.getElementById('qibla-arrow');
  const status = document.getElementById('qibla-status');

  // إحداثيات الكعبة المشرفة
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        
        const qiblaAngle = calculateQibla(userLat, userLon, kaabaLat, kaabaLon);
        if (arrow) {
          arrow.style.transform = `rotate(${qiblaAngle}deg)`;
        }
        if (status) {
          status.textContent = `تم تحديث اتجاه القبلة بدقة بناءً على موقعك الحالي (${Math.round(qiblaAngle)} درجة)`;
        }
      },
      () => {
        if (status) status.textContent = "يرجى السماح بالوصول للموقع الجغرافي لحساب اتجاه القبلة بدقة.";
      }
    );
  }

  function calculateQibla(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let θ = Math.atan2(y, x) * 180 / Math.PI;
    return (θ + 360) % 360;
  }
}

/* ==========================================================
   12. موسوعة الأدعية
   ========================================================== */
function initDuaSection() {
  const tabBtns = document.querySelectorAll('.tab-btn-dua');
  const display = document.getElementById('dua-display');

  function renderDuas(type) {
    if (!display) return;
    const list = duasData[type] || [];
    let html = '';
    list.forEach(item => {
      html += `
        <div class="dua-box">
          <p class="dua-text">${item}</p>
        </div>
      `;
    });
    display.innerHTML = html;
  }

  renderDuas('rizq');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.add('btn-secondary');
      });
      btn.classList.add('active');
      btn.classList.remove('btn-secondary');

      const type = btn.getAttribute('data-type');
      renderDuas(type);
    });
  });
}

/* ==========================================================
   13. عداد الزيارات
   ========================================================== */
function initVisitorCounter() {
  const countSpan = document.getElementById('count');
  let visits = parseInt(localStorage.getItem('tamaniyna_visits') || '1240');
  
  // زيادة العداد في كل زيارة جديدة للجلسة
  if (!sessionStorage.getItem('visited_session')) {
    visits++;
    localStorage.setItem('tamaniyna_visits', visits);
    sessionStorage.setItem('visited_session', 'true');
  }

  if (countSpan) {
    countSpan.textContent = visits;
  }
}
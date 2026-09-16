let appData = null;
let voiceEnabled = true;
let currentWhoIndex = 0;
let currentHomeIndex = 0;
let currentStoryIndex = 0;

function speakText(text) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/data');
  appData = await res.json();

  renderChecklist();
  setupVoiceToggle();
  setupFontResizer();

  speakText("Good morning Ama. Welcome back to Memory Lane.");
});

function renderChecklist() {
  const containerFull = document.getElementById('checklistContainerFull');
  const containerQuick = document.getElementById('checklistQuick');

  if (containerFull) containerFull.innerHTML = '';
  if (containerQuick) containerQuick.innerHTML = '';

  appData.checklist.forEach(item => {
    let iconClass = 'fa-pills text-purple-600';
    if (item.type === 'water') iconClass = 'fa-droplet text-blue-500';
    if (item.type === 'walk') iconClass = 'fa-person-walking text-emerald-500';
    if (item.type === 'calendar') iconClass = 'fa-calendar-check text-rose-500';

    if (containerFull) {
      const row = document.createElement('div');
      row.className = "flex items-center justify-between p-4 rounded-2xl border transition " + 
        (item.done ? "bg-purple-50/40 border-purple-200" : "bg-white border-slate-100 hover:border-purple-200");
      row.innerHTML = `
        <div class="flex items-center space-x-3.5">
          <div class="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-sm">
            <i class="fa-solid ${iconClass}"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900 leading-none">${item.title}</h4>
            <span class="text-xs text-slate-400 font-medium">${item.time}</span>
          </div>
        </div>
        <button onclick="toggleCheck(${item.id})" class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${item.done ? 'border-purple-700 bg-purple-700 text-white' : 'border-slate-300'}">
          ${item.done ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
        </button>
      `;
      containerFull.appendChild(row);
    }

    if (containerQuick) {
      const qRow = document.createElement('div');
      qRow.className = "flex items-center justify-between p-2.5 rounded-xl border border-slate-100 text-xs";
      qRow.innerHTML = `
        <div class="flex items-center space-x-2">
          <i class="fa-solid ${iconClass}"></i>
          <span class="font-bold text-slate-800">${item.title}</span>
        </div>
        <button onclick="toggleCheck(${item.id})" class="text-xs ${item.done ? 'text-purple-700 font-bold' : 'text-slate-400'}">
          ${item.done ? '✓ Done' : '○'}
        </button>
      `;
      containerQuick.appendChild(qRow);
    }
  });
}

function toggleCheck(id) {
  const item = appData.checklist.find(c => c.id === id);
  if (item) {
    item.done = !item.done;
    renderChecklist();
    if (item.done) {
      speakText(`${item.title} completed. Well done!`);
    }
  }
}

function setMood(mood, emoji) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active-mood'));
  event.currentTarget.classList.add('active-mood');

  const msg = document.getElementById('moodMessage');
  msg.innerText = `Ama is feeling ${mood.toLowerCase()} and content today.`;

  const ind = document.getElementById('savedIndicator');
  ind.classList.remove('hidden');
  setTimeout(() => ind.classList.add('hidden'), 2500);

  speakText(`Saved. You are feeling ${mood}.`);
}

function switchTab(view) {
  const views = ['viewHome', 'viewActivities', 'viewWhoGame', 'viewHomeGame', 'viewStoryGame', 'viewReminders'];
  views.forEach(v => document.getElementById(v).classList.add('hidden'));

  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active-nav'));

  if (view === 'home') {
    document.getElementById('viewHome').classList.remove('hidden');
    document.getElementById('navHome').classList.add('active-nav');
  } else if (view === 'activities') {
    document.getElementById('viewActivities').classList.remove('hidden');
    document.getElementById('navActivities').classList.add('active-nav');
  } else if (view === 'reminders') {
    document.getElementById('viewReminders').classList.remove('hidden');
    document.getElementById('navReminders').classList.add('active-nav');
  }
}

/* --- GAME 1: WHO IS THIS? --- */
function startWhoGame() {
  currentWhoIndex = 0;
  loadWhoQuestion();
  switchTab('none');
  document.getElementById('viewWhoGame').classList.remove('hidden');
}

function loadWhoQuestion() {
  const q = appData.game_who[currentWhoIndex];
  document.getElementById('whoProgress').innerText = `${currentWhoIndex + 1} / ${appData.game_who.length}`;
  document.getElementById('personEmoji').innerText = q.emoji;
  document.getElementById('personName').innerText = q.name;
  document.getElementById('personQuestion').innerText = `"${q.question}"`;

  const feed = document.getElementById('whoFeedbackBox');
  feed.classList.add('hidden');

  const container = document.getElementById('whoOptionsContainer');
  container.innerHTML = '';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "w-full py-3.5 px-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 hover:border-purple-400 hover:bg-purple-50 transition shadow-xs flex items-center justify-between";
    btn.innerHTML = `<span>${opt}</span><i class="fa-solid fa-chevron-right text-slate-300 text-xs"></i>`;
    btn.onclick = () => answerWho(opt, q);
    container.appendChild(btn);
  });

  speakText(q.question);
}

function repeatQuestion() {
  speakText(appData.game_who[currentWhoIndex].question);
}

function answerWho(chosen, q) {
  const feed = document.getElementById('whoFeedbackBox');
  feed.classList.remove('hidden');

  if (chosen === q.correct) {
    feed.className = "mt-4 w-full p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold";
    feed.innerText = q.praise;
    speakText(q.praise);

    setTimeout(() => {
      currentWhoIndex++;
      if (currentWhoIndex < appData.game_who.length) {
        loadWhoQuestion();
      } else {
        feed.innerText = "Level 2 Mastered! You recognized your loving family wonderfully.";
        speakText("Level 2 Mastered! You recognized your loving family wonderfully.");
        setTimeout(() => switchTab('activities'), 2500);
      }
    }, 2000);
  } else {
    feed.className = "mt-4 w-full p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium";
    feed.innerHTML = `💡 <strong>Gentle hint:</strong> ${q.hint}`;
    speakText(`Here is a gentle hint: ${q.hint}`);
  }
}

/* --- GAME 2: RECONSTRUCT MY HOME --- */
function startHomeGame() {
  currentHomeIndex = 0;
  loadHomeQuest();
  switchTab('none');
  document.getElementById('viewHomeGame').classList.remove('hidden');
}

function loadHomeQuest() {
  const quest = appData.game_home[currentHomeIndex];
  document.getElementById('homeProgress').innerText = `${currentHomeIndex + 1} / ${appData.game_home.length}`;
  document.getElementById('homeQuestText').innerText = `"${quest.quest}"`;

  const feed = document.getElementById('homeFeedback');
  feed.classList.add('hidden');

  const grid = document.getElementById('homeItemsGrid');
  grid.innerHTML = '';

  quest.items.forEach(item => {
    const card = document.createElement('button');
    card.className = "bg-white p-5 rounded-3xl border border-slate-200 hover:border-purple-400 flex flex-col items-center text-center shadow-xs transition hover:shadow-md";
    card.innerHTML = `
      <span class="text-4xl mb-2">${item.icon}</span>
      <span class="text-xs sm:text-sm font-bold text-slate-800">${item.name}</span>
    `;
    card.onclick = () => {
      feed.classList.remove('hidden');
      feed.innerText = item.feedback;
      speakText(item.feedback);

      if (item.correct) {
        setTimeout(() => {
          currentHomeIndex++;
          if (currentHomeIndex < appData.game_home.length) {
            loadHomeQuest();
          } else {
            feed.innerText = "All rooms explored! Fantastic job!";
            speakText("All rooms explored! Wonderful job remembering your home.");
            setTimeout(() => switchTab('activities'), 2500);
          }
        }, 2200);
      }
    };
    grid.appendChild(card);
  });

  speakText(quest.quest);
}

/* --- GAME 3: COMPLETE MY STORY --- */
function startStoryGame() {
  currentStoryIndex = 0;
  loadStoryQuestion();
  switchTab('none');
  document.getElementById('viewStoryGame').classList.remove('hidden');
}

function loadStoryQuestion() {
  const s = appData.game_stories[currentStoryIndex];
  document.getElementById('storyProgress').innerText = `${currentStoryIndex + 1} / ${appData.game_stories.length}`;
  document.getElementById('storyLeadText').innerHTML = `"${s.lead} <span class='border-b-2 border-dashed border-rose-500 px-3 text-rose-600 font-bold'>______</span>"`;

  const feed = document.getElementById('storyFeedbackBox');
  feed.classList.add('hidden');

  const container = document.getElementById('storyOptionsContainer');
  container.innerHTML = '';

  s.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "w-full py-3.5 px-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 hover:border-rose-400 hover:bg-rose-50 transition shadow-xs flex items-center justify-between";
    btn.innerHTML = `<span>${opt}</span><i class="fa-solid fa-chevron-right text-slate-300 text-xs"></i>`;
    btn.onclick = () => answerStory(opt, s);
    container.appendChild(btn);
  });

  speakText(`${s.lead}... Which item completes the memory?`);
}

function speakStoryHint() {
  speakText(`Here is a hint from your family memory: ${appData.game_stories[currentStoryIndex].hint}`);
}

function answerStory(chosen, story) {
  const feed = document.getElementById('storyFeedbackBox');
  feed.classList.remove('hidden');

  if (chosen === story.blank_answer) {
    feed.className = "mt-4 w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold";
    feed.innerText = `Correct! ${story.full_story}`;
    speakText(`Correct! ${story.full_story}`);

    setTimeout(() => {
      currentStoryIndex++;
      if (currentStoryIndex < appData.game_stories.length) {
        loadStoryQuestion();
      } else {
        feed.innerText = "All memories completed! Beautifully remembered.";
        speakText("All memories completed! Beautifully remembered.");
        setTimeout(() => switchTab('activities'), 2500);
      }
    }, 2500);
  } else {
    feed.className = "mt-4 w-full p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium";
    feed.innerHTML = `💡 <strong>Hint:</strong> ${story.hint}`;
    speakText(`Gentle hint: ${story.hint}`);
  }
}

/* --- ASSISTIVE TOOLS --- */
function setupVoiceToggle() {
  const btn = document.getElementById('voiceToggle');
  const icon = document.getElementById('voiceIcon');
  btn.onclick = () => {
    voiceEnabled = !voiceEnabled;
    if (voiceEnabled) {
      icon.className = "fa-solid fa-volume-high text-sm";
      speakText("Voice assistance enabled.");
    } else {
      icon.className = "fa-solid fa-volume-xmark text-sm";
      window.speechSynthesis.cancel();
    }
  };
}

let isLargeFont = false;
function setupFontResizer() {
  const btn = document.getElementById('fontSizeBtn');
  btn.onclick = () => {
    isLargeFont = !isLargeFont;
    document.getElementById('mainContent').style.fontSize = isLargeFont ? '1.15rem' : '1rem';
  };
}

function triggerVoiceAssistant() {
  speakText("Hello Ama. I am your cognitive memory companion. You can play Reconstruct My Home, guess family relatives in Who is This, or practice Complete My Story.");
}

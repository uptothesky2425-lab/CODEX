const faces = [
  { icon: '⚔', name: 'Cinder Edge', type: 'ATTACK', value: 4, text: 'Deal 4 damage.', color: 'red' },
  { icon: '✥', name: 'Warding Sigil', type: 'DEFENSE', value: 2, text: 'Gain 2 ward.', color: 'gold' },
  { icon: '♥', name: 'Blood Draw', type: 'VAMPIRISM', value: 2, text: 'Deal 2 damage. Heal 1.', color: 'crimson' },
  { icon: '☠', name: 'Ashen Hex', type: 'CURSE', value: 1, text: 'Curse: next hit +1.', color: 'violet' },
  { icon: '✦', name: 'Fate Shard', type: 'FORTUNE', value: 1, text: 'Gain 1 Fate.', color: 'purple' },
  { icon: '☾', name: 'Moon Guard', type: 'DEFENSE', value: 3, text: 'Gain 3 ward.', color: 'blue' }
];
let state = { hp: 18, enemyHp: 26, fate: 3, gold: 24, last: null, cursed: false, rolling: false };
const $ = (id) => document.getElementById(id);

function renderFaces() {
  $('faces').innerHTML = faces.map((face, index) => `
    <button class="face-card ${face.color}" data-index="${index}">
      <span class="face-number">${index + 1}</span><span class="face-icon">${face.icon}</span>
      <span class="face-info"><b>${face.name}</b><small>${face.type} · ${face.value}</small><em>${face.text}</em></span>
    </button>`).join('');
}
function updateStats() {
  $('hp').textContent = state.hp; $('fate').textContent = state.fate; $('gold').textContent = state.gold;
  $('enemyHp').textContent = Math.max(state.enemyHp, 0);
  $('hpFill').style.width = `${(state.hp / 18) * 100}%`;
  $('enemyFill').style.width = `${Math.max(state.enemyHp, 0) / 26 * 100}%`;
  $('rerollBtn').disabled = state.fate < 1 || state.last === null || state.rolling || state.enemyHp <= 0;
  $('rollBtn').disabled = state.rolling || state.enemyHp <= 0;
}
function log(message) {
  const item = document.createElement('li'); item.textContent = message;
  $('log').prepend(item); if ($('log').children.length > 4) $('log').lastElementChild.remove();
}
function resolve(face) {
  let text = '';
  if (face.type === 'ATTACK') {
    const damage = face.value + (state.cursed ? 1 : 0); state.enemyHp -= damage;
    text = `${face.name} rends the Warden for ${damage} damage.`; state.cursed = false;
  } else if (face.type === 'VAMPIRISM') {
    state.enemyHp -= face.value; state.hp = Math.min(18, state.hp + 1); text = `Blood Draw deals ${face.value} damage and restores 1 HP.`;
  } else if (face.type === 'CURSE') { state.cursed = true; text = 'Ashen Hex clings to your next strike (+1 damage).'; }
  else if (face.type === 'FORTUNE') { state.fate += 1; text = 'Fate Shard grants 1 Fate.'; }
  else text = `${face.name} raises a ward of ${face.value}.`;
  if (state.enemyHp <= 0) { state.enemyHp = 0; text = 'THE HOLLOW WARDEN FALLS. The path opens.'; $('result').textContent = 'VICTORY IS WRITTEN.'; }
  else $('result').textContent = `${face.type} · ${face.value}`;
  log(text); updateStats();
}
function roll(isReroll = false) {
  if (state.rolling || state.enemyHp <= 0 || (isReroll && (state.last === null || state.fate < 1))) return;
  if (isReroll) { state.fate -= 1; log('You bend fate and cast the omen again.'); }
  state.rolling = true; updateStats();
  const dice = $('dice'); dice.classList.add('rolling');
  let ticks = 0; const spin = setInterval(() => { $('diceFace').textContent = faces[Math.floor(Math.random() * 6)].icon; ticks++; }, 70);
  setTimeout(() => { clearInterval(spin); const index = Math.floor(Math.random() * 6); const face = faces[index]; state.last = index; $('diceFace').textContent = face.icon; dice.className = `dice ${face.color}`; resolve(face); state.rolling = false; updateStats(); }, 800);
}
renderFaces(); updateStats();
$('rollBtn').onclick = () => roll(); $('dice').onclick = () => roll(); $('rerollBtn').onclick = () => roll(true);
document.addEventListener('keydown', (event) => { if (event.code === 'Space') { event.preventDefault(); roll(); } });

document.getElementById("diagnosisForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  // --- 回答取得 ---
  const answers = [];
  for (let i = 1; i <= 10; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) answers.push(selected.value);
  }

  if (answers.length < 10) {
    document.getElementById("result").innerHTML = "<p class='error'>すべての質問に答えてください。</p>";
    return;
  }

  // --- 質問 → 特徴カテゴリ ---
const answerMap = {
  q1: { A: "age", B: "age", C: "age", D: "age" },
  q2: { A: "hair", B: "hair", C: "hair", D: "hair" },
  q3: { A: "height", B: "height", C: "height", D: "height" },
  q4: { A: "bast", B: "bast", C: "bast", D: "bast" },
  q5: { A: "underhair", B: "underhair", C: "underhair", D: "underhair" },
  q6: { A: "eye", B: "eye", C: "eye", D: "eye" },
  q7: { A: "body", B: "body", C: "body", D: "body" },
  q8: { A: "aura", B: "aura", C: "aura", D: "aura" },
  q9: { A: "voice", B: "voice", C: "voice", D: "voice" },
  q10: { A: "last", B: "last", C: "last", D: "last" }
};

  // --- ユーザー特徴ベクトル ---
  const userTraits = {
     age: 0, hair: 0, height: 0, bast: 0, underhair: 0, eye: 0, body: 0, aura: 0 , voice: 0, last: 0
    };

const scoreMap = { A: 4, B: 3, C: 2, D: 1 };

answers.forEach((val, i) => {
  const qKey = `q${i + 1}`;
  const trait = answerMap[qKey][val];
  userTraits[trait] = scoreMap[val];
});

  // --- JSONデータベース読み込み ---
  const characters = await fetch("characters.json").then(res => res.json());

  // --- 最も近いキャラを探す ---
  let bestChar = null;
  let bestScore = Infinity;

  characters.forEach(char => {
    let score = 0;
    for (const key in userTraits) {
      score += Math.abs(userTraits[key] - char.traits[key]);
    }
    if (score < bestScore) {
      bestScore = score;
      bestChar = char;
    }
  });

  // --- 結果表示 ---
  showResult(bestChar);
});

// --- 結果表示関数 ---
function showResult(char) {
  document.getElementById("result").innerHTML = `
    <div class="result-box">
      <h3>あなたに最も近いキャラクター</h3>
      <h2>${char.name}</h2>
      <img src="${char.image}" class="result-image">
      <p>${char.description}</p>
      <a href="${char.link}" target="_blank">詳しく見る</a>
    </div>
  `;
}

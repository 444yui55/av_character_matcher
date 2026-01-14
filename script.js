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
    q1: { A: "acting", B: "space", C: "body", D: "thought" },
    q2: { A: "acting", B: "space", C: "acting", D: "thought" },
    q3: { A: "acting", B: "space", C: "body", D: "thought" },
    q4: { A: "acting", B: "space", C: "body", D: "thought" },
    q5: { A: "acting", B: "space", C: "body", D: "thought" },
    q6: { A: "acting", B: "space", C: "body", D: "thought" },
    q7: { A: "acting", B: "space", C: "body", D: "thought" },
    q8: { A: "acting", B: "space", C: "body", D: "thought" },
    q9: { A: "acting", B: "space", C: "body", D: "thought" },
    q10: { A: "acting", B: "space", C: "body", D: "thought" }
  };

  // --- ユーザー特徴ベクトル ---
  const userTraits = { acting: 0, space: 0, body: 0, thought: 0 };

  answers.forEach((val, i) => {
    const qKey = `q${i + 1}`;
    const trait = answerMap[qKey][val];
    userTraits[trait]++;
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

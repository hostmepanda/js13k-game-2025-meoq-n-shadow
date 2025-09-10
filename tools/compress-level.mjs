import fs from "fs"

function compress(str) {
  let out = "";
  let last = str[0];
  let count = 1;
  for (let i = 1; i < str.length; i++) {
    if (str[i] === last) {
      count++;
    } else {
      out += last + (count > 1 ? count : "");
      last = str[i];
      count = 1;
    }
  }
  out += last + (count > 1 ? count : "");
  return out;
}

// читаем level1.txt
["level1.txt", "level2.txt", "level3.txt"].forEach(
  (levelMap) => {
    const input = fs.readFileSync(levelMap, "utf8")
    .split(/\r?\n/)
    .filter(l => l.trim().length > 0);

    const compressed = input.map(compress);

    fs.writeFileSync(`${levelMap}.compressed.json`, JSON.stringify(compressed, null, 2));
    console.log("✅ Сжатая карта сохранена в level1.compressed.json");
  }
)

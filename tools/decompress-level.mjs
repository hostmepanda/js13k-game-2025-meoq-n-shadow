import fs from "fs"

function decompress(str) {
  return str.replace(/(\D)(\d*)/g, (_, ch, num) =>
    ch.repeat(num ? parseInt(num, 10) : 1)
  );
}

["level1.txt", "level2.txt", "level3.txt"].forEach(
  (levelMap) => {
    // читаем level1.compressed.json
    const compressed = JSON.parse(fs.readFileSync(`${levelMap}.compressed.json`, "utf8"));

// распаковываем
    const decompressed = compressed.map(decompress).join("\n");

// сохраняем обратно
    fs.writeFileSync(levelMap, decompressed);
    console.log(`✅ Распакованная карта сохранена в ${levelMap}`);
  })



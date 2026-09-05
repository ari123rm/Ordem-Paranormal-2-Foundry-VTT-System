import { extractPack } from "@foundryvtt/foundryvtt-cli";
import fs from "fs";
import path from "path";

const packs = ["habilidades", "perfis"];

async function run() {
  console.log("📦 Iniciando extração dos compêndios (LevelDB -> JSON)...");
  
  for (const pack of packs) {
    const inPath = path.resolve(process.cwd(), `packs/${pack}`);
    const outPath = path.resolve(process.cwd(), `src/packs/${pack}`);
    
    // Cria a pasta de destino automaticamente se não existir para evitar erros
    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath, { recursive: true });
    }
    
    console.log(`➡️ Extraindo: ${pack}...`);
    await extractPack(inPath, outPath);
  }
  
  console.log("✅ Tudo extraído para JSON com sucesso!");
}

run();
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import fs from "fs";
import path from "path";

const packs = ["habilidades", "perfis", "tabelas-rolagem"];

async function run() {
  console.log("📦 Reconstruindo compêndios (JSON -> LevelDB)...");
  
  for (const pack of packs) {
    const inPath = path.resolve(process.cwd(), `src/packs/${pack}`);
    const outPath = path.resolve(process.cwd(), `packs/${pack}`);
    
    // Se a pasta JSON não existir, avisa e pula em vez de quebrar (Blindagem)
    if (!fs.existsSync(inPath)) {
      console.log(`⚠️ Ignorando ${pack}: Pasta ${inPath} não encontrada. Você extraiu antes?`);
      continue;
    }

    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath, { recursive: true });
    }
    
    console.log(`➡️ Compilando: ${pack}...`);
    await compilePack(inPath, outPath);
  }
  
  console.log("✅ Compêndios LevelDB gerados com sucesso!");
}

run();
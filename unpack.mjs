import { extractPack } from "@foundryvtt/foundryvtt-cli";
import fs from "fs";
import path from "path";

const packs = ["habilidades", "perfis"];

async function run() {
  console.log("📦 Iniciando extração dos compêndios (LevelDB -> JSON)...");
  
  for (const pack of packs) {
    const inPath = path.resolve(process.cwd(), `packs/${pack}`);
    const outPath = path.resolve(process.cwd(), `src/packs/${pack}`);
    
    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath, { recursive: true });
    }
    
    console.log(`➡️ Extraindo: ${pack}...`);
    
    try {
      await extractPack(inPath, outPath);
    } catch (e) {
      console.log("\n=======================================================");
      console.log("🛑 MUNDO DO FOUNDRY ABERTO!");
      console.log("O Windows bloqueou a leitura do banco de dados (LevelDB).");
      console.log("Para o seu commit salvar os itens novos, por favor:");
      console.log("1. Volte para o Menu Principal (Setup) no Foundry.");
      console.log("2. Tente fazer o seu commit novamente.");
      console.log("=======================================================\n");
      process.exit(1); // Barra o Husky e impede que um commit sem as habilidades passe
    }
  }
  
  console.log("✅ Tudo extraído para JSON com sucesso!");
}

run();
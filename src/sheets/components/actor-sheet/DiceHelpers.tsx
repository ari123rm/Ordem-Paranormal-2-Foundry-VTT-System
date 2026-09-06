import React from "react";
import styles from "./DiceHelpers.module.scss";
import { RollDialog } from "./RollDialog";
import { buildRollFlavor, getChatImage } from "./ChatHelpers";

export const getDiceIcon = (val: number) => {
  switch(val) {
    case 4: return "fa-dice-d4";
    case 6: return "fa-dice-d6";
    case 8: return "fa-dice-d8";
    case 10: return "fa-dice-d10";
    case 12: return "fa-dice-d12";
    case 20: return "fa-dice-d20";
    default: return "fa-dice-d20";
  }
};

export const DiceSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className={styles.diceSelectWrapper}>
    <i className={`fas ${getDiceIcon(value)} ${styles.diceBgIcon}`}></i>
    <select className={styles.cleanSelect} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {[4, 6, 8, 10, 12, 20].map(v => <option key={v} value={v}>{v}</option>)}
    </select>
  </div>
);

export const rollDice = async (actor: any, skillName: string, baseAttrKey: string, skillValue: number | null) => {
  const rollOptions = await RollDialog.prompt({ actor, skillName, initialAttrKey: baseAttrKey, initialSkillValue: skillValue });
  if (!rollOptions) return;

  const { finalAttrValue, finalSkillValue, bonusDice, dt } = rollOptions;
  const themeColor = actor.system.themeColor || "#c52222";
  const actorImg = getChatImage(actor);

  // Adiciona as categorias entre Colchetes para o Tooltip Nativo (Ex: 1d6[FISICO])
  let formula = `1d${finalAttrValue}[${baseAttrKey.toUpperCase()}]`;
  if (finalSkillValue) formula += ` + 1d${finalSkillValue}[${skillName.toUpperCase()}]`;
  if (bonusDice && bonusDice.length > 0) {
    bonusDice.forEach((d: number, index: number) => {
      formula += ` + 1d${d}[SITUACIONAL ${index + 1}]`;
    });
  }

  const roll = new Roll(formula);
  await roll.evaluate();

  const diceResults = roll.dice.flatMap(d => d.results ? d.results.map(r => r.result) : []);
  const ra = Math.max(...diceResults);
  const rb = Math.min(...diceResults);
  
  let isCrit = false;
  let isCritFail = diceResults.length > 0 && diceResults.every(r => r === 1);
  const counts: Record<number, number> = {};
  for (const res of diceResults) {
    counts[res] = (counts[res] || 0) + 1;
    if (counts[res] >= 2 && res >= 6) isCrit = true;
  }

  const subtitle = finalSkillValue ? `${baseAttrKey.charAt(0).toUpperCase() + baseAttrKey.slice(1)} + ${skillName}` : `${baseAttrKey.charAt(0).toUpperCase() + baseAttrKey.slice(1)} Puro`;

  const flavorText = buildRollFlavor({ skillName, subtitle, total: roll.total, ra, rb, isCrit, isCritFail, dt, isSuccess: dt ? roll.total >= dt : null, themeColor, actorImg });

  // CORREÇÃO: Cria o ChatMessage explicitamente passando o roll empacotado corretamente para o Dice So Nice
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: flavorText,
    rolls: [roll],
    content: String(roll.total)
  });
};
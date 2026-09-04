import React from "react";
import styles from "./DiceHelpers.module.scss";
import { RollDialog } from "./RollDialog";

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

// Modificado para aceitar o d20 na ficha principal
export const DiceSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className={styles.diceSelectWrapper}>
    <i className={`fas ${getDiceIcon(value)} ${styles.diceBgIcon}`}></i>
    <select className={styles.cleanSelect} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {[4, 6, 8, 10, 12, 20].map(v => <option key={v} value={v}>{v}</option>)}
    </select>
  </div>
);

// A função de rolagem agora lida com 'skillValue' podendo ser null (Atributo Puro)
export const rollDice = async (actor: any, skillName: string, baseAttrKey: string, skillValue: number | null) => {
  const rollOptions = await RollDialog.prompt({
    actor,
    skillName,
    initialAttrKey: baseAttrKey,
    initialSkillValue: skillValue
  });

  if (!rollOptions) return;

  const { finalAttrValue, finalSkillValue, bonusDice } = rollOptions;
  const themeColor = actor.system.themeColor || "#c52222";

  let formula = `1d${finalAttrValue}`;
  
  if (finalSkillValue) {
    formula += ` + 1d${finalSkillValue}`;
  }
  
  if (bonusDice && bonusDice.length > 0) {
    const bonusString = bonusDice.map((d: number) => `1d${d}`).join(" + ");
    formula += ` + ${bonusString}`;
  }

  const roll = new Roll(formula);
  await roll.evaluate();

  // Injeta a cor do personagem no chat
  const flavorText = `
    <div style="color: ${themeColor}; font-family: 'Special Elite', monospace; font-size: 1.3rem; text-transform: uppercase; border-bottom: 1px dashed ${themeColor}; padding-bottom: 4px;">
      Teste de ${skillName}
    </div>
  `;

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: flavorText
  });
};
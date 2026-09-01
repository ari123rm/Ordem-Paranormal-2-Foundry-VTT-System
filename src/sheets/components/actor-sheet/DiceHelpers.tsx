import React from "react";
import styles from "./DiceHelpers.module.scss";

export const rollDice = async (actor: any, nome: string, attrValue: number, skillValue: number) => {
  const formula = `1d${attrValue} + 1d${skillValue}`;
  const roll = new Roll(formula);
  await roll.evaluate();
  roll.toMessage({ 
    speaker: ChatMessage.getSpeaker({ actor }), 
    flavor: `<b>Teste de ${nome.toUpperCase()}</b>` 
  });
};

export const getDiceIcon = (val: number) => {
  switch(val) {
    case 4: return "fa-dice-d4";
    case 6: return "fa-dice-d6";
    case 8: return "fa-dice-d8";
    case 10: return "fa-dice-d10";
    case 12: return "fa-dice-d12";
    default: return "fa-dice-d20";
  }
};

export const DiceSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className={styles.diceSelectWrapper}>
    <i className={`fas ${getDiceIcon(value)} ${styles.diceBgIcon}`}></i>
    <select className={styles.cleanSelect} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {[4, 6, 8, 10, 12].map(v => <option key={v} value={v}>{v}</option>)}
    </select>
  </div>
);
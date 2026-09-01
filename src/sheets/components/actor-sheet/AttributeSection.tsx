import React from "react";
import styles from "./AttributeSection.module.scss";
import { DiceSelect, rollDice } from "./DiceHelpers";

export const AttributeSection = ({ system, updateField, actor }: any) => (
  <div className={styles.attributesBlock}>
    <div className={styles.themeBadge}>ATRIBUTOS</div>
    {(["fisico", "mente", "emocao"] as const).map((attr) => (
      <div key={attr} className={styles.attrRow}>
        <span className={styles.rollableName} onClick={() => rollDice(actor, attr, system.atributos[attr], 4)}>
          {attr.toUpperCase()}
        </span>
        <DiceSelect value={system.atributos[attr]} onChange={(val: number) => updateField(`atributos.${attr}`, val)} />
      </div>
    ))}
  </div>
);
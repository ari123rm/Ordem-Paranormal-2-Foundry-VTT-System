import React from "react";
import styles from "./HeaderSection.module.scss";

export const HeaderSection = ({ actor, system, updateField }: any) => (
  <header className={styles.headerTop}>
    <div className={styles.nameAndColor}>
      <input className={styles.charName} type="text" value={actor.name} onChange={(e) => actor.update({ name: e.target.value })} placeholder="NOME" />
      <input type="color" className={styles.colorPicker} value={system.themeColor} onChange={(e) => updateField("themeColor", e.target.value)} title="Cor do Tema" />
    </div>
    <div className={styles.headerInfo}>
      <input className={styles.headerInput} type="text" value={system.perfil} onChange={(e) => updateField("perfil", e.target.value)} placeholder="Perfil" />
      <span>•</span>
      <input className={styles.headerInput} type="text" value={system.ocupacao} onChange={(e) => updateField("ocupacao", e.target.value)} placeholder="Ocupação" />
      <span className={styles.lvlText}>• NÍVEL</span>
      <input className={styles.levelInput} type="number" value={system.nivel} onChange={(e) => updateField("nivel", Number(e.target.value))} />
    </div>
  </header>
);
import React from "react";
import styles from "./ResourceSection.module.scss"; // <-- Alterado aqui

export const ResourceSection = ({ system, updateField }: any) => (
  <div className={styles.colRight}>
    <div className={styles.resourcesBlock}>
      <div className={styles.resource}>
        <div className={styles.themeBadge}>PV</div>
        <input type="number" value={system.pv.value} onChange={(e) => updateField("pv.value", Number(e.target.value))} />
        <input type="number" value={system.pv.max} onChange={(e) => updateField("pv.max", Number(e.target.value))} />
      </div>
      <div className={styles.resource}>
        <div className={styles.themeBadge}>PD</div>
        <input type="number" value={system.pd.value} onChange={(e) => updateField("pd.value", Number(e.target.value))} />
        <input type="number" value={system.pd.max} onChange={(e) => updateField("pd.max", Number(e.target.value))} />
      </div>
    </div>
  </div>
);
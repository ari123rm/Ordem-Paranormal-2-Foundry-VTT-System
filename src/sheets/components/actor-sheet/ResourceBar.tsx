import React from "react";
import styles from "./ResourceBar.module.scss";

export const ResourceBar = ({ label, resource, updateField, path }: any) => {
  const { value, max, temp } = resource;
  const percent = Math.min(100, Math.max(0, (value / max) * 100)) || 0;

  return (
    <div className={styles.resourceWrapper}>
      <div className={styles.mainBar}>
        <div className={styles.barFill + ' ' + styles[path]} style={{ width: `${percent}%` }}></div>
        <div className={styles.barContent}>
          <span className={styles.label}>{label}</span>
          <div className={styles.inputs}>
            <input type="number" value={value} onChange={(e) => updateField(`${path}.value`, Number(e.target.value))} />
            <span className={styles.divider}>/</span>
            <input type="number" value={max} onChange={(e) => updateField(`${path}.max`, Number(e.target.value))} />
          </div>
        </div>
      </div>
      
      {/* Bloco de Vida Temporária (TMP) */}
      <div className={styles.tmpBox}>
        <input type="number" value={temp} onChange={(e) => updateField(`${path}.temp`, Number(e.target.value))} />
        <span className={styles.tmpLabel}>TMP</span>
      </div>
    </div>
  );
};
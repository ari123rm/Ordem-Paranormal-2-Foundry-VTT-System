import React from "react";
import styles from "./PoiHeader.module.scss";

export const PoiHeader = ({ page, system, isEditable, updateField }: any) => {
  return (
    <header className={styles.poiHeader}>
      <i className="fas fa-search"></i>
      <div className={styles.headerTexts}>
        
        {isEditable ? (
          <>
            <input 
              type="text" 
              className={styles.titleInput} 
              defaultValue={page.name} 
              onBlur={(e) => page.update({ name: e.target.value })} 
              placeholder="NOME DO PONTO" 
            />
            {/* Usamos textarea para permitir múltiplas linhas na edição */}
            <textarea 
              className={styles.subtitleInput} 
              defaultValue={system.subtitle || ""} 
              onBlur={(e) => updateField("subtitle", e.target.value)} 
              placeholder="Subtítulo descritivo..." 
              rows={2}
            />
          </>
        ) : (
          <>
            {/* Usamos divs normais no modo leitura para o texto quebrar a linha naturalmente */}
            <div className={styles.titleInput}>{page.name}</div>
            <div className={styles.subtitleInput}>{system.subtitle}</div>
          </>
        )}

      </div>
    </header>
  );
};
import React, { useRef, useEffect } from "react";
import styles from "./HistoryTab.module.scss";

export const HistoryTab = ({ actor, updateField }: any) => {
  const editorRef = useRef<HTMLElement>(null);
  
  // Salva o valor inicial para o React não re-renderizar enquanto você digita
  const initialHistory = useRef(actor.system.history || "");

  useEffect(() => {
    const proseElement = editorRef.current as any;
    if (!proseElement) return;

    proseElement.document = actor; // Informa que o editor pertence ao Ator
    proseElement.collaborate = false;
    proseElement.value = initialHistory.current;

    const handleChange = (e: any) => {
      updateField("history", e.target.value);
    };

    proseElement.addEventListener("change", handleChange);
    return () => proseElement.removeEventListener("change", handleChange);
  }, [actor]);

  return (
    <div className={styles.historyLayout}>
      {/* Coluna da Esquerda: Títulos e Texto */}
      <div className={styles.textContent}>
        <div className={styles.header}>
          <h1 className={styles.charName}>{actor.name}</h1>
          <h2 className={styles.subtitle}>HISTÓRICO DE PERSONAGEM</h2>
        </div>
        
        <div className={styles.editorWrapper}>
          {React.createElement("prose-mirror", {
            ref: editorRef,
            name: "system.history",
            toggled: true,
            className: styles.proseEditor
          })}
        </div>
      </div>
      
      {/* Coluna da Direita: Imagem do Personagem */}
      <div className={styles.imageContent}>
        <img src={actor.img} alt={actor.name} />
      </div>
    </div>
  );
};
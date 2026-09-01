import React from "react";
import styles from "./SkillsGrid.module.scss";
import { DiceSelect, rollDice, getDiceIcon } from "./DiceHelpers";

const PERICIAS_LISTA = [
  { key: "acrobacia", nome: "Acrobacia" }, { key: "aptidao", nome: "Aptidão", hasSub: true },
  { key: "atletismo", nome: "Atletismo" }, { key: "crime", nome: "Crime" },
  { key: "disciplina", nome: "Disciplina" }, { key: "enganacao", nome: "Enganação" },
  { key: "furtividade", nome: "Furtividade" }, { key: "intimidar", nome: "Intimidar" },
  { key: "intuicao", nome: "Intuição" }, { key: "luta", nome: "Luta" },
  { key: "maquinas", nome: "Máquinas" }, { key: "medicina", nome: "Medicina" },
  { key: "ocultismo", nome: "Ocultismo" }, { key: "percepcao", nome: "Percepção" },
  { key: "persuasao", nome: "Persuasão" }, { key: "pesquisar", nome: "Pesquisar" },
  { key: "pontaria", nome: "Pontaria" }, { key: "sobrevivencia", nome: "Sobrevivência" },
  { key: "tecnologia", nome: "Tecnologia" }, { key: "vigor", nome: "Vigor" }
] as const;

const APTIDAO_VARIANTES = [
  "-","ARTES", "ATUALIDADES", "BUROCRACIA", "EXATAS", "HUMANAS", "TÁTICA"
];

export const SkillsGrid = ({ system, updateField, actor }: any) => {
  return (
    <div className={styles.skillsSection}>
      <div className={styles.themeBadge}>PERÍCIAS</div>
      <div className={styles.skillsGrid}>
        {PERICIAS_LISTA.map((p) => {
          const skillData = system.pericias[p.key];
          const attrValue = system.atributos[skillData.base];
          const subName = p.hasSub ? (skillData.sub || "ARTES") : "";
          const rollLabel = p.hasSub ? `APTIDÃO (${subName})` : p.nome;

          return (
            <div key={p.key} className={styles.skillRow}>
              
              {/* Linha superior: Se for Aptidão, junta o título e o select lado a lado */}
              {p.hasSub ? (
                <div className={styles.aptidaoInlineHeader}>
                  <span className={styles.rollableName} onClick={() => rollDice(actor, rollLabel, attrValue, skillData.value)}>
                    APTIDÃO
                  </span>
                  <select 
                    className={styles.subSelectInline} 
                    value={skillData.sub || "ARTES"} 
                    onChange={(e) => updateField(`pericias.${p.key}.sub`, e.target.value)}
                  >
                    {APTIDAO_VARIANTES.map((v) => (
                      <option key={v} value={v}>({v})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className={styles.rollableName} onClick={() => rollDice(actor, p.nome, attrValue, skillData.value)}>
                  {p.nome.toUpperCase()}
                </span>
              )}

              {/* Controles de Dados e Atributo */}
              <div className={styles.skillControlsHorizontal}>
                <DiceSelect value={skillData.value} onChange={(val: number) => updateField(`pericias.${p.key}.value`, val)} />
                
                <div className={styles.baseSelectorWrapper}>
                  <span className={styles.plusSign}>+</span>
                  
                  <div className={styles.dimmedDice}>
                    <i className={`fas ${getDiceIcon(Number(attrValue))} ${styles.diceBgIcon}`}></i>
                    <span className={styles.staticDiceValue}>{attrValue}</span>
                  </div>

                  <select className={styles.baseSelect} value={skillData.base} onChange={(e) => updateField(`pericias.${p.key}.base`, e.target.value)}>
                    <option value="fisico">FÍS</option>
                    <option value="mente">MEN</option>
                    <option value="emocao">EMO</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
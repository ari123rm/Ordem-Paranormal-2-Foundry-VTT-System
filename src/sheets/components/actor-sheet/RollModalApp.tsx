import React, { useState, useEffect } from "react";
import styles from "./RollModalApp.module.scss";

export const RollModalApp = ({ actor, skillName, initialAttrKey, initialSkillValue, onConfirm, onCancel }: any) => {
  const isAttributeOnly = skillName.toLowerCase() === initialAttrKey.toLowerCase();
  const themeColor = actor?.system?.themeColor || "#c52222";
  const themeMode = game.settings.get("ordemparanormal-v2", "themeMode") || "dark";
  
  const [selectedAttrKey, setSelectedAttrKey] = useState(initialAttrKey);
  const [selectedAttrValue, setSelectedAttrValue] = useState(actor.system.atributos[initialAttrKey]);
  const [selectedSkillValue, setSelectedSkillValue] = useState(initialSkillValue || 4);
  const [bonusDice, setBonusDice] = useState<number[]>([]);
  const [dt, setDt] = useState(""); // <-- Novo state para a DT

  useEffect(() => {
    setSelectedAttrValue(actor.system.atributos[selectedAttrKey]);
  }, [selectedAttrKey, actor]);

  const baseDiceCount = isAttributeOnly ? 1 : 2;
  const totalDice = baseDiceCount + bonusDice.length;
  const maxDice = 4;

  const handleAddBonus = (die: number) => {
    if (totalDice < maxDice) setBonusDice([...bonusDice, die]);
  };

  const handleRemoveBonus = (indexToRemove: number) => {
    setBonusDice(bonusDice.filter((_, i) => i !== indexToRemove));
  };

  const getDiceIcon = (val: number) => {
    if (val === 4) return "fa-dice-d4";
    if (val === 6) return "fa-dice-d6";
    if (val === 8) return "fa-dice-d8";
    if (val === 10) return "fa-dice-d10";
    if (val === 12) return "fa-dice-d12";
    return "fa-dice-d20";
  };

  const diceOptions = [4, 6, 8, 10, 12, 20];

  return (
    <div className={styles.modalContainer + ` op2-theme-${themeMode}`} style={{ "--theme-color": themeColor } as React.CSSProperties}>
      <header className={styles.header}>
        <h2>{skillName}</h2>
        {/* <-- Input de DT adicionado de volta aqui */}
        <div className={styles.dtBox}>
          <span>DT</span>
          <input type="number" value={dt} onChange={(e) => setDt(e.target.value)} placeholder="-" />
        </div>
      </header>

      <section className={styles.baseDiceSection}>
        <div className={styles.diceRow}>
          <select className={styles.labelSelect} value={selectedAttrKey} onChange={(e) => setSelectedAttrKey(e.target.value)}>
            <option value="fisico">Físico</option>
            <option value="mente">Mente</option>
            <option value="emocao">Emoção</option>
          </select>
          <div className={styles.dieSelectWrapper}>
            <i className={`fas ${getDiceIcon(selectedAttrValue)}`}></i>
            <select value={selectedAttrValue} onChange={(e) => setSelectedAttrValue(Number(e.target.value))}>
              {diceOptions.map(v => <option key={v} value={v}>d{v}</option>)}
            </select>
          </div>
        </div>

        {!isAttributeOnly && (
          <div className={styles.diceRow}>
            <span className={styles.staticLabel}>{skillName}</span>
            <div className={styles.dieSelectWrapper}>
              <i className={`fas ${getDiceIcon(selectedSkillValue)}`}></i>
              <select value={selectedSkillValue} onChange={(e) => setSelectedSkillValue(Number(e.target.value))}>
                {diceOptions.map(v => <option key={v} value={v}>d{v}</option>)}
              </select>
            </div>
          </div>
        )}
      </section>

      <section className={styles.bonusSection}>
        <div className={styles.bonusHeader}>
          <span className={styles.title}>BÔNUS SITUACIONAL</span>
          <span className={styles.counter} style={{ color: totalDice === maxDice ? 'var(--theme-color)' : 'white' }}>
            Dados {totalDice} / {maxDice}
          </span>
        </div>

        <div className={styles.diceButtons}>
          {diceOptions.map(die => (
            <button key={die} onClick={() => handleAddBonus(die)} disabled={totalDice >= maxDice}>
              <i className={`fas ${getDiceIcon(die)}`}></i> d{die}
            </button>
          ))}
        </div>

        <div className={styles.selectedBonus}>
          {bonusDice.length === 0 ? (
            <span className={styles.emptyMsg}>Nenhum bônus selecionado.</span>
          ) : (
            bonusDice.map((die, index) => (
              <div key={index} className={styles.bonusBadge} onClick={() => handleRemoveBonus(index)} title="Clique para remover">
                <i className={`fas ${getDiceIcon(die)}`}></i> d{die} 
                <i className="fas fa-times" style={{ fontSize: '0.7rem', marginLeft: '4px' }}></i>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <button className={styles.btnCancel} onClick={onCancel}>Cancelar</button>
        {/* <-- Repassando a DT na confirmação */}
        <button className={styles.btnRoll} onClick={() => onConfirm({ 
            finalAttrValue: selectedAttrValue, 
            finalSkillValue: isAttributeOnly ? null : selectedSkillValue, 
            bonusDice,
            dt: dt ? Number(dt) : null 
          })}>
          <i className="fas fa-dice-d20"></i> Rolar
        </button>
      </footer>
    </div>
  );
};
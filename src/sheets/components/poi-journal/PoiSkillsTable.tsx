import React from "react";
import styles from "./PoiSkillsTable.module.scss";

// Função para renderizar NEGRITO, CAIXA VERDE e o ÍCONE DE CADEADO!
export const renderRichText = (text: string) => {
  if (!text) return null;
  return text.split('\n').map((line, lineIdx) => {
    const greenParts = line.split(/\[\[(.*?)\]\]/g);
    const renderedLine = greenParts.map((gPart, gIdx) => {
      if (gIdx % 2 === 1) return <span key={`g-${gIdx}`} className={styles.greenHighlight}>{gPart}</span>;
      
      const boldParts = gPart.split(/\*\*(.*?)\*\*/g);
      return boldParts.map((bPart, bIdx) => {
        if (bIdx % 2 === 1) return <strong key={`b-${bIdx}`}>{bPart}</strong>;
        
        // Magia do Cadeado: Digite [L] para aparecer o ícone!
        const lockParts = bPart.split(/\[L\]/g);
        return lockParts.map((lPart, lIdx) => {
          if (lIdx % 2 === 1) return <i key={`l-${lIdx}`} className="fas fa-lock" style={{ fontSize: "0.85em", marginLeft: "4px", color: "#1a1a1a" }}></i>;
          return <span key={`l-${lIdx}`}>{lPart}</span>;
        });
      });
    });
    return (
      <React.Fragment key={lineIdx}>
        {renderedLine}
        {lineIdx < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
};

const PERICIAS = [
  "Acrobacia", "Aptidão (Artes)", "Aptidão (Atualidades)", "Aptidão (Burocracia)", 
  "Aptidão (Exatas)", "Aptidão (Humanas)", "Aptidão (Tática)", "Atletismo", "Crime", 
  "Disciplina", "Enganação", "Furtividade", "Intimidar", "Intuição", "Luta", 
  "Máquinas", "Medicina", "Ocultismo", "Percepção", "Persuasão", 
  "Pesquisar", "Pontaria", "Sobrevivência", "Tecnologia", "Vigor"
];

const getSkillColorClass = (skills: string[]) => {
  if (!skills || skills.length === 0) return "color-gray";
  const mainSkill = skills[0].toLowerCase();
  
  if (mainSkill.includes("intuição")) return "color-cyan";
  if (mainSkill.includes("percepção")) return "color-green";
  if (mainSkill.includes("pesquisar")) return "color-yellow";
  if (mainSkill.includes("medicina") || mainSkill.includes("sobrevivência") || mainSkill.includes("ocultismo") || mainSkill.includes("disciplina")) return "color-purple";
  if (mainSkill.includes("acrobacia") || mainSkill.includes("atletismo") || mainSkill.includes("luta") || mainSkill.includes("pontaria") || mainSkill.includes("vigor")) return "color-red";
  if (mainSkill.includes("enganação") || mainSkill.includes("intimidar") || mainSkill.includes("persuasão")) return "color-orange";
  if (mainSkill.includes("aptidão") || mainSkill.includes("máquinas") || mainSkill.includes("tecnologia")) return "color-blue";
  
  return "color-gray";
};

export const PoiSkillsTable = ({ skillGroups, isEditable, updateGroupLabel, addSkillGroup, removeSkillGroup, addCheckToGroup, updateCheck, removeCheck, toggleSkill }: any) => {
  if (!skillGroups || skillGroups.length === 0) {
    if (!isEditable) return null;
  }

  return (
    <>
      <table className={styles.poiTable}>
        <thead>
          <tr>
            <th style={{ width: "22%" }}>Perícia</th>
            <th style={{ width: "12%", textAlign: "center" }}>DT</th>
            <th style={{ width: isEditable ? "58%" : "66%" }}>Informação</th>
            {isEditable && <th style={{ width: "8%", textAlign: "center" }}>Ação</th>}
          </tr>
        </thead>
        <tbody>
          {(skillGroups || []).map((group: any, gIdx: number) => (
            <React.Fragment key={gIdx}>
              {(group.checks || []).map((check: any, cIdx: number) => (
                <tr key={cIdx} className={styles[getSkillColorClass(group.skills)]}>
                  
                  {cIdx === 0 && (
                    <td rowSpan={group.checks.length} className={styles.skillCell}>
                      {isEditable ? (
                        <div className={styles.editSkills}>
                          <select onChange={(e) => toggleSkill(gIdx, e.target.value)} value="">
                            <option value="" disabled>Adicionar Perícia...</option>
                            {PERICIAS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <div className={styles.skillTags}>
                            {(group.skills || []).map((s: string) => (
                              <span key={s} className={styles.tag}>
                                {s} <i className="fas fa-times" onClick={() => toggleSkill(gIdx, s)}></i>
                              </span>
                            ))}
                          </div>
                          {/* AQUI ESTAVA O BUG DO RESET! Agora usa a função segura */}
                          <input 
                            type="text" 
                            placeholder="Ex: [L] (apenas Victor)" 
                            defaultValue={group.customLabel || ""} 
                            onBlur={e => updateGroupLabel(gIdx, e.target.value)} 
                          />
                        </div>
                      ) : (
                        <div className={styles.skillText}>
                          {(group.skills || []).map((skillName: string, i: number) => {
                            const hasSub = skillName.includes("(");
                            const name = hasSub ? skillName.split("(")[0].trim() : skillName;
                            const sub = hasSub ? `(${skillName.split("(")[1]}` : "";
                            
                            return (
                              <React.Fragment key={skillName}>
                                {i > 0 && " ou "}
                                {name}
                                {hasSub && <span className={styles.subSkill}><br/>{sub}</span>}
                              </React.Fragment>
                            );
                          })}
                          {/* Rich Text no subtítulo permite cadeados e negritos! */}
                          {group.customLabel && <span className={styles.customLabel}><br/>{renderRichText(group.customLabel)}</span>}
                        </div>
                      )}
                    </td>
                  )}

                  <td className={styles.centerCol}>
                    {isEditable ? (
                      <div className={styles.dtEditWrapper}>
                        <input 
                          type="text" 
                          defaultValue={check.dt} 
                          onBlur={(e) => updateCheck(gIdx, cIdx, "dt", e.target.value)} 
                        />
                        {cIdx === group.checks.length - 1 && (
                          <button type="button" className={styles.addDtBtnInline} onClick={() => addCheckToGroup(gIdx)} title="Adicionar outra DT para esta perícia">
                            <i className="fas fa-plus"></i> DT
                          </button>
                        )}
                      </div>
                    ) : (
                      <span>{check.dt}</span>
                    )}
                  </td>
                  
                  <td className={styles.infoCol}>
                    {isEditable ? (
                      <textarea 
                        defaultValue={check.info} 
                        onBlur={(e) => updateCheck(gIdx, cIdx, "info", e.target.value)} 
                        placeholder="Escreva a informação. Use **negrito** e [[caixa verde]]"
                      />
                    ) : (
                      /* Rich Text na informação! */
                      <div className={styles.renderedInfo}>{renderRichText(check.info)}</div>
                    )}
                  </td>

                  {isEditable && (
                    <td className={styles.actionCol}>
                      {group.checks.length > 1 ? (
                        <button type="button" className={styles.delRowBtn} title="Remover DT" onClick={() => removeCheck(gIdx, cIdx)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      ) : (
                        <button type="button" className={styles.delRowBtn} title="Remover Bloco" onClick={() => removeSkillGroup(gIdx)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {isEditable && (
        <button type="button" className={styles.addBlockBtn} onClick={addSkillGroup}>
          + Adicionar Bloco de Perícia
        </button>
      )}
    </>
  );
};
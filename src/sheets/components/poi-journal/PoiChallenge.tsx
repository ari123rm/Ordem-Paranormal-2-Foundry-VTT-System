import React from "react";
import styles from "./PoiChallenge.module.scss";

// Função aprimorada para renderizar caixas verdes, NEGRITO e quebras de linha!
const renderChallengeText = (text: string) => {
  if (!text) return null;
  
  return text.split('\n').map((line, lineIdx) => {
    // Processa os blocos verdes [[texto]]
    const greenParts = line.split(/\[\[(.*?)\]\]/g);
    
    const renderedLine = greenParts.map((gPart, gIdx) => {
      if (gIdx % 2 === 1) return <span key={`g-${gIdx}`} className={styles.greenHighlight}>{gPart}</span>;
      
      // Processa o negrito **texto**
      const boldParts = gPart.split(/\*\*(.*?)\*\*/g);
      return boldParts.map((bPart, bIdx) => {
        if (bIdx % 2 === 1) return <strong key={`b-${bIdx}`}>{bPart}</strong>;
        return <span key={`b-${bIdx}`}>{bPart}</span>;
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

export const PoiChallenge = ({ 
  challenges = [], isEditable, updateField, addChallenge, removeChallenge, 
  addTask, updateTask, removeTask, updateChallengeField,
  addTableTask, updateTableTask, removeTableTask 
}: any) => {
  if (!isEditable && challenges.length === 0) return null;

  return (
    <div className={styles.challengesContainer}>
      {challenges.map((chal: any, cIdx: number) => {
        const type = chal.type || "simple";
        const isTable = type === "table";
        const simpleTasks = chal.tasks || [];
        const tableTasks = chal.tableTasks || [];

        let leftRowSpan = isTable ? (tableTasks.length + 1) : Math.max(1, simpleTasks.length);
        if (isEditable) leftRowSpan += 1;

        return (
          <table key={cIdx} className={styles.challengeTable}>
            <tbody>
              <tr>
                <td rowSpan={leftRowSpan} className={styles.challengeHeaderCell}>
                  <i className="fas fa-unlock-alt"></i>
                  {isEditable ? (
                    <>
                      <select value={type} onChange={e => updateChallengeField(cIdx, "type", e.target.value)} className={styles.typeSelect}>
                        <option value="simple">Lista Simples</option>
                        <option value="table">Tabela de Rolagem</option>
                      </select>
                      <input type="text" defaultValue={chal.title || ""} onBlur={e => updateChallengeField(cIdx, "title", e.target.value)} placeholder="TÍTULO" />
                      <input type="text" defaultValue={chal.subtitle || ""} onBlur={e => updateChallengeField(cIdx, "subtitle", e.target.value)} placeholder="Subtítulo" />
                      <input type="text" className={styles.badgeInput} defaultValue={chal.badge || ""} onBlur={e => updateChallengeField(cIdx, "badge", e.target.value)} placeholder="Badge (Ex: HACK TÉCNICO)" />
                      <textarea className={styles.descInput} defaultValue={chal.description || ""} onBlur={e => updateChallengeField(cIdx, "description", e.target.value)} placeholder="Descrição menor..." />
                    </>
                  ) : (
                    <div>
                      {chal.title} <br/>♦ {chal.subtitle}
                      {chal.badge && <div className={styles.challengeBadge}>{chal.badge}</div>}
                      {chal.description && <div className={styles.challengeDesc}>{chal.description}</div>}
                    </div>
                  )}
                </td>
                
                {isTable ? (
                  <>
                    <td className={styles.tableHeaderCell}>
                      {isEditable ? <input defaultValue={chal.col1Name} onBlur={e => updateChallengeField(cIdx, "col1Name", e.target.value)} /> : chal.col1Name}
                    </td>
                    <td className={styles.tableHeaderCell}>
                      {isEditable ? <input defaultValue={chal.col2Name} onBlur={e => updateChallengeField(cIdx, "col2Name", e.target.value)} /> : chal.col2Name}
                    </td>
                  </>
                ) : (
                  <td colSpan={2} className={styles.challengeTaskCell}>
                    {simpleTasks.length > 0 ? (
                      <div className={styles.taskRow}>
                        {isEditable ? (
                          <textarea 
                            defaultValue={simpleTasks[0]} 
                            onBlur={e => updateTask(cIdx, 0, e.target.value)} 
                            placeholder="Ex: **ARROMBAR** \n Se escolherem..."
                            className={styles.taskTextarea}
                          />
                        ) : (
                          <div className={styles.renderedTask}>{renderChallengeText(simpleTasks[0])}</div>
                        )}
                        {isEditable && <i className="fas fa-times" onClick={() => removeTask(cIdx, 0)}></i>}
                      </div>
                    ) : (
                      <span className={styles.emptyTaskText}>Nenhuma linha adicionada</span>
                    )}
                  </td>
                )}

                {isEditable && (
                  <td rowSpan={leftRowSpan} className={styles.challengeActionCell}>
                    <button type="button" className={styles.delChalBtn} onClick={() => removeChallenge(cIdx)} title="Remover Bloco">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                )}
              </tr>
              
              {isTable ? (
                tableTasks.map((t: any, tIdx: number) => (
                  <tr key={`tbl-${tIdx}`}>
                    <td className={styles.tableDataCellCenter}>
                      {isEditable ? <input defaultValue={t.col1} placeholder="Ex: 10+" onBlur={e => updateTableTask(cIdx, tIdx, "col1", e.target.value)} /> : renderChallengeText(t.col1)}
                    </td>
                    <td className={styles.tableDataCell}>
                      <div className={styles.taskRow}>
                        {isEditable ? <input defaultValue={t.col2} placeholder="Ex: 16 x 5 = [[80]]" onBlur={e => updateTableTask(cIdx, tIdx, "col2", e.target.value)} /> : renderChallengeText(t.col2)}
                        {isEditable && <i className="fas fa-times" onClick={() => removeTableTask(cIdx, tIdx)}></i>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                simpleTasks.slice(1).map((task: string, tIdx: number) => (
                  <tr key={`smp-${tIdx + 1}`}>
                    <td colSpan={2} className={styles.challengeTaskCell}>
                      <div className={styles.taskRow}>
                        {isEditable ? (
                          <textarea 
                            defaultValue={task} 
                            onBlur={e => updateTask(cIdx, tIdx + 1, e.target.value)} 
                            className={styles.taskTextarea}
                          />
                        ) : (
                          <div className={styles.renderedTask}>{renderChallengeText(task)}</div>
                        )}
                        {isEditable && <i className="fas fa-times" onClick={() => removeTask(cIdx, tIdx + 1)}></i>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              
              {isEditable && (
                <tr>
                  <td colSpan={2} className={styles.challengeFooterCell}>
                    <button type="button" className={styles.addTaskBtn} onClick={() => isTable ? addTableTask(cIdx) : addTask(cIdx)}>
                      + Adicionar Linha {isTable ? "na Tabela" : ""}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        );
      })}

      {isEditable && (
        <button type="button" className={styles.addChallengeBlockBtn} onClick={addChallenge}>
          + Adicionar Bloco de Desafio
        </button>
      )}
    </div>
  );
};
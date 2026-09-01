import styles from "./PoiJournalSheet.module.scss";
import React, { useRef, useEffect } from "react";
import { PoiHeader } from "./poi-journal/PoiHeader";
import { PoiChallenge } from "./poi-journal/PoiChallenge";
import { PoiSkillsTable } from "./poi-journal/PoiSkillsTable";
import { EnrichedHtml } from "./actor-sheet/EnrichedHtml";

export const PoiJournalApp = ({ page, isEditable, sheetInstance }: { page: any, isEditable: boolean, sheetInstance: any }) => {
  const system = page.system;
  const editorRef = useRef<HTMLElement>(null);
  
  // Referência nova para a barra de rolagem
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateField = (path: string, value: any) => page.update({ [`system.${path}`]: value });

  // === MAGIA DO SCROLL: Restaura a posição salva instantaneamente ===
  useEffect(() => {
    if (scrollRef.current && sheetInstance?.savedScrollTop) {
      scrollRef.current.scrollTop = sheetInstance.savedScrollTop;
    }
  }, []);

  // Grava o scroll na memória sempre que mexer a tela
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (sheetInstance) {
      sheetInstance.savedScrollTop = (e.target as HTMLDivElement).scrollTop;
    }
  };

  // --- LÓGICA DE MÚLTIPLOS DESAFIOS ---
  const addChallenge = () => {
    updateField("challenges", [...(system.challenges || []), { type: "simple", title: "DESAFIO DE ACESSO", subtitle: "PORTA TRANCADA", tasks: [""] }]);
  };
  const removeChallenge = (cIdx: number) => {
    updateField("challenges", (system.challenges || []).filter((_, i) => i !== cIdx));
  };
  const updateChallengeField = (cIdx: number, key: string, val: string) => {
    const chals = JSON.parse(JSON.stringify(system.challenges || []));
    chals[cIdx][key] = val;
    updateField("challenges", chals);
  };
  const addTask = (cIdx: number) => {
    const chals = JSON.parse(JSON.stringify(system.challenges || []));
    chals[cIdx].tasks.push("Nova Tarefa");
    updateField("challenges", chals);
  };
  const updateTask = (cIdx: number, tIdx: number, val: string) => {
    const chals = JSON.parse(JSON.stringify(system.challenges || []));
    chals[cIdx].tasks[tIdx] = val;
    updateField("challenges", chals);
  };
  const removeTask = (cIdx: number, tIdx: number) => {
    const chals = JSON.parse(JSON.stringify(system.challenges || []));
    chals[cIdx].tasks.splice(tIdx, 1);
    updateField("challenges", chals);
  };

  const addTableTask = (cIdx: number) => {
    const chals = JSON.parse(JSON.stringify(system.challenges || []));
    if (!chals[cIdx].tableTasks) chals[cIdx].tableTasks = [];
    chals[cIdx].tableTasks.push({ col1: "", col2: "" });
    updateField("challenges", chals);
  };
  const updateTableTask = (cIdx: number, tIdx: number, key: string, val: string) => {
    const chals = JSON.parse(JSON.stringify(system.challenges || []));
    chals[cIdx].tableTasks[tIdx][key] = val;
    updateField("challenges", chals);
  };
  const removeTableTask = (cIdx: number, tIdx: number) => {
    const chals = JSON.parse(JSON.stringify(system.challenges || []));
    chals[cIdx].tableTasks.splice(tIdx, 1);
    updateField("challenges", chals);
  };

  // --- LÓGICA DE PERÍCIAS ---
  const addSkillGroup = () => {
    updateField("skillGroups", [...(system.skillGroups || []), { skills: [], customLabel: "", checks: [{ dt: 10, info: "" }] }]);
  };
  const removeSkillGroup = (gIdx: number) => {
    updateField("skillGroups", (system.skillGroups || []).filter((_, i: number) => i !== gIdx));
  };
  const addCheckToGroup = (gIdx: number) => {
    const groups = JSON.parse(JSON.stringify(system.skillGroups || []));
    groups[gIdx].checks.push({ dt: 10, info: "" });
    updateField("skillGroups", groups);
  };
  const updateCheck = (gIdx: number, cIdx: number, key: string, val: any) => {
    const groups = JSON.parse(JSON.stringify(system.skillGroups || []));
    groups[gIdx].checks[cIdx][key] = val;
    updateField("skillGroups", groups);
  };
  const removeCheck = (gIdx: number, cIdx: number) => {
    const groups = JSON.parse(JSON.stringify(system.skillGroups || []));
    groups[gIdx].checks.splice(cIdx, 1);
    updateField("skillGroups", groups);
  };
  const toggleSkill = (gIdx: number, skill: string) => {
    const groups = JSON.parse(JSON.stringify(system.skillGroups || []));
    const skills = groups[gIdx].skills || [];
    if (skills.includes(skill)) {
      groups[gIdx].skills = skills.filter((s: string) => s !== skill);
    } else {
      groups[gIdx].skills.push(skill);
    }
    updateField("skillGroups", groups);
  };

  const updateGroupLabel = (gIdx: number, val: string) => {
    const groups = JSON.parse(JSON.stringify(system.skillGroups || []));
    groups[gIdx].customLabel = val;
    updateField("skillGroups", groups);
  };

  // --- CONTROLE ABSOLUTO DO PROSEMIRROR ---
  useEffect(() => {
    const el = editorRef.current as any;
    if (!el) return;
    el.document = page; 
    el.collaborate = false; 
    el.value = system.description || "";
    
    if (!isEditable) {
      el.removeAttribute("toggled");
      el.setAttribute("editable", "false");
    } else {
      el.setAttribute("toggled", "true");
      el.setAttribute("editable", "true");
    }

    const handleChange = (e: any) => updateField("description", e.target.value);
    el.addEventListener("change", handleChange);
    return () => el.removeEventListener("change", handleChange);
  }, [isEditable]);

  return (
    <div 
      ref={scrollRef} 
      className={styles.poiContainer} 
      onScroll={handleScroll} // Associa o evento de scroll
    >
      <PoiHeader page={page} system={system} isEditable={isEditable} updateField={updateField} />

      <div className={styles.contentWrapper}>
        <PoiChallenge 
          challenges={system.challenges} 
          isEditable={isEditable} 
          updateField={updateField} 
          addChallenge={addChallenge}
          removeChallenge={removeChallenge}
          addTask={addTask}
          updateTask={updateTask}
          removeTask={removeTask}
          updateChallengeField={updateChallengeField}
          addTableTask={addTableTask}
          updateTableTask={updateTableTask}
          removeTableTask={removeTableTask}
        />

        <PoiSkillsTable 
          skillGroups={system.skillGroups} 
          isEditable={isEditable} 
          updateField={updateField} 
          addSkillGroup={addSkillGroup} 
          removeSkillGroup={removeSkillGroup} 
          addCheckToGroup={addCheckToGroup} 
          updateCheck={updateCheck} 
          removeCheck={removeCheck} 
          toggleSkill={toggleSkill} 
          updateGroupLabel={updateGroupLabel} /* <--- NÃO ESQUEÇA DE PASSAR ISSO AQUI */
        />

        {/* DESCRIÇÃO DO LIVRO */}
        <div className={styles.poiDescription}>
          <div className={styles.iconCol}><i className="fas fa-book-open"></i></div>
          <div className={styles.editorCol}>
            {isEditable ? (
              React.createElement("prose-mirror", { 
                ref: editorRef, 
                name: "system.description"
              })
            ) : (
              <EnrichedHtml content={system.description || ""} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
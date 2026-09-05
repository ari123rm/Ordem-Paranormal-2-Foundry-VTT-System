// sheets/components/ItemSheetApp.tsx
import React, { useRef, useEffect } from "react";
import styles from "./ItemSheetApp.module.scss";

export function ItemSheetApp({ item }: { item: Item.Implementation }) {
  const system = item.system;
  
  // Constantes para definir o que renderizar
  const isHabilidade = item.type === "habilidade";
  const isPerfil = item.type === "perfil";
  const isOcupacao = item.type === "ocupacao";

  const updateField = (path: string, value: any) => {
    item.update({ [`system.${path}`]: value });
  };

  // Funções exclusivas de Habilidade
  const addCost = () => updateField("costs", [...system.costs, { amount: 1, type: "PD" }]);
  const updateCost = (index: number, key: string, value: any) => {
    const newCosts = [...system.costs];
    newCosts[index][key] = value;
    updateField("costs", newCosts);
  };
  const removeCost = (index: number) => updateField("costs", system.costs.filter((_, i) => i !== index));

  // Funções exclusivas de Perfil (Drag & Drop)
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data.type === "Item") {
        const droppedItem = await fromUuid(data.uuid);
        if (droppedItem && droppedItem.type === "habilidade") {
          updateField("grants", [
            ...(system.grants || []), 
            { level: 1, uuid: data.uuid, name: droppedItem.name }
          ]);
        }
      }
    } catch (err) {
      console.error("Erro ao soltar item", err);
    }
  };

  const updateGrantLevel = (index: number, newLevel: number) => {
    const newGrants = [...system.grants];
    newGrants[index].level = newLevel;
    updateField("grants", newGrants);
  };

  const removeGrant = (index: number) => {
    updateField("grants", system.grants.filter((_: any, i: number) => i !== index));
  };

  // Editor nativo
  const editorRef = useRef<HTMLElement>(null);
  const initialDescription = useRef(system.description);

  useEffect(() => {
    const proseElement = editorRef.current as any;
    if (!proseElement) return;
    proseElement.document = item;
    proseElement.collaborate = false;
    proseElement.value = initialDescription.current;
    
    const handleChange = (e: any) => updateField("description", e.target.value);
    proseElement.addEventListener("change", handleChange);
    return () => proseElement.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className={styles.itemSheet}>
      <header className={styles.header}>
        <img src={item.img} alt={item.name} onClick={() => {
          new FilePicker({ type: "image", current: item.img, callback: (path: string) => item.update({ img: path }) }).render(true);
        }} />
        <div style={{ flex: 1 }}>
          <input type="text" value={item.name} onChange={(e) => item.update({ name: e.target.value })} placeholder="Nome" />
          <div style={{ color: "#aaa", fontSize: "0.8rem", textTransform: "uppercase", marginTop: "4px" }}>
            {item.type}
          </div>
        </div>
      </header>

      {/* RENDERIZAÇÃO CONDICIONAL PARA HABILIDADE */}
      {isHabilidade && (
        <>
          <div className={styles.configGrid}>
            <label>Usos Máximos (0 = Sem limite):
              <input type="number" value={system.uses.max} onChange={(e) => updateField("uses.max", Number(e.target.value))} />
            </label>
          </div>

          <div className={styles.costsSection}>
            <div className={styles.costsHeader}>
              <span>Custos da Habilidade</span>
              <button className={styles.addBtn} onClick={addCost}><i className="fas fa-plus"></i></button>
            </div>
            <div className={styles.costsList}>
              {system.costs.map((cost: any, index: number) => (
                <div key={index} className={styles.costRow}>
                  <input type="number" value={cost.amount} min="1" onChange={(e) => updateCost(index, "amount", Number(e.target.value))} />
                  <select value={cost.type} onChange={(e) => updateCost(index, "type", e.target.value)}>
                    <option value="PD">PD</option>
                    <option value="PV">PV</option>
                  </select>
                  <button className={styles.deleteBtn} onClick={() => removeCost(index)}><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* RENDERIZAÇÃO CONDICIONAL PARA PERFIL */}
      {isPerfil && (
        <>
          <div className={styles.configGrid}>
            <label>Cor Base do Perfil:
              <input 
                type="color" 
                value={system.themeColor || "#c52222"} 
                onChange={(e) => updateField("themeColor", e.target.value)} 
                style={{ width: "100%", height: "36px", padding: "0", cursor: "pointer", border: "1px solid #444", marginTop: "4px" }}
              />
            </label>
          </div>

          <div 
            style={{ background: "rgba(0,0,0,0.3)", border: "1px dashed #555", padding: "10px", borderRadius: "4px", marginTop: "12px" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div style={{ color: "#aaa", fontWeight: "bold", marginBottom: "8px", textAlign: "center" }}>
              <i className="fas fa-download"></i> Arraste Habilidades para Conceder
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {(system.grants || []).map((grant: any, index: number) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#111", padding: "4px 8px", borderRadius: "4px" }}>
                  <span style={{ color: "#fff", flex: 1, fontWeight: "bold", fontSize: "0.9rem" }}>{grant.name}</span>
                  <span style={{ color: "#888", fontSize: "0.8rem" }}>Nível</span>
                  <input 
                    type="number" 
                    value={grant.level} 
                    min="1"
                    onChange={(e) => updateGrantLevel(index, Number(e.target.value))} 
                    style={{ width: "40px", background: "#222", color: "#fff", border: "1px solid #444", textAlign: "center" }}
                  />
                  <i className="fas fa-trash" style={{ color: "#f44336", cursor: "pointer" }} onClick={() => removeGrant(index)}></i>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className={styles.editorContainer}>
        <label>Descrição:</label>
        {React.createElement("prose-mirror", {
          ref: editorRef,
          name: "system.description",
          toggled: true,
          className: styles.proseEditor
        })}
      </div>
    </div>
  );
}
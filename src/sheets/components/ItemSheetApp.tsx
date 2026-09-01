import React, { useRef, useEffect } from "react";
import styles from "./ItemSheetApp.module.scss";

export function ItemSheetApp({ item }: { item: Item.Implementation }) {
  const system = item.system;

  const updateField = (path: string, value: any) => {
    item.update({ [`system.${path}`]: value });
  };

  // Funções de Custos dinâmicos...
  const addCost = () => updateField("costs", [...system.costs, { amount: 1, type: "PD" }]);
  const updateCost = (index: number, key: string, value: any) => {
    const newCosts = [...system.costs];
    newCosts[index][key] = value;
    updateField("costs", newCosts);
  };
  const removeCost = (index: number) => updateField("costs", system.costs.filter((_, i) => i !== index));

  // Acopla o listener no editor nativo do Foundry
  const editorRef = useRef<HTMLElement>(null);
  const initialDescription = useRef(system.description);

  useEffect(() => {
    const proseElement = editorRef.current as any; 
    if (!proseElement) return;

    // 1. Configurações essenciais
    proseElement.document = item;
    proseElement.collaborate = false;
    
    // 2. INJETA O TEXTO SALVO DIRETAMENTE AQUI (Essa é a mágica)
    proseElement.value = initialDescription.current;

    const handleChange = (e: any) => {
      updateField("description", e.target.value);
    };

    proseElement.addEventListener("change", handleChange);
    return () => proseElement.removeEventListener("change", handleChange);
  }, []); // <-- Deixe o array vazio para ele rodar só 1 vez quando a ficha abre

  return (
    <div className={styles.itemSheet}>
      <header className={styles.header}>
        <img src={item.img} alt={item.name} onClick={() => {
          new FilePicker({ type: "image", current: item.img, callback: (path: string) => item.update({ img: path }) }).render(true);
        }} />
        <input type="text" value={item.name} onChange={(e) => item.update({ name: e.target.value })} placeholder="Nome da Habilidade" />
      </header>

      <div className={styles.configGrid}>
        <label>Categoria:
          <select value={system.category} onChange={(e) => updateField("category", e.target.value)}>
            <option value="Perfil">Perfil</option>
            <option value="Ocupação">Ocupação</option>
            <option value="Habilidade">Habilidade / Poder</option>
          </select>
        </label>
        
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
          {system.costs.length === 0 && <span className={styles.emptyCost}>Passivo / Sem Custo</span>}
        </div>
      </div>

      <div className={styles.editorContainer}>
        <label>Descrição (Aceita Fórmulas e Arrastar Itens):</label>
        
        {/* Agora o React só cria a casca, e o useEffect cuida dos dados */}
        {React.createElement("prose-mirror", {
          ref: editorRef,
          name: "system.description",
          toggled: true,
          className: styles.proseEditor
          // <-- Removemos o value daqui!
        })}
      </div>
    </div>
  );
}
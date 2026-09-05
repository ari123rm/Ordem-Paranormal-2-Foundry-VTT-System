// sheets/components/actor-sheet/HeaderSection.tsx
import React, { useEffect } from "react";
import styles from "./HeaderSection.module.scss";
import { syncProfileGrants } from "./utils"; 

export const HeaderSection = ({ actor, system, updateField }: any) => {
  
  // Encontra o item do tipo Perfil dentro do Ator
  const perfilItem = actor.items.find((i: any) => i.type === "perfil");

  // Hook poderoso: Sempre que o Perfil mudar (ou o Nível do ator), ele atualiza as cores e concede os itens
  useEffect(() => {
    if (perfilItem) {
      // Se a cor do perfil for diferente da cor atual da ficha, ele força a atualização
      if (perfilItem.system.themeColor && system.themeColor !== perfilItem.system.themeColor) {
        updateField("themeColor", perfilItem.system.themeColor);
      }
      
      // Sincroniza as habilidades (Motor de Level Up)
      syncProfileGrants(actor, system.nivel);
    }
  }, [perfilItem?.id, perfilItem?.system?.themeColor, system.nivel]);

  const openPerfilCompendium = () => {
    const pack = game.packs.get("ordemparanormal-v2.perfis");
    if (pack) {
      pack.render(true);
    } else {
      ui.notifications?.warn("Compêndio de perfis (ordemparanormal-v2.perfis) não foi encontrado!");
    }
  };

  const removePerfil = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede de abrir o compêndio ao clicar no X
    if (perfilItem) actor.deleteEmbeddedDocuments("Item", [perfilItem.id]);
  };

  return (
    <header className={styles.headerTop}>
      <div className={styles.nameAndColor}>
        <input className={styles.charName} type="text" value={actor.name} onChange={(e) => actor.update({ name: e.target.value })} placeholder="NOME" />
        
        {/* O ColorPicker manual só aparece se o jogador NÃO tiver um perfil equipado */}
        {!perfilItem && (
          <input type="color" className={styles.colorPicker} value={system.themeColor} onChange={(e) => updateField("themeColor", e.target.value)} title="Cor do Tema" />
        )}
      </div>
      
      <div className={styles.headerInfo}>
        
        {/* BOTÃO DO PERFIL CLICÁVEL */}
        <div 
          className={styles.headerInput} 
          onClick={openPerfilCompendium}
          title={perfilItem ? "Clique para abrir o Compêndio e trocar o Perfil" : "Clique para selecionar um Perfil"}
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            borderBottom: `1px dashed ${system.themeColor}`,
            padding: "0 8px",
            minWidth: "120px"
          }}
        >
          {perfilItem ? perfilItem.name : "Selecionar Perfil"}
          
          {perfilItem && (
            <i 
              className="fas fa-times" 
              style={{ color: "#f44336", fontSize: "0.85rem", marginLeft: "8px", opacity: 0.7 }} 
              onClick={removePerfil}
              title="Remover Perfil"
            ></i>
          )}
        </div>
        
        <span> </span>
        <input className={styles.headerInput} type="text" value={system.ocupacao} onChange={(e) => updateField("ocupacao", e.target.value)} placeholder="Ocupação" />
        
        <span className={styles.lvlText}>NÍVEL</span>
        <input 
          className={styles.levelInput} 
          type="number" 
          value={system.nivel} 
          onChange={(e) => updateField("nivel", Number(e.target.value))} 
        />
      </div>
    </header>
  );
};
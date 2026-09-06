import React, { useState } from "react";
import styles from "./CharacterSheetApp.module.scss";
import { createUpdateData , formatCosts, useItem} from "./actor-sheet/utils";
import { SideNav } from "./actor-sheet/SideNav";
import { HeaderSection } from "./actor-sheet/HeaderSection";
import { AttributeSection } from "./actor-sheet/AttributeSection";
import { ResourceBar } from "./actor-sheet/ResourceBar";
import { SkillsGrid } from "./actor-sheet/SkillsGrid";
import { AbilitiesList } from "./actor-sheet/AbilitiesList";
import { HistoryTab } from "./actor-sheet/HistoryTab";

export function CharacterSheetApp({ actor }: { actor: Actor.Implementation }) {
  const system = actor.system;
  const themeMode = game.settings.get("ordemparanormal-v2", "themeMode") || "dark";
  const [activeTab, setActiveTab] = useState<"principal" | "habilidades" | "historico">("principal");

  const updateField = (path: string, value: any) => actor.update(createUpdateData(path, value));
  const favoriteItems = Array.from(actor.items.values()).filter((i: any) => i.system.isFavorite);
  
  const onEditImage = async () => {
    new FilePicker({
      type: "image",
      current: actor.img,
      callback: (path: string) => actor.update({ img: path })
    }).render(true);
  };

  return (
    <div className={`${styles.sheetWindow} op2-theme-${themeMode}`} style={{ "--theme-color": system.themeColor } as React.CSSProperties}>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.mainContent}>
        {activeTab === "principal" && (
          <div className={styles.layoutPrincipal}>
            <HeaderSection actor={actor} system={system} updateField={updateField} />
            
            <div className={styles.middleSection}>
              <AttributeSection system={system} updateField={updateField} actor={actor} />
              
              <div className={styles.colCenter}>
                <div className={styles.imgContainer} onClick={onEditImage}>
                  <img src={actor.img} alt={actor.name} />
                </div>
              </div>

              <div className={styles.colRight}>
                <ResourceBar label="PV" resource={system.pv} updateField={updateField} path="pv" />
                <ResourceBar label="PD" resource={system.pd} updateField={updateField} path="pd" />

                {/* Bloco Dinâmico de Favoritos */}
                {favoriteItems.length > 0 && (
                  <div className={styles.favoritesBlock}>
                    <div className={styles.favTitle}>FAVORITOS</div>
                    <div className={styles.favList}>
                      {favoriteItems.map((item: any) => (
                        <div key={item.id} className={styles.favItem} onClick={() => useItem(item)} title="Usar Habilidade">
                          <span className={styles.favItemName}>{item.name}</span>
                          <div className={styles.favItemRight}>
                            {formatCosts(item.system.costs) && <span className={styles.favCost}>{formatCosts(item.system.costs)}</span>}
                            
                            {/* <-- ADICIONADA A INTERROGAÇÃO AQUI */}
                            {item.system.uses?.max > 0 && (
                              <div className={styles.favUses} onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="number" 
                                  value={item.system.uses.value} 
                                  onChange={(e) => item.update({"system.uses.value": Number(e.target.value)})} 
                                />
                                <span>/</span>
                                <input 
                                  type="number" 
                                  value={item.system.uses.max} 
                                  onChange={(e) => item.update({"system.uses.max": Number(e.target.value)})} 
                                />
                              </div>
                            )}
                            
                            <i 
                              className={`fas fa-edit ${styles.favEdit}`} 
                              onClick={(e) => { e.stopPropagation(); item.sheet.render(true); }} 
                              title="Editar Habilidade"
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <SkillsGrid system={system} updateField={updateField} actor={actor} />
          </div>
        )}

        {activeTab === "habilidades" && (
          <div className={styles.layoutPrincipal}>
            <h2 className={styles.tabTitle}>HABILIDADES E PODERES</h2>
            <AbilitiesList actor={actor} />
          </div>
        )}
        {activeTab === "historico" && (
          <HistoryTab actor={actor} updateField={updateField} />
        )}
      </main>

      {/* MENU LATERAL DIREITO */}
      <SideNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
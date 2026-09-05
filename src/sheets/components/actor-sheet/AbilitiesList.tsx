import React from "react";
import styles from "./AbilitiesList.module.scss";
import { formatCosts, useItem } from "./utils"; 
import { EnrichedHtml } from "./EnrichedHtml";

export const AbilitiesList = ({ actor }: { actor: Actor.Implementation }) => {
  const items = Array.from(actor.items.values()).filter((i: any) => i.type == "habilidade");

  const handleUseToggle = (item: any, index: number) => {
    if (!item.system.uses) return;
    const currentValue = item.system.uses.value;
    const newValue = index + 1 === currentValue ? index : index + 1;
    item.update({ "system.uses.value": newValue });
  };

  const toggleFavorite = (item: any) => {
    item.update({ "system.isFavorite": !item.system.isFavorite });
  };

  const deleteItem = (itemId: string) => {
    actor.deleteEmbeddedDocuments("Item", [itemId]);
  };

  return (
    <div className={styles.abilitiesContainer}>
      {items.length === 0 && <p className={styles.emptyMsg}>Arraste Perfis, Ocupações ou Habilidades para cá.</p>}
      {items.map((item: any) => (
        <div key={item.id} className={styles.abilityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.badgeAndName}>
              <div 
                className={styles.themeBadge} 
                onClick={() => useItem(item)} 
                title="Usar Habilidade (Enviar para o Chat)"
              >
                {item.name.toUpperCase()}
              </div>
              {formatCosts(item.system.costs) && <span className={styles.costText}>{formatCosts(item.system.costs)}</span>}
            </div>
            
            <div className={styles.controls}>
              {/* <-- ADICIONADA A INTERROGAÇÃO AQUI: item.system.uses?.max */}
              {item.system.uses?.max > 0 && (
                <div className={styles.usesTrack}>
                  {Array.from({ length: item.system.uses.max }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`${styles.useBox} ${i < item.system.uses.value ? styles.filled : ""}`}
                      onClick={() => handleUseToggle(item, i)}
                    ></div>
                  ))}
                </div>
              )}
              
              <i 
                className={`fa-star ${item.system.isFavorite ? 'fas ' + styles.favActive : 'far ' + styles.favInactive}`} 
                onClick={() => toggleFavorite(item)} 
                title="Favoritar Habilidade"
              ></i>
              
              <i 
                className={`fas fa-edit ${styles.editIcon}`} 
                onClick={() => item.sheet.render(true)} 
                title="Editar"
              ></i>
              
              <i className={`fas fa-trash ${styles.deleteIcon}`} onClick={() => deleteItem(item.id)} title="Remover"></i>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.descriptionBox}>
              <EnrichedHtml content={item.system.description} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
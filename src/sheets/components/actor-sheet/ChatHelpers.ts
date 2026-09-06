// sheets/components/actor-sheet/ChatHelpers.ts

// Função de Utilitário para puxar a foto baseado na Configuração
export const getChatImage = (actor: any) => {
  const imageMode = game.settings.get("ordemparanormal-v2", "chatImageMode");
  
  if (imageMode === "token" && actor.prototypeToken?.texture?.src) {
    return actor.prototypeToken.texture.src;
  }
  return actor.img || "icons/svg/mystery-man.svg";
};
export const buildRollFlavor = ({ skillName, subtitle, total, ra, rb, isCrit, isCritFail, dt, isSuccess, themeColor, actorImg }: any) => {
  let dtHtml = '';
  if (dt) {
    dtHtml = `
      <div style="text-align: center; font-size: 0.95rem; font-weight: bold; margin-bottom: 10px;">
        ${isSuccess 
           ? `<span style="color: #4caf50;"><i class="fas fa-check-circle"></i> SUCESSO</span>` 
           : `<span style="color: #f44336;"><i class="fas fa-times-circle"></i> FALHA</span>`}
        <span style="color: var(--op2-text-sec); font-weight: normal;"> - DT ${dt}</span>
      </div>
    `;
  }

  return `
    <div class="op2-chat-card" data-theme="${themeColor}" style="font-family: 'Courier New'; padding: 16px 12px 0 12px; background: var(--op2-bg-main); color: var(--op2-text-main);">
      
      <div style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed var(--op2-border); padding-bottom: 12px;">
        <img src="${actorImg}" style="width: 50px; height: 50px; border-radius: 4px; border: 1px solid ${themeColor}; margin-right: 12px; object-fit: cover; background: var(--op2-bg-main);">
        <div style="flex: 1;">
          <h2 style="margin: 0; font-size: 1.6rem; color: ${themeColor}; text-transform: uppercase; font-family: 'Special Elite', monospace; font-weight: 800; line-height: 1.1; border: none; text-shadow: 1px 1px 2px var(--op2-shadow);">${skillName}</h2>
          <div style="font-size: 0.9rem; color: var(--op2-text-sec); font-weight: 600;">${subtitle}</div>
        </div>
      </div>

      <div style="text-align: center; font-size: 4.5rem; font-weight: bold; color: var(--op2-text-main); line-height: 1; margin-bottom: 15px; text-shadow: 2px 2px 4px var(--op2-shadow);">
        ${total}
      </div>

      ${dtHtml}
      
      ${isCrit ? `<div style="text-align: center; color: #ffc107; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; background: rgba(255, 193, 7, 0.1); padding: 4px; border: 1px dashed #ffc107; border-radius: 4px;"><i class="fas fa-star"></i> Sucesso Crítico!</div>` : ''}
      ${isCritFail ? `<div style="text-align: center; color: #f44336; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; background: rgba(244, 67, 54, 0.1); padding: 4px; border: 1px dashed #f44336; border-radius: 4px;"><i class="fas fa-skull"></i> Falha Crítica!</div>` : ''}

      <div style="text-align: center; font-size: 0.95rem; color: var(--op2-text-sec); font-weight: bold; margin-bottom: 16px;">
        RA <span style="color: #4caf50; font-size: 1.1rem; margin-right: 8px;">${ra}</span> &middot; 
        <span style="margin-left: 8px;">RB</span> <span style="color: #f44336; font-size: 1.1rem;">${rb}</span>
      </div>
    </div>
  `;
};

export const buildItemMessage = ({ itemName, category, description, costString, warnings, themeColor, actorImg }: any) => {
  return `
    <div class="op2-chat-card" data-theme="${themeColor}" style="font-family: 'Courier New'; padding: 16px 12px 12px 12px; background: var(--op2-bg-main); color: var(--op2-text-main);">
      
      <div style="display: flex; align-items: center; border-bottom: 1px dashed var(--op2-border); padding-bottom: 12px; margin-bottom: 12px;">
        <img src="${actorImg}" style="width: 50px; height: 50px; border-radius: 4px; border: 1px solid ${themeColor}; margin-right: 12px; object-fit: cover; background: var(--op2-bg-main);">
        <div style="flex: 1;">
          <h2 style="margin: 0; font-size: 1.5rem; color: ${themeColor}; text-transform: uppercase; font-family: 'Special Elite', monospace; font-weight: 800; line-height: 1.1; border: none; text-shadow: 1px 1px 2px var(--op2-shadow);">${itemName}</h2>
          <div style="font-size: 0.9rem; color: var(--op2-text-sec); font-weight: 600;">${category}</div>
        </div>
      </div>

      ${costString ? `<div style="font-size: 0.9rem; margin-bottom: 12px; color: var(--op2-text-sec);">CUSTO: <span style="color: ${themeColor}; font-weight: bold; font-size: 1.1rem;">${costString}</span></div>` : ''}
      
      ${warnings && warnings.length > 0 ? `<div style="color: #ffc107; background: rgba(255, 193, 7, 0.1); padding: 8px; border-radius: 4px; font-size: 0.9rem; margin-bottom: 12px; border: 1px dashed #ffc107; font-weight: bold;"><i class="fas fa-exclamation-triangle"></i> ${warnings.join(" | ")}</div>` : ''}

      <div style="font-size: 1.05rem; line-height: 1.5; color: var(--op2-text-main);">
        ${description}
      </div>
    </div>
  `;
};
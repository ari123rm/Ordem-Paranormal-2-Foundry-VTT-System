export const createUpdateData = (path: string, value: any) => {
  const keys = path.split('.');
  const updateData: any = {};
  let current = updateData;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return { system: updateData };
};

// Adicione isso no utils.ts para formatar visualmente (Ex: "2 PD + 1 PV")
export const formatCosts = (costs: any[]) => {
  if (!costs || costs.length === 0) return "";
  return costs.map(c => `${c.amount} ${c.type}`).join(" + ");
};

// Atualize a parte de consumo dentro do useItem:
export const useItem = async (item: any) => {
  const actor = item.actor;
  if (!actor) return;

  let warnings: string[] = [];
  let newUses = item.system.uses.value;
  
  // 1. Desconta os Usos (ex: Ímpeto)
  if (item.system.uses.max > 0) {
    if (newUses > 0) {
      newUses -= 1;
      await item.update({ "system.uses.value": newUses });
    } else {
      warnings.push("Sem usos restantes!");
    }
  }

  // 2. Desconta PV ou PD do Array Dinâmico
  if (item.system.costs && item.system.costs.length > 0) {
    for (const cost of item.system.costs) {
      const type = cost.type.toLowerCase(); // "pd" ou "pv"
      const currentResource = actor.system[type].value;
      
      if (currentResource >= cost.amount) {
        await actor.update({ [`system.${type}.value`]: currentResource - cost.amount });
      } else {
        warnings.push(`Sem ${cost.type} suficiente!`);
      }
    }
  }

  const costString = formatCosts(item.system.costs);

  // 3. Monta a mensagem no chat
  const content = `
    <div style="background: #111; color: #e0e0e0; padding: 10px; border-left: 4px solid var(--theme-color, #c52222); border-radius: 4px; font-family: 'Courier New', monospace;">
      <h3 style="margin: 0 0 5px 0; color: #fff; border-bottom: 1px dashed #333; padding-bottom: 5px; text-transform: uppercase;">
        ${item.name}
      </h3>
      ${costString ? `<p style="margin: 0 0 8px 0; font-size: 0.9em; color: var(--theme-color, #c52222);"><strong>CUSTO:</strong> ${costString}</p>` : ''}
      ${warnings.length > 0 ? `<p style="color: #ff9800; font-weight: bold; margin: 0 0 8px 0;">⚠️ ${warnings.join(" | ")}</p>` : ''}
      <div style="font-size: 0.9em; line-height: 1.4;">${item.system.description}</div>
    </div>
  `;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    content: content
  });
};
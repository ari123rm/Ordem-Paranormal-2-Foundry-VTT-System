import { buildItemMessage, getChatImage } from "./ChatHelpers";

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

export const formatCosts = (costs: any[]) => {
  if (!costs || costs.length === 0) return "";
  return costs.map(c => `${c.amount} ${c.type}`).join(" + ");
};

export const useItem = async (item: any) => {
  const actor = item.actor;
  if (!actor) return;
  
  let warnings: string[] = [];
  const themeColor = actor.system.themeColor || "#c52222";
  const actorImg = getChatImage(actor);

  // <-- AGORA CHECA SE O ITEM TEM USOS ANTES DE TENTAR SUBTRAIR
  if (item.system.uses && item.system.uses.max > 0) {
    let newUses = item.system.uses.value;
    if (newUses > 0) {
      newUses -= 1;
      await item.update({ "system.uses.value": newUses });
    } else {
      warnings.push("Sem usos restantes!");
    }
  }

  // Custos em PV e PD também verificam se existem
  if (item.system.costs && item.system.costs.length > 0) {
    for (const cost of item.system.costs) {
      const type = cost.type.toLowerCase();
      const currentResource = actor.system[type].value;
      
      if (currentResource >= cost.amount) {
        await actor.update({ [`system.${type}.value`]: currentResource - cost.amount });
      } else {
        warnings.push(`Sem ${cost.type} suficiente!`);
      }
    }
  }

  const content = buildItemMessage({
    itemName: item.name,
    category: item.system.category || item.type.toUpperCase(), // Usa o item.type se não houver category
    description: item.system.description,
    costString: formatCosts(item.system.costs),
    warnings,
    themeColor,
    actorImg
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: content
  });
};

export const syncProfileGrants = async (actor: any, newLevel: number) => {
  // 1. Busca se o Agente tem um Perfil na ficha usando o tipo nativo
  const perfil = actor.items.find((i: any) => i.type === "perfil");
  if (!perfil || !perfil.system.grants || perfil.system.grants.length === 0) return;

  // 2. Filtra as habilidades que ele deveria ter até este nível
  const grantsToHave = perfil.system.grants.filter((g: any) => g.level <= newLevel);
  const itemsToCreate: any[] = [];

  for (const grant of grantsToHave) {
    // 3. Verifica se a ficha já possui o item (usando a Flag de origem ou o Nome)
    const alreadyHas = actor.items.some((i: any) => 
      i.flags?.core?.sourceId === grant.uuid || i.name === grant.name
    );
    
    if (!alreadyHas) {
      // 4. Se não tem, busca do compêndio via UUID
      const sourceItem = await fromUuid(grant.uuid);
      if (sourceItem) {
        const itemData = sourceItem.toObject();
        itemData.flags = { core: { sourceId: grant.uuid } };
        itemsToCreate.push(itemData);
      }
    }
  }

  if (itemsToCreate.length > 0) {
    await actor.createEmbeddedDocuments("Item", itemsToCreate);
    ui.notifications?.info(`Novas Habilidades de Perfil liberadas para o Nível ${newLevel}!`);
  }
};
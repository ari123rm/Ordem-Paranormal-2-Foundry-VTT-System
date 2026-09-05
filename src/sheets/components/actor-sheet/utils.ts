import { buildItemMessage } from "./ChatHelpers"; // <-- Importe o construtor

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
  let newUses = item.system.uses.value;
  const themeColor = actor.system.themeColor || "#c52222";
  const actorImg = getChatImage(actor);

  if (item.system.uses.max > 0) {
    if (newUses > 0) {
      newUses -= 1;
      await item.update({ "system.uses.value": newUses });
    } else { warnings.push("Sem usos restantes!"); }
  }

  if (item.system.costs && item.system.costs.length > 0) {
    for (const cost of item.system.costs) {
      const type = cost.type.toLowerCase();
      const currentResource = actor.system[type].value;
      if (currentResource >= cost.amount) {
        await actor.update({ [`system.${type}.value`]: currentResource - cost.amount });
      } else { warnings.push(`Sem ${cost.type} suficiente!`); }
    }
  }

  const content = buildItemMessage({
    itemName: item.name,
    category: item.system.category || "Habilidade",
    description: item.system.description,
    costString: formatCosts(item.system.costs),
    warnings,
    themeColor,
    actorImg
  });

  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content });
};
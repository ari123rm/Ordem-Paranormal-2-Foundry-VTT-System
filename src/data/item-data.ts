function defineSchema() {
  const fields = foundry.data.fields;

  return {
    description: new fields.HTMLField({ initial: "" }),
    category: new fields.StringField({ initial: "Habilidade" }),
    
    // Custos Dinâmicos (Array de objetos com quantidade e tipo)
    costs: new fields.ArrayField(
      new fields.SchemaField({
        amount: new fields.NumberField({ required: true, integer: true, initial: 1, min: 1 }),
        type: new fields.StringField({ required: true, initial: "PD" }) // "PD" ou "PV"
      })
    ),
    
    isFavorite: new fields.BooleanField({ initial: false }),
    uses: new fields.SchemaField({
      value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
      max: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 })
    })
  };
}

export class ItemData extends foundry.abstract.TypeDataModel<
  ReturnType<typeof defineSchema>,
  Item.Implementation
> {
  static defineSchema = defineSchema;
}
function defineSchema() {
  const fields = foundry.data.fields;
  return {
    description: new fields.HTMLField({ initial: "" }),
    quantity: new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 1,
      min: 0
    })
  };
}

export class ItemData extends foundry.abstract.TypeDataModel<
  ReturnType<typeof defineSchema>,
  Item.Implementation
> {
  static defineSchema = defineSchema;
}

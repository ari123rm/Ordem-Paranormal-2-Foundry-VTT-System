function defineSchema() {
  const fields = foundry.data.fields;
  return {
    biography: new fields.HTMLField({ initial: "" }),
    attributes: new fields.SchemaField({
      strength: new fields.NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 10
      }),
      agility: new fields.NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 10
      }),
      spirit: new fields.NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 10
      })
    })
  };
}

export class CharacterData extends foundry.abstract.TypeDataModel<
  ReturnType<typeof defineSchema>,
  Actor.Implementation
> {
  static defineSchema = defineSchema;
}

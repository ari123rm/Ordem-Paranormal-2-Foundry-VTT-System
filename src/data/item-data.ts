// data/item-data.ts
const fields = foundry.data.fields;

export class HabilidadeData extends foundry.abstract.TypeDataModel<any, Item.Implementation> {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
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
}

export class PerfilData extends foundry.abstract.TypeDataModel<any, Item.Implementation> {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      themeColor: new fields.StringField({ initial: "#999" }), // <-- Adicionado o campo de cor
      grants: new fields.ArrayField(
        new fields.SchemaField({
          level: new fields.NumberField({ required: true, integer: true, initial: 1, min: 1 }),
          uuid: new fields.StringField({ required: true, initial: "" }),
          name: new fields.StringField({ required: true, initial: "" })
        })
      )
    };
  }
}

export class OcupacaoData extends foundry.abstract.TypeDataModel<any, Item.Implementation> {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" })
    };
  }
}
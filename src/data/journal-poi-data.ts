export class PoiPageData extends foundry.abstract.TypeDataModel<any, any> {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      subtitle: new fields.StringField({ initial: "" }),
      
      // Sistema Genérico de Desafios Flexível
      challenges: new fields.ArrayField(
        new fields.SchemaField({
          type: new fields.StringField({ initial: "simple" }), // "simple" ou "table"
          title: new fields.StringField({ initial: "DESAFIO DE ACESSO" }),
          subtitle: new fields.StringField({ initial: "" }),
          badge: new fields.StringField({ initial: "" }), // Ex: "HACK TÉCNICO"
          description: new fields.StringField({ initial: "" }),
          col1Name: new fields.StringField({ initial: "" }),
          col2Name: new fields.StringField({ initial: "" }),
          tasks: new fields.ArrayField(new fields.StringField(), { initial: [] }),
          tableTasks: new fields.ArrayField(
            new fields.SchemaField({
              col1: new fields.StringField({ initial: "" }),
              col2: new fields.StringField({ initial: "" })
            }), { initial: [] }
          )
        }),
        { initial: [] }
      ),

      skillGroups: new fields.ArrayField(
        new fields.SchemaField({
          skills: new fields.ArrayField(new fields.StringField(), { initial: [] }),
          customLabel: new fields.StringField({ initial: "" }),
          checks: new fields.ArrayField(
            new fields.SchemaField({
              dt: new fields.StringField({ initial: "6" }),
              info: new fields.StringField({ initial: "" })
            }), { initial: [{ dt: "6", info: "" }] }
          )
        }),
        { initial: [] }
      ),
      
      description: new fields.HTMLField({ initial: "" })
    };
  }
}
function defineSchema() {
  const fields = foundry.data.fields;

  const scoreField = (initial = 6) => new fields.NumberField({ 
    required: true, nullable: false, integer: true, initial, min: 4, max: 12 
  });
  
  // Agora a perícia guarda o valor do dado e qual é o atributo base escolhido
  const skillField = (defaultBase: string, defaultSub: string = "") => new fields.SchemaField({
    value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 4, min: 4, max: 12 }),
    base: new fields.StringField({ required: true, nullable: false, initial: defaultBase }),
    sub: new fields.StringField({ required: true, nullable: false, initial: defaultSub }) // <-- Novo campo para a variante
  });

  const resourceField = (initial = 10) => new fields.SchemaField({
    value: new fields.NumberField({ required: true, nullable: false, integer: true, initial }),
    max: new fields.NumberField({ required: true, nullable: false, integer: true, initial }),
    temp: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0 }) // Nova barra de vida temporária
  });

  return {
    perfil: new fields.StringField({ initial: "" }),
    ocupacao: new fields.StringField({ initial: "" }),
    nivel: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1 }),
    themeColor: new fields.StringField({ initial: "#c52222" }),
    history: new fields.HTMLField({ initial: "" }),
    
    pv: resourceField(10),
    pd: resourceField(10),

    atributos: new fields.SchemaField({
      fisico: scoreField(6),
      mente: scoreField(6),
      emocao: scoreField(6)
    }),

    pericias: new fields.SchemaField({
      acrobacia: skillField("fisico"), aptidao: skillField("mente", "-"), atletismo: skillField("fisico"),
      crime: skillField("fisico"), disciplina: skillField("emocao"), enganacao: skillField("emocao"),
      furtividade: skillField("fisico"), intimidar: skillField("emocao"), intuicao: skillField("emocao"),
      luta: skillField("fisico"), maquinas: skillField("mente"), medicina: skillField("mente"),
      ocultismo: skillField("mente"), percepcao: skillField("mente"), persuasao: skillField("emocao"),
      pesquisar: skillField("mente"), pontaria: skillField("fisico"), sobrevivencia: skillField("mente"),
      tecnologia: skillField("mente"), vigor: skillField("fisico")
    })
  };
}

export class CharacterData extends foundry.abstract.TypeDataModel<
  ReturnType<typeof defineSchema>,
  Actor.Implementation
> {
  static defineSchema = defineSchema;
}
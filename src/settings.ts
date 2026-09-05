export const registerSystemSettings = () => {
  game.settings.register("fvtt-ts-react-boilerplate", "chatImageMode", {
    name: "Imagem no Chat",
    hint: "Escolha qual imagem do personagem aparecerá nas rolagens e habilidades.",
    scope: "client",
    config: true,
    type: String,
    choices: {
        "token": "Token",
        "avatar": "Avatar (Perfil)",
      
    },
    default: "token"
  });

  // Futuras configurações do sistema podem ser adicionadas aqui
};
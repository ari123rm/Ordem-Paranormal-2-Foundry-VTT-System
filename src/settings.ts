export const registerSystemSettings = () => {
  const systemId = "ordemparanormal-v2";

  game.settings.register(systemId, "chatImageMode", {
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

  // Voltando com o nosso controle de tema seguro
  game.settings.register(systemId, "themeMode", {
    name: "Tema do Sistema",
    hint: "Escolha o esquema de cores para as Fichas, Modais e Chat.",
    scope: "client",
    config: true,
    type: String,
    choices: {
        "dark": "Modo Escuro",
        "light": "Modo Claro",       
    },
    default: "dark",
    onChange: () => window.location.reload()
  });
};
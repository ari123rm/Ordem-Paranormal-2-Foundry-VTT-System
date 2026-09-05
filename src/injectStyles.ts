// src/injectStyles.ts

// O sufixo ?inline faz o Vite importar o SCSS compilado como uma string literal
import chatStyles from "./styles/chat.scss?inline";

export const injectStyles = () => {
  const styleElement = document.createElement("style");
  styleElement.id = "op2-global-styles";
  
  styleElement.innerHTML = `
    ${chatStyles}
    /* Futuramente, você pode importar outros .scss?inline e concatenar aqui! */
  `;
  
  document.head.appendChild(styleElement);
};
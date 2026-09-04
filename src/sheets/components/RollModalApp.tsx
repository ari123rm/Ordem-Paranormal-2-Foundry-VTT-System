import React, { useState } from "react";

export const RollModalApp = ({ actor, skillName, initialAttrValue, initialSkillValue, onConfirm, onCancel }: any) => {
  const [dt, setDt] = useState("");
  const [bonusDice, setBonusDice] = useState<string[]>([]);
  // Você pode adicionar states para permitir a troca do atributo base aqui

  const addBonus = (die: string) => {
    if (bonusDice.length < 2) setBonusDice([...bonusDice, die]);
  };

  const handleRoll = () => {
    // Passa os dados estruturados de volta para a função principal
    onConfirm({
      dt: dt ? Number(dt) : null,
      bonusDice,
      // outros modificadores
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-white bg-[#1a1a1a]">
      <div className="flex justify-between items-center border-b border-gray-600 pb-2">
        <h2 className="text-xl font-bold">{skillName}</h2>
        <div className="flex items-center gap-2">
          <span>DT</span>
          <input 
            type="number" 
            className="w-16 bg-transparent border border-gray-500 rounded p-1 text-center" 
            value={dt} 
            onChange={(e) => setDt(e.target.value)} 
          />
        </div>
      </div>

      {/* Exemplo de Bônus Situacional */}
      <div>
        <span className="text-sm text-gray-400">BÔNUS SITUACIONAL (Dados {bonusDice.length} / 2)</span>
        <div className="flex gap-2 mt-2">
          {['d4', 'd6', 'd8', 'd10', 'd12'].map(die => (
            <button 
              key={die} 
              className="border border-gray-600 rounded px-3 py-1 hover:bg-gray-700"
              onClick={() => addBonus(die)}
            >
              {die}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button className="px-4 py-2 border border-gray-600 rounded" onClick={onCancel}>Cancelar</button>
        <button className="px-4 py-2 bg-red-800 rounded font-bold" onClick={handleRoll}>Rolar</button>
      </div>
    </div>
  );
};
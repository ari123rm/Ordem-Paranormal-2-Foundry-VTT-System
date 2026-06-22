import React from "react";
import styles from "./ItemSheetApp.module.scss";
import { localize } from "../../i18n";

export function ItemSheetApp({ item }: { item: Item.Implementation }) {
  const system = item.system;

  const updateQuantity = (value: number) => {
    item.update({ system: { quantity: value } });
  };

  const updateDescription = (value: string) => {
    item.update({ system: { description: value } });
  };

  return (
    <div className={styles.sheet}>
      <h1>{item.name}</h1>
      <label className={styles.label}>
        {localize("BOILERPLATE.Item.Quantity")}
        <input
          type="number"
          min={0}
          value={system.quantity}
          onChange={(e) => updateQuantity(Number(e.target.value))}
        />
      </label>
      <label className={styles.label}>
        {localize("BOILERPLATE.Item.Description")}
        <textarea
          defaultValue={system.description}
          onBlur={(e) => updateDescription(e.target.value)}
        />
      </label>
    </div>
  );
}

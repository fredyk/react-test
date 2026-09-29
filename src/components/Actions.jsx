import { useState } from 'react';

function optionsOf(product, key) {
  return product?.options?.[key] ?? [];
}

// With a single option there is nothing to choose, so it starts selected.
function onlyCode(options) {
  return options.length === 1 ? options[0].code : null;
}

export function Actions({ product }) {
  const colors = optionsOf(product, 'colors');
  const storages = optionsOf(product, 'storages');
  const [colorCode, setColorCode] = useState(() => onlyCode(colors));
  const [storageCode, setStorageCode] = useState(() => onlyCode(storages));

  return (
    <div className="actions">
      <fieldset className="actions__group" role="radiogroup">
        <legend className="actions__legend">Storage</legend>
        {storages.map((storage) => (
          <label className="actions__option" key={storage.code}>
            <input
              type="radio"
              name="storage"
              value={storage.code}
              checked={storageCode === storage.code}
              onChange={() => setStorageCode(storage.code)}
            />
            {storage.name}
          </label>
        ))}
      </fieldset>
      <fieldset className="actions__group" role="radiogroup">
        <legend className="actions__legend">Color</legend>
        {colors.map((color) => (
          <label className="actions__option" key={color.code}>
            <input
              type="radio"
              name="color"
              value={color.code}
              checked={colorCode === color.code}
              onChange={() => setColorCode(color.code)}
            />
            {color.name}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

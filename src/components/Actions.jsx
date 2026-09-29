import { useState } from 'react';
import { useCart } from '../context/CartContext.js';

function optionsOf(product, key) {
  return product?.options?.[key] ?? [];
}

// With a single option there is nothing to choose, so it starts selected.
function onlyCode(options) {
  return options.length === 1 ? options[0].code : null;
}

export function Actions({ product }) {
  const { addToCart } = useCart();
  const colors = optionsOf(product, 'colors');
  const storages = optionsOf(product, 'storages');
  const [colorCode, setColorCode] = useState(() => onlyCode(colors));
  const [storageCode, setStorageCode] = useState(() => onlyCode(storages));
  const [status, setStatus] = useState('idle');

  const ready = colorCode !== null && storageCode !== null;

  function handleAdd() {
    setStatus('adding');
    addToCart({ id: product.id, colorCode, storageCode }).then(
      () => setStatus('success'),
      () => setStatus('error'),
    );
  }

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
      <button
        className="actions__add"
        type="button"
        onClick={handleAdd}
        // Disabled while a request is in flight, so a double click does not add twice.
        disabled={!ready || status === 'adding'}
      >
        Add
      </button>
      <p className="actions__feedback" role="status" aria-live="polite">
        {status === 'success' ? 'Added to cart' : ''}
      </p>
      <p className="actions__feedback" role="alert" aria-live="assertive">
        {status === 'error' ? 'Could not add to cart' : ''}
      </p>
    </div>
  );
}

export function SearchBar({ value, onChange }) {
  return (
    <label className="search">
      <span className="search__label">Search</span>
      <input
        className="search__input"
        type="search"
        value={value}
        placeholder="Search by brand or model"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function Description({ specs }) {
  return (
    <dl className="description">
      {specs.map(({ label, value }) => (
        <div className="description__row" key={label}>
          <dt className="description__label">{label}</dt>
          <dd className="description__value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

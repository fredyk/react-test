export function Retry({ onRetry }) {
  return (
    <button className="retry" type="button" onClick={onRetry}>
      Retry
    </button>
  );
}

export function Button({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

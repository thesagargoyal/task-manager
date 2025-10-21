const DragHandle = () => {
  return (
    <div className="mt-1 shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Drag to reorder"
      >
        <circle cx="7" cy="5" r="1.5" />
        <circle cx="13" cy="5" r="1.5" />
        <circle cx="7" cy="10" r="1.5" />
        <circle cx="13" cy="10" r="1.5" />
        <circle cx="7" cy="15" r="1.5" />
        <circle cx="13" cy="15" r="1.5" />
      </svg>
    </div>
  );
};

export default DragHandle;

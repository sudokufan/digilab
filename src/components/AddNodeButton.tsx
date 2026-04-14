type AddNodeButtonProps = {
  onAdd: () => void;
};

export const AddNodeButton = ({ onAdd }: AddNodeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 active:scale-[0.98]"
    >
      Add Node
    </button>
  );
};

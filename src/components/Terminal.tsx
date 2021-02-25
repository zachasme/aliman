/**
 * Represents user input inside a terminal
 */
const Terminal: React.FC<{ chroot: boolean }> = ({
  children,
  chroot,
  ...props
}) => {
  const bg = chroot ? "bg-indigo-50" : "bg-blue-50";
  const text = chroot ? "text-indigo-700" : "text-blue-700";

  return (
    <kbd
      className={`
        prompt
        flex-grow block text-sm
        ${bg} ${text}
        dark:bg-gray-900 dark:text-blue-200
        px-2 py-1 rounded
      `}
      {...props}
    >
      {children}
    </kbd>
  );
};

export default Terminal;

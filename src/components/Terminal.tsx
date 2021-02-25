/**
 * Represents user input inside a terminal
 */
const Terminal: React.FC<{ chroot: boolean }> = ({
  children,
  chroot,
  ...props
}) => {
  const color = chroot ? "indigo" : "blue";

  return (
    <kbd
      className={`
        prompt
        flex-grow block text-sm
        bg-${color}-50 text-${color}-700
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

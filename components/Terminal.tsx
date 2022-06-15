/**
 * Represents user input inside a terminal
 */
const Terminal: React.FC<{ chroot?: boolean; children: React.ReactNode }> = ({
  children,
  chroot,
  ...props
}) => {
  const bg = chroot ? "bg-indigo-50" : "bg-blue-50";
  const text = chroot ? "text-indigo-700" : "text-blue-700";

  return <kbd {...props}>{children}</kbd>;
};

export default Terminal;

const style = `
  prompt
  flex-grow block text-sm
  bg-blue-50 text-blue-700 px-2 py-1 rounded
`;

/**
 * Represents user input inside a terminal
 */
const Terminal: React.FC = ({ children, ...props }) => {
  return (
    <kbd className={style} {...props}>
      {children}
    </kbd>
  );
};

export default Terminal;
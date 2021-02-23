import { useState } from "react";
import Instructions from "../components/Instructions";

const Select: React.FC<any> = ({ options, value, ...props }) => {
  return (
    <select
      {...props}
      id="country"
      name="country"
      autoComplete="country"
      className={`
    mt-1 block w-full py-2 px-3
    border
    bg-white border-gray-300
    dark:bg-gray-800 dark:border-gray-700
    rounded-md shadow-sm
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
    sm:text-sm`}
    >
      {Object.entries(options).map(([id, text]) => {
        return (
          <option key={id} value={id} selected={value === id}>
            {text}
          </option>
        );
      })}
    </select>
  );
};

enum Processor {
  AMD = "amd",
  Intel = "intel",
}

const Guide: React.FC = () => {
  const [isNotesEnabled, setIsNotesEnabled] = useState(true);
  const [processor, setProcessor] = useState(Processor.AMD);
  const [editor, setEditor] = useState("vim");

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="print:hidden container mx-auto px-16">
        <label>
          <input
            type="checkbox"
            checked={isNotesEnabled}
            onChange={(event) => setIsNotesEnabled(event.target.checked)}
          />{" "}
          notes
        </label>

        <label>Editor</label>
        <Select
          value={editor}
          onChange={(e) => setEditor(e.target.value)}
          options={{
            ["vim"]: "vim",
            ["nano"]: "nano",
          }}
        />

        <label>CPU Vendor</label>
        <Select
          value={processor}
          onChange={(e) => setProcessor(e.target.value)}
          options={{
            [Processor.AMD]: "AMD cpu",
            [Processor.Intel]: "Intel cpu",
          }}
        />
      </div>
      <div className="container mx-auto px-16 print:px-0">
        <Instructions
          editor={editor}
          processor={processor}
          isNotesEnabled={isNotesEnabled}
        />
      </div>
    </main>
  );
};

export default Guide;

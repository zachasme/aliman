import makeSections, { defaultOptions, Step, Options } from "../steps";

import Terminal from "./Terminal";

const AnyStep: React.FC<{ step: Step; options: Options }> = (props) => {
  const { step, options } = props;

  switch (step.type) {
    case "command":
      return (
        <>
          <Terminal>{step.command}</Terminal>
        </>
      );
    case "write":
      return (
        <>
          <Terminal>
            {options.editor} {step.path}
          </Terminal>
          <pre className="w-full block whitespace-pre text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
            <code>{step.lines.join("\n")}</code>
          </pre>
        </>
      );
    case "text":
      return <></>;
  }
};

interface Props {
  isNotesEnabled: boolean;
  editor: any;
  processor: any;
}

const Instructions: React.FC<Props> = ({
  isNotesEnabled,
  editor,
  processor,
}) => {
  const options = { ...defaultOptions, editor, processor };
  const sections = makeSections(options);

  return (
    <article>
      {sections.map((section, i) => (
        <section key={i} className="overflow-auto">
          <h2 className="pl-4 mt-4 text-xl font-semibold">{section.title}</h2>
          <ol className="bg-white py-4 space-y-4">
            {section.steps.map((step, i) => (
              <li
                key={i}
                className="flex flex-wrap text-gray-800 dark:text-gray-300 px-4 rounded"
              >
                {step.title && (
                  <h3 className="font-medium pr-4 w-48">{step.title}</h3>
                )}
                <AnyStep options={options} step={step} />
                {step.note && isNotesEnabled && (
                  <p className="w-full text-sm text-gray-600 mt-1">
                    {step.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
};

export default Instructions;

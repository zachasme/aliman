import makeSections, { defaultOptions, Step, Options } from "../steps";

import Terminal from "./Terminal";

const AnyStep: React.FC<{ step: Step; options: Options }> = (props) => {
  const { step, options } = props;

  switch (step.type) {
    case "command":
      return (
        <>
          <Terminal chroot={step.chroot}>{step.command}</Terminal>
        </>
      );
    case "write":
      const bg = step.chroot ? "bg-indigo-50" : "bg-blue-50";
      const text = step.chroot ? "text-indigo-700" : "text-blue-700";

      return (
        <>
          <Terminal chroot={step.chroot}>
            {options.editor} {step.path}
          </Terminal>
          <pre
            className={`
              overflow-x-scroll w-full
              block whitespace-pre text-sm
              ${bg} ${text}
              dark:bg-gray-900 dark:text-blue-200
              px-2 py-1 rounded
            `}
          >
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
  fileSystem: any;
  graphics: any;
  hostname: any;
  locale: any;
  kernel: any;
  keymap: any;
  partitionDevice: any;
  partitionBoot: any;
  partitionRoot: any;
  processor: any;
  timeZone: any;
}

const Instructions: React.FC<Props> = ({ isNotesEnabled, ...props }) => {
  const options = { ...defaultOptions, ...props };
  const sections = makeSections(options);

  return (
    <article className="print:text-sm">
      {sections.map((section, i) => (
        <section key={i} className="overflow-auto">
          <h2 className="pl-4 mt-4 text-xl print:text-sm font-semibold">
            {section.title}
          </h2>
          <ol className="bg-white dark:bg-gray-800 py-4 space-y-4">
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

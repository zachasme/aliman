import makeSections, { defaultOptions, Step, Options } from "../steps";

const Terminal: React.FC = (props) => {
  return (
    <kbd
      className={
        "flex-grow block text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded"
      }
      {...props}
    />
  );
};

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
          <pre className="w-full overflow-x-scroll block whitespace-pre text-sm bg-gray-900 px-2 py-1 rounded">
            <code>{step.lines.join("\n")}</code>
          </pre>
        </>
      );
    case "text":
      return <></>;
  }
};

const Instructions: React.FC = () => {
  const options = defaultOptions;

  const sections = makeSections(options);

  return (
    <article>
      <h1 className="text-xl font-semibold">Installation cheatsheet</h1>
      {sections.map((section, i) => (
        <section key={i} className="overflow-auto">
          <h2 className="text-center mt-4 text-lg font-semibold">
            {section.title}
          </h2>
          <ol>
            {section.steps.map((step, i) => (
              <li
                key={i}
                className="flex flex-row-reverse flex-wrap bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 mt-4 px-4 py-2 rounded"
              >
                {step.title && <h3 className="font-bold pl-4">{step.title}</h3>}
                <AnyStep options={options} step={step} />
                {step.note && (
                  <p className="w-full text-sm text-gray-400 mt-1">
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

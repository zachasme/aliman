import makeSections, { defaultOptions, Step, Options } from "../steps";

const AnyStep: React.FC<{ step: Step; options: Options }> = (props) => {
  const { step, options } = props;

  switch (step.type) {
    case "command":
      return (
        <>
          {step.title && <h3>{step.title}</h3>}
          <code>{step.command}</code>
          {step.note && <p>{step.note}</p>}
        </>
      );
    case "write":
      return (
        <>
          {step.title && <h3>{step.title}</h3>}
          <code>
            {options.editor} {step.path}
            <pre>
              <code>{step.lines.join("\n")}</code>
            </pre>
          </code>
          {step.note && <p>{step.note}</p>}
        </>
      );
  }
};

const Instructions: React.FC = () => {
  const options = defaultOptions;

  const sections = makeSections(options);

  return (
    <article>
      <h1>Installation cheatsheet</h1>
      {sections.map((section, i) => (
        <section key={i}>
          <h2>{section.title}</h2>
          <ol>
            {section.steps.map((step, i) => (
              <li key={i}>
                <AnyStep options={options} step={step} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
};

export default Instructions;

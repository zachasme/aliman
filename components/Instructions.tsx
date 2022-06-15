import makeSections, { defaultOptions, Step, Options } from "../lib/steps";

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
      return (
        <>
          <Terminal chroot={step.chroot}>
            {options.editor} {step.path}
          </Terminal>
          <pre style={{ width: "100%" }}>
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
    <article>
      {sections.map((section, i) => (
        <section key={i}>
          <h2>{section.title}</h2>
          <ol>
            {section.steps.map((step, i) => (
              <li key={i} className="Input">
                {step.title && <h5>{step.title}</h5>}
                <AnyStep options={options} step={step} />
                {step.note && isNotesEnabled && <p>{step.note}</p>}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
};

export default Instructions;

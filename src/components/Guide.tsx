import Instructions from "../components/Instructions";

const Guide: React.FC = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <fieldset>
        <legend>text editor</legend>
        <label>
          <input type="radio" name="editor" /> vim
        </label>
        <label>
          <input type="radio" name="editor" /> nano
        </label>
      </fieldset>

      <Instructions />
    </main>
  );
};

export default Guide;

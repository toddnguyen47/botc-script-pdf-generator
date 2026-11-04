import { ScriptOptions } from "botc-character-sheet";

interface NightSheetOptionsProps {
  options: ScriptOptions;
  onOptionChange: <K extends keyof ScriptOptions>(
    key: K,
    value: ScriptOptions[K],
  ) => void;
}

export function NightSheetOptions({
  options,
  onOptionChange,
}: NightSheetOptionsProps) {
  return (
    <div>
      <div className="form-control">
        <label className="form-control-label">
          <span className="form-control-text">Font Size (in points)</span>
          <input
            type="number"
            min="8"
            max="14"
            step="0.1"
            value={options.nightSheetFontSizePoint}
            placeholder="Font Size (in points)"
            onChange={(val) =>
              onOptionChange(
                "nightSheetFontSizePoint",
                Number(val.currentTarget.value),
              )
            }
            className="text-input"
          />
        </label>
      </div>
    </div>
  );
}

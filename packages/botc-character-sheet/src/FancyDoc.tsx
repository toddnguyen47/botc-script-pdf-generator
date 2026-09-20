import { CharacterSheet } from "./pages/CharacterSheet";
import { NightSheet } from "./pages/NightSheet";
import { SheetBack } from "./pages/SheetBack";
import { NightOrders, ParsedScript, ScriptOptions } from "./types";
import { getFabledOrLoric } from "./utils/fabledOrLoric";
import {
  groupCharactersByTeam,
  findJinxes,
  resolveJinxCharacters,
} from "./utils/scriptUtils";
import "./FancyDoc.css";
import { InfoSheet } from "./pages/InfoSheet";
import { useMemo } from "preact/hooks";
import { useJinxes } from "./data/jinxes";
import { QueryProvider } from "./utils/queryProvider";

export type FancyDocProps = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
};

export function FancyDoc(props: FancyDocProps) {
  return (
    <QueryProvider>
      <FancyDocContent {...props} />
    </QueryProvider>
  );
}

function FancyDocContent({
  script,
  options: rawOptions,
  nightOrders,
}: FancyDocProps) {
  // If a custom font URL is provided, inject a @font-face and override titleStyle.font
  const hasCustomFont = !!rawOptions.titleStyle.customFontUrl;
  const options = hasCustomFont
    ? {
        ...rawOptions,
        titleStyle: { ...rawOptions.titleStyle, font: "CustomTitleFont" },
      }
    : rawOptions;

  const { data: allJinxes, isLoading } = useJinxes();

  const jinxes = useMemo(() => {
    if (!allJinxes) return [];

    return findJinxes(script.characters, allJinxes, options.useOldJinxes);
  }, [script.characters, allJinxes, options.useOldJinxes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const groupedCharacters = groupCharactersByTeam(script.characters);
  const resolvedJinxes = resolveJinxCharacters(jinxes, script.characters);
  const fabledAndLoric = getFabledOrLoric(
    script.characters,
    options.iconUrlTemplate,
  );

  return (
    <div className="sheet-wrapper">
      {hasCustomFont && (
        <style>{`@font-face { font-family: "CustomTitleFont"; src: url("${rawOptions.titleStyle.customFontUrl}"); }`}</style>
      )}
      {Array(options.numberOfCharacterSheets)
        .fill(true)
        .map((_, i) => (
          <div className={i === 0 ? "" : "print-only"}>
            <CharacterSheet
              title={script.metadata?.name || "Custom Script"}
              author={options.showAuthor ? script.metadata?.author : undefined}
              characters={groupedCharacters}
              jinxes={jinxes}
              fabledOrLoric={fabledAndLoric}
              bootleggerRules={script.metadata?.bootlegger}
              options={options}
            />
            <div style="break-after:page;"></div>

            {options.overleaf === "backingSheet" && (
              <>
                <SheetBack
                  title={script.metadata?.name || "Custom Script"}
                  nightOrders={nightOrders}
                  options={options}
                />
                <div style="break-after:page;"></div>
              </>
            )}

            {options.overleaf === "infoSheet" && (
              <>
                <InfoSheet
                  title={script.metadata?.name || "Custom Script"}
                  firstNightOrder={nightOrders.first}
                  otherNightOrder={nightOrders.other}
                  bootleggerRules={script.metadata?.bootlegger}
                  jinxes={resolvedJinxes}
                  fabledOrLoric={fabledAndLoric}
                  travellers={groupedCharacters.traveller}
                  options={options}
                />
                <div style="break-after:page;"></div>
              </>
            )}
          </div>
        ))}

      {options.showNightSheet && (
        <>
          <NightSheet
            title={script.metadata?.name || "Custom Script"}
            firstNightOrder={nightOrders.first}
            otherNightOrder={nightOrders.other}
            options={options}
          />
        </>
      )}
    </div>
  );
}

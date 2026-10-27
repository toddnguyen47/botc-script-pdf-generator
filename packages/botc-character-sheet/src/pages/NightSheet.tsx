import {
  CharacterNameReplacement,
  COLOR_DARK_GRAY,
  NightMarker,
  NightOrderEntry,
  ScriptOptions,
} from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightSheet.css";
import { teamColours } from "../utils/colours";
import { BottomTrimSheet } from "../components/BottomTrimSheet";

export type NightSheetProps = {
  title: string;
  firstNightOrder?: NightOrderEntry[];
  otherNightOrder?: NightOrderEntry[];
  options: ScriptOptions;
  characterNameReplacement: CharacterNameReplacement;
};

export const NightSheet = ({
  title,
  firstNightOrder,
  otherNightOrder,
  options,
  characterNameReplacement,
}: NightSheetProps) => {
  return (
    <>
      {firstNightOrder && (
        <BottomTrimSheet options={options}>
          <div className="night-sheet-heading">
            <h3 className="night-title">First Night</h3>
            <h3 className="script-title">{title}</h3>
          </div>
          <div className="night-sheet-order">
            {firstNightOrder.map((reminder) => (
              <NightSheetEntry
                entry={reminder}
                night="first"
                iconUrlTemplate={options.iconUrlTemplate}
                useDarkGrayForAbilityText={options.useDarkGrayForAbilityText}
                nightSheetReminderTextAlign={
                  options.nightSheetReminderTextAlign
                }
                characterNameReplacement={characterNameReplacement}
              />
            ))}
          </div>
        </BottomTrimSheet>
      )}
      {otherNightOrder && (
        <BottomTrimSheet options={options}>
          <div className="night-sheet-heading">
            <h3 className="night-title">Other Nights</h3>
            <h3 className="script-title">{title}</h3>
          </div>
          <div className="night-sheet-order">
            {otherNightOrder.map((reminder) => (
              <NightSheetEntry
                entry={reminder}
                night="other"
                iconUrlTemplate={options.iconUrlTemplate}
                useDarkGrayForAbilityText={options.useDarkGrayForAbilityText}
                nightSheetReminderTextAlign={
                  options.nightSheetReminderTextAlign
                }
                characterNameReplacement={characterNameReplacement}
              />
            ))}
          </div>
        </BottomTrimSheet>
      )}
    </>
  );
};

type NightSheetEntryProps = {
  entry: NightOrderEntry;
  night: "first" | "other";
  iconUrlTemplate?: string;
  useDarkGrayForAbilityText: boolean;
  nightSheetReminderTextAlign: string;
  characterNameReplacement: CharacterNameReplacement;
};

const ReminderIcon = () => (
  <img className="reminder-icon" src="/images/reminder.png"></img>
);

export const NightSheetEntry = (props: NightSheetEntryProps) => {
  const src = getImageSrc(props.entry, props.iconUrlTemplate);
  const { reminderText, name } = getReminderText(
    props.entry,
    props.night,
    props.characterNameReplacement,
  );
  if (!reminderText) {
    console.warn("No reminder text found for:", props.entry);
    return <></>;
  }

  const replaceReminders = (str: string) =>
    str
      .split(/(:reminder:)/)
      .map((part, i) =>
        part === ":reminder:" ? <ReminderIcon key={i} /> : part,
      );

  const renderText = (text: string) => {
    const withBold = text
      .split("*")
      .map((t, i) => (i % 2 === 0 ? t : <strong>{t}</strong>))
      .map((t) => (typeof t === "string" ? replaceReminders(t) : t));
    return <>{withBold}</>;
  };

  const isMarker = typeof props.entry === "string";

  const color =
    typeof props.entry === "string"
      ? COLOR_DARK_GRAY
      : teamColours[props.entry.team];
  const reminderTextColor = props.useDarkGrayForAbilityText
    ? COLOR_DARK_GRAY
    : color;

  return (
    <div className="night-sheet-entry">
      <img src={src} className={isMarker ? "marker-icon" : undefined}></img>
      <div
        className="reminder-name"
        style={{
          color: color,
          textAlign: `${props.nightSheetReminderTextAlign}`,
        }}
      >
        {name}
      </div>
      <div
        className="reminder-text"
        style={{
          color: reminderTextColor,
          borderLeft: `2px solid ${color}`,
        }}
      >
        {renderText(reminderText)}
      </div>
    </div>
  );
};

const getReminderText = (
  entry: NightOrderEntry,
  night: "first" | "other",
  characterNameReplacement: CharacterNameReplacement,
) => {
  if (typeof entry === "object") {
    const reminderText =
      night === "first" ? entry.firstNightReminder : entry.otherNightReminder;
    const rawName = entry.name;
    const name =
      rawName in characterNameReplacement
        ? `${rawName} (${characterNameReplacement[rawName]} token)`
        : rawName;
    return { reminderText, name };
  } else {
    const reminder = NON_CHARACTER_REMINDERS[entry];
    const reminderText =
      night === "first" ? reminder.first : (reminder.other ?? "");
    const rawName = reminder.name;
    const name =
      rawName in characterNameReplacement
        ? `${rawName} (${characterNameReplacement[rawName]} token)`
        : rawName;
    return { reminderText, name };
  }
};

const NON_CHARACTER_REMINDERS: Record<
  NightMarker,
  { first: string; name: string; other?: string }
> = {
  dusk: {
    first: "Start the Night Phase.",
    name: "Dusk",
    other: "Start the Night Phase.",
  },
  dawn: {
    first: "Wait for a few seconds. End the Night Phase.",
    name: "Dawn",
    other: "Wait for a few seconds. End the Night Phase.",
  },
  demoninfo: {
    first:
      "If there are 7 or more players, wake the Demon: Show the *THESE ARE YOUR MINIONS* token. Point to all Minions. Show the *THESE CHARACTERS ARE NOT IN PLAY* token. Show 3 not-in-play good character tokens.",
    name: "Demon Info",
  },
  minioninfo: {
    first:
      "If there are 7 or more players, wake all Minions: Show the *THIS IS THE DEMON* token. Point to the Demon. Show the *THESE ARE YOUR MINIONS* token. Point to the other Minions.",
    name: "Minion Info",
  },
};

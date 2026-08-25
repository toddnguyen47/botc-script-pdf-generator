import { NightMarker, NightOrderEntry, ScriptOptions } from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightSheet.css";
import { teamColours } from "../utils/colours";
import { BottomTrimSheet } from "../components/BottomTrimSheet";

const BALANCE_POINT = 10;

enum NightType {
  First,
  Other,
}

export type NightSheetProps = {
  title: string;
  firstNightOrder?: NightOrderEntry[];
  otherNightOrder?: NightOrderEntry[];
  options: ScriptOptions;
};

export const NightSheet = ({
  title,
  firstNightOrder,
  otherNightOrder,
  options,
}: NightSheetProps) => {
  type NightOrder = NonNullable<NightSheetProps["firstNightOrder"]>;

  const getJustifyContent = (order: NightOrder) => {
    if (order.length > BALANCE_POINT) {
      return "space-between";
    }

    return order.length % 2 === 0 ? "space-around" : "flex-start";
  };

  const renderNightSheet = ({
    order,
    night,
    heading,
  }: {
    order: NightOrder | null | undefined;
    night: NightType;
    heading: string;
  }) => {
    if (!order?.length) return null;

    const midpoint = calculateMidpoint(order, night);
    const justifyContent = getJustifyContent(order);

    const renderColumn = (items: NightOrder, columnIndex: number) => (
      <div
        key={columnIndex}
        className="night-sheet-order"
        style={{ justifyContent }}
      >
        {items.map((reminder, index) => (
          <NightSheetEntry
            key={`${night}-${columnIndex}-${index}`}
            entry={reminder}
            night={night}
            iconUrlTemplate={options.iconUrlTemplate}
          />
        ))}
      </div>
    );

    return (
      <BottomTrimSheet options={options}>
        <div className="night-sheet-heading">
          <h3 className="night-title">{heading}</h3>
          <h3 className="script-title">{title}</h3>
        </div>

        <div className="night-sheet-list">
          {renderColumn(order.slice(0, midpoint), 0)}
          {renderColumn(order.slice(midpoint), 1)}
        </div>
      </BottomTrimSheet>
    );
  };

  return (
    <>
      {renderNightSheet({
        order: firstNightOrder,
        night: NightType.First,
        heading: "First Night",
      })}

      {renderNightSheet({
        order: otherNightOrder,
        night: NightType.Other,
        heading: "Other Nights",
      })}
    </>
  );
};

type NightSheetEntryProps = {
  entry: NightOrderEntry;
  night: NightType;
  iconUrlTemplate?: string;
};

const ReminderIcon = () => (
  <img className="reminder-icon" src="/images/reminder.png"></img>
);

export const NightSheetEntry = (props: NightSheetEntryProps) => {
  const src = getImageSrc(props.entry, props.iconUrlTemplate);
  const { reminderText, name } = getReminderText(props.entry, props.night);
  const colour =
    typeof props.entry === "string" ? "#222" : teamColours[props.entry.team];
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

  return (
    <div className="night-sheet-entry">
      <img src={src} className={isMarker ? "marker-icon" : undefined}></img>
      <div className="night-sheet-entry-text">
        <p className="reminder-name" style={{ color: colour }}>
          {name}
        </p>
        <p className="reminder-text">{renderText(reminderText)}</p>
      </div>
    </div>
  );
};

const getReminderText = (entry: NightOrderEntry, night: NightType) => {
  if (typeof entry === "object") {
    const reminderText =
      night === NightType.First
        ? entry.firstNightReminder
        : entry.otherNightReminder;
    const name = entry.name;
    return { reminderText, name };
  } else {
    const reminder = NON_CHARACTER_REMINDERS[entry];
    const reminderText =
      night === NightType.First ? reminder.first : (reminder.other ?? "");
    const name = reminder.name;
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

function calculateMidpoint(
  characters: NightOrderEntry[],
  night: NightType,
): number {
  const midpoint = Math.ceil(characters.length / 2);

  if (characters.length % 2 === 0 || characters.length <= BALANCE_POINT) {
    return midpoint;
  }
  const leftWeightedMidpoint = midpoint;
  const rightWeightedMidpoint = midpoint - 1;

  const largerFirstHalf = characters.slice(0, leftWeightedMidpoint);
  const largerSecondHalf = characters.slice(rightWeightedMidpoint - 1);

  const totalAbilityLengthFirstHalf = largerFirstHalf.reduce(
    (sum, char) =>
      sum + (getReminderText(char, night).reminderText?.length ?? 0),
    0,
  );
  const totalAbilityLengthSecondHalf = largerSecondHalf.reduce(
    (sum, char) =>
      sum + (getReminderText(char, night).reminderText?.length ?? 0),
    0,
  );

  // Return the midpoint that results in more balanced ability lengths
  return totalAbilityLengthFirstHalf < totalAbilityLengthSecondHalf
    ? leftWeightedMidpoint
    : rightWeightedMidpoint;
}

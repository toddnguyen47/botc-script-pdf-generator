import { ResolvedCharacter, Jinx } from "../types";
import {
  getJinxedCharacters,
  getImageUrl,
  getGenericIconUrl,
  calculateMidpoint,
} from "../utils/scriptUtils";

interface CharacterSectionProps {
  title: string;
  characters: ResolvedCharacter[];
  charNameColor: string;
  jinxes: Jinx[];
  allCharacters: ResolvedCharacter[];
  inlineJinxIcons: "none" | "primary" | "both";
  iconUrlTemplate?: string;
}
// Threshold to switch from evenly spaced to space-between layout
const BALANCE_POINT = 8;
export function CharacterSection({
  title,
  characters,
  charNameColor,
  jinxes,
  allCharacters: allChars,
  inlineJinxIcons,
  iconUrlTemplate,
}: CharacterSectionProps) {
  const justifyContent =
    characters.length > BALANCE_POINT
      ? "space-between"
      : characters.length % 2 === 0
        ? "space-around"
        : "flex-start";

  const midpoint = _calculateMidpoint(characters);

  return (
    <div className="character-section">
      <h2 className="section-title" style={{ color: charNameColor }}>
        {title}
      </h2>
      <div className="character-list">
        <div className="character-column" style={{ justifyContent }}>
          {characters.slice(0, midpoint).map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              color={charNameColor}
              iconUrlTemplate={iconUrlTemplate}
              jinxedCharacters={getJinxedCharacters(
                char,
                jinxes,
                allChars,
                inlineJinxIcons,
              )}
            />
          ))}
        </div>
        <div className="character-column" style={{ justifyContent }}>
          {characters.slice(midpoint, characters.length).map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              color={charNameColor}
              iconUrlTemplate={iconUrlTemplate}
              jinxedCharacters={getJinxedCharacters(
                char,
                jinxes,
                allChars,
                inlineJinxIcons,
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
interface CharacterCardProps {
  character: ResolvedCharacter;
  color: string;
  jinxedCharacters: ResolvedCharacter[];
  iconUrlTemplate?: string;
}
function CharacterCard({
  character,
  color,
  jinxedCharacters,
  iconUrlTemplate,
}: CharacterCardProps) {
  const renderAbility = (ability: string) => {
    // Match square brackets at the end of the ability
    const match = ability.match(/^(.*?)(\[.*?\])$/);

    if (match) {
      const [, beforeBrackets, brackets] = match;
      return (
        <>
          {beforeBrackets}
          <strong className="setup-ability">{brackets}</strong>
        </>
      );
    }

    return ability;
  };

  const imageUrl = getImageUrl(character, iconUrlTemplate);
  return (
    <div className="character-card">
      <div className="character-icon-wrapper">
        <img
          src={imageUrl ?? getGenericIconUrl(character.team)}
          alt={character.name}
          className="character-icon"
        />
      </div>
      <div className="character-info">
        <h3 className="character-name" style={{ color: color }}>
          {character.name}
          {jinxedCharacters.length > 0 && (
            <span className="inline-jinx-icons">
              {jinxedCharacters.map((jinxedChar) => {
                const jinxImageUrl = getImageUrl(jinxedChar, iconUrlTemplate);
                return (
                  <img
                    key={jinxedChar.id}
                    src={jinxImageUrl ?? getGenericIconUrl(jinxedChar.team)}
                    alt={jinxedChar.name}
                    className="inline-jinx-icon"
                    title={`Jinxed with ${jinxedChar.name}`}
                  />
                );
              })}
            </span>
          )}
        </h3>
        <p className="character-ability">{renderAbility(character.ability)}</p>
      </div>
    </div>
  );
}

function _calculateMidpoint(characters: ResolvedCharacter[]): number {
  return calculateMidpoint(BALANCE_POINT, characters, (char): number => {
    return char.ability.length;
  });
}

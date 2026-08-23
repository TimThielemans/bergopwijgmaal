import { parserData } from "./parserData";
import { location } from "./location";
import { player, team, training } from "./team";
import {
  activity,
  boardMember,
  clubInfo,
  clubValue,
  socialLink,
  sponsor,
  storyBlock,
} from "./editorial";
import {
  rawCell,
  rawError,
  rawRow,
  rawTeamBlock,
  volleyMatchesRaw,
  volleyRankingsRaw,
} from "./volleyRaw";

export const schemaTypes = [
  // documents
  team,
  location,
  activity,
  sponsor,
  boardMember,
  clubInfo,
  volleyMatchesRaw,
  volleyRankingsRaw,
  // objects
  player,
  training,
  parserData,
  storyBlock,
  clubValue,
  socialLink,
  rawCell,
  rawRow,
  rawTeamBlock,
  rawError,
];

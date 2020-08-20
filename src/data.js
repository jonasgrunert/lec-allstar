import Papa from "papaparse";
import { h, createContext } from "preact";
import { useReducer, useEffect, useMemo, useContext } from "preact/hooks";

const PlayerData = createContext({});
const AllstarData = createContext({});

const STARTING = "STARTING";
const ERROR = "ERROR";
const FINISHED = "FINISHED";

function compareNames(input, name) {
  return new RegExp(input.replace(/ /g, "").toUpperCase()).test(
    name.replace(/ /g, "").toUpperCase()
  );
}

function calcPoints(data, p, players) {
  const points = {};
  data.forEach((row) => {
    Object.keys(row)
      .filter((key) => compareNames(p, key))
      .forEach((place) => {
        if (row[place] == "") return;
        if (!points[row[place]]) {
          points[row[place]] = { points: 0, first: 0, second: 0, third: 0 };
        }
        if (place.startsWith("#1")) {
          points[row[place]].points += 3;
          points[row[place]].first++;
        }
        if (place.startsWith("#2")) {
          points[row[place]].points += 2;
          points[row[place]].second++;
        }
        if (place.startsWith("#3")) {
          points[row[place]].points++;
          points[row[place]].third++;
        }
      });
  });
  return Object.keys(points)
    .map((key) => ({
      id: key,
      value: points[key],
      player: players[key],
    }))
    .sort((a, b) => b.value.points - a.value.points);
}

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      delimiter: ",",
      complete: ({ data, errors, meta }) => {
        if (errors.length > 0) {
          reject(errors);
        } else {
          resolve(data);
        }
      },
    });
  });
}

function dataReducer(state, action) {
  switch (action.type) {
    case STARTING:
      return {
        isLoading: true,
        hasFailed: false,
        wasSuccessful: false,
      };
    case ERROR:
      return {
        isLoading: false,
        hasFailed: true,
        wasSuccessful: false,
        error: action.payload,
      };
    case FINISHED:
      return {
        isLoading: false,
        hasFailed: false,
        wasSuccessful: true,
        data: action.payload,
      };
    default:
      return state;
  }
}

function useAllStarData(url) {
  const [state, dispatch] = useReducer(dataReducer, {
    isLoading: true,
    hasFailed: false,
    wasSuccessful: false,
    error: undefined,
    data: undefined,
  });
  useEffect(() => {
    dispatch({ type: STARTING });
    fetchData(url)
      .then((data) => dispatch({ type: FINISHED, payload: data }))
      .catch((error) => dispatch({ type: ERROR, payload: error.message }));
  }, []);
  return state;
}

function usePlayerData(url) {
  const [state, dispatch] = useReducer(dataReducer, {
    isLoading: true,
    hasFailed: false,
    wasSuccessful: false,
    error: undefined,
    data: undefined,
  });
  useEffect(() => {
    dispatch({ type: STARTING });
    fetch(url)
      .then((data) => {
        if (data.ok) return data.json();
        throw new Error("Could not get player data.");
      })
      .then((data) => dispatch({ type: FINISHED, payload: data }))
      .catch((error) => dispatch({ type: ERROR, payload: error.message }));
  }, []);
  return state;
}

export function useTeams() {
  const { data } = useContext(PlayerData);
  const result = useMemo(
    () =>
      Object.values(data)
        .reduce(
          (p, { team }) => (p.find((t) => t == team) ? p : [...p, team]),
          []
        )
        .sort(),
    [data]
  );
  return result;
}

export function useAffiliations() {
  const { data } = useContext(AllstarData);
  const result = useMemo(
    () =>
      data
        .reduce(
          (p, { Affiliation }) =>
            p.find((t) => t == Affiliation) ? p : [...p, Affiliation],
          []
        )
        .sort(),
    [data]
  );
  return result;
}

export function usePlayers() {
  const { data } = useContext(PlayerData);
  const teams = useTeams();
  return teams.map((t) => ({
    team: t,
    players: Object.values(data)
      .filter((d) => d.team == t)
      .map((d) => d.player),
  }));
}

export function useVoters() {
  const { data } = useContext(AllstarData);
  const affiliation = useAffiliations();
  return affiliation.map((t) => ({
    affiliation: t,
    voters: Object.values(data)
      .filter((d) => d.Affiliation == t)
      .map((d) => d.Voter),
  }));
}

export function useAffiliation(affiliation) {
  const { data } = useContext(AllstarData);
  const { data: players } = useContext(PlayerData);
  const aff = data.find(({ Affiliation }) =>
    compareNames(affiliation, Affiliation)
  ).Affiliation;
  const result = ["Top", "Jungle", "Mid", "ADC", "Support"].map((p) =>
    useMemo(() =>
      calcPoints(
        data.filter((d) => compareNames(affiliation, d.Affiliation)),
        p,
        players,
        [affiliation]
      )
    )
  );
  return { affiliation: aff, result };
}

export function useVoter(voter) {
  const { data } = useContext(AllstarData);
  return data.find(
    ({ Voter, Nickname }) =>
      compareNames(voter, Voter) || compareNames(voter, Nickname)
  );
}

export function usePosition(position) {
  const { data } = useContext(AllstarData);
  const { data: players } = useContext(PlayerData);
  const k = Object.keys(data[0])
    .find((key) => compareNames(position, key))
    .split(" ");
  const p = k[k.length - 1];
  const result = useMemo(() => calcPoints(data, p, players), [position]);
  return {
    result,
    position: p,
  };
}

export function usePlayer(name) {
  const player = useContext(PlayerData);
  const id = Object.keys(player.data).find((key) => compareNames(name, key));
  const position = usePosition(player.data[id].role);
  const result = position.result.find((p) => p.id === id);
  return {
    player: player.data[id],
    points: result
      ? result.value.first * 3 + result.value.second * 2 + result.value.third
      : 0,
    ...(result ? result.value : {}),
    position,
  };
}

export function useTeam(team) {
  const { data } = useContext(PlayerData);
  const teamName =
    data[
      Object.keys(data)[
        Object.values(data).findIndex((d) => compareNames(team, d.team))
      ]
    ].team;
  const players = Object.values(data).filter((p) => p.team === teamName);
  return {
    positions: [
      usePlayer(players.find((p) => p.role == "Top").player),
      usePlayer(players.find((p) => p.role == "Jungle").player),
      usePlayer(players.find((p) => p.role == "Mid").player),
      usePlayer(players.find((p) => p.role == "ADC").player),
      usePlayer(players.find((p) => p.role == "Support").player),
    ],
    team: teamName,
  };
}

export const DataProvider = ({ name, children }) => {
  const players = usePlayerData(`/${name}.json`);
  const allstar = useAllStarData(`/${name}.csv`);
  if (players.isLoading || allstar.isLoading)
    return (
      <section class="hero is-info is-fullheight">
        <div class="hero-body">
          <div class="loader" />
        </div>
      </section>
    );
  if (players.hasFailed || allstar.hasFailed)
    return (
      <section class="hero is-error is-fullheight">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Ooops something went wrong!</h1>
            {players.hasFailed && <h2 class="subtitle">{players.error}</h2>}
            {allstar.hasFailed && <h2 class="subtitle">{allstar.error}</h2>}
          </div>
        </div>
      </section>
    );
  return (
    <AllstarData.Provider value={allstar}>
      <PlayerData.Provider value={players}>{children}</PlayerData.Provider>
    </AllstarData.Provider>
  );
};

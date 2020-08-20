import { Fragment, h } from "preact";
import Helmet from "preact-helmet";
import { usePlayer } from "./data";
import { Pie } from "./pie";
import { Bar } from "./bar";

export const Player = ({ playerName }) => {
  const {
    player,
    first,
    second,
    third,
    points,
    position: { result: position },
  } = usePlayer(playerName);
  const names = player.name.split(" ");
  const firstName = names.filter((_, i) => i !== names.length - 1).join(" ");
  const lastName = names[names.length - 1];
  return (
    <Fragment>
      <Helmet title={`LEC Allstar - ${player.player}`} />
      <section class="hero is-dark is-bold">
        <div class="hero-body">
          <div class="columns is-centered">
            <div class="column is-three-quarters has-text-centered">
              <p class="subtitle is-3">
                {firstName}
                <span class="title is-1"> {player.player} </span>
                {lastName}
              </p>
              <p>
                <a href={`/position/${player.role}`}>{player.role}</a>,{" "}
                <a href={`/team/${player.team}`}>{player.team}</a>,{" "}
                {player.country}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="section has-text-centered">
        <div class="subtitle has-text-grey">
          <span class="title is-1 has-text-grey">{points}</span> pts
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column has-text-centered">
              <h3 class="subtitle">Point Makeup</h3>
              {points != 0 ? (
                <Pie
                  data={[
                    {
                      id: "First",
                      value: first * 3,
                    },
                    {
                      id: "Second",
                      value: second * 2,
                    },
                    {
                      id: "Third",
                      value: third * 1,
                    },
                  ]}
                />
              ) : (
                <div class="notification is-warning">No points given.</div>
              )}
            </div>
            <div class="column has-text-centered">
              <h3 class="subtitle">Position Shares</h3>
              {points != 0 ? (
                <Pie
                  data={[
                    {
                      id: "First",
                      value: first,
                    },
                    {
                      id: "Second",
                      value: second,
                    },
                    {
                      id: "Third",
                      value: third,
                    },
                    {
                      id: "Not mentioned",
                      value: 46 - first - second - third,
                    },
                  ]}
                />
              ) : (
                <div class="notification is-warning">No points given.</div>
              )}
            </div>
            <div class="column has-text-centered">
              <h3 class="subtitle">Comparison</h3>
              <Bar
                data={position.map((p) => ({
                  ...p,
                  value: p.value.points,
                  highlight: player.player === p.id,
                }))}
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

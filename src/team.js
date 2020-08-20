import { Fragment, h } from "preact";
import Helmet from "preact-helmet";
import { useTeam } from "./data";
import { Pie } from "./pie";

export const Team = ({ teamName }) => {
  const { team, positions } = useTeam(teamName);
  return (
    <Fragment>
      <Helmet title={`LEC Allstar - ${team}`} />
      <section class="hero is-dark is-bold">
        <div class="hero-body">
          <div class="columns is-centered">
            <div class="column is-three-quarters has-text-centered">
              <span class="title is-1"> {team} </span>
            </div>
          </div>
        </div>
      </section>
      <section class="section has-text-centered">
        <h2 class="subtitle">
          <span class="title is-1">
            {positions.reduce((p, { points }) => p + points, 0)}
          </span>{" "}
          pts
        </h2>
        <div class="columns is-centered">
          <div class="column is-one-quarter-widescreen is-half">
            <Pie
              data={positions.map((p) => ({
                id: p.position.position,
                value: p.points,
              }))}
            />
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns">
            {positions.map((pos) => (
              <div class="column has-text-centered">
                <h3 class="title is-4">
                  <a
                    href={`/position/${pos.position.position}`}
                    class="has-text-grey-light"
                  >
                    {pos.position.position}
                  </a>
                </h3>
                <h4 class="titl2">
                  <a
                    href={`/player/${pos.player.player}`}
                    class="has-text-grey-dark"
                  >
                    {pos.player.player}
                  </a>
                </h4>
                <p>{pos.player.country}</p>
                <p class="subtitle is-3 has-text-grey">{pos.points} pts</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

import { Fragment, h } from "preact";
import Helmet from "preact-helmet";
import { useAffiliation } from "./data";

export const Affiliation = ({ affiliationName }) => {
  const { affiliation, result } = useAffiliation(affiliationName);
  console.log(result);
  return (
    <Fragment>
      <Helmet title={`LEC Allstar - ${affiliation}`} />
      <section class="hero is-dark is-bold">
        <div class="hero-body">
          <div class="columns is-centered">
            <div class="column is-three-quarters has-text-centered">
              <p class="subtitle is-3">
                <span class="title is-1"> {affiliation} </span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns">
            {["Top", "Jungle", "Mid", "ADC", "Support"].map((pos, i) => (
              <div class="column has-text-centered">
                <h3 class="subtitle">
                  <a href={`/position/${pos}`}>{pos}</a>
                </h3>
                <div class="table-container">
                  <table class="table is-bordered is-fullwidth">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result[i].map((p) => (
                        <tr>
                          <td>
                            <a href={`/player/${p.id}`}>{p.id}</a>
                          </td>
                          <td>
                            <a href={`/team/${p.player.team}`}>
                              {p.player.team}
                            </a>
                          </td>
                          <td>{p.value.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

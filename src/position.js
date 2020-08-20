import { Fragment, h } from "preact";
import Helmet from "preact-helmet";
import { useState } from "preact/hooks";
import { usePosition } from "./data";
import { Bar } from "./bar";

export const Position = ({ pos }) => {
  const [sortedBy, changeSort] = useState("points");
  const { result, position } = usePosition(pos);
  return (
    <Fragment>
      <Helmet title={`LEC Allstar - ${position}`} />
      <section class="hero is-dark is-bold">
        <div class="hero-body">
          <div class="columns is-centered">
            <div class="column is-three-quarters has-text-centered">
              <span class="title is-1"> {position} </span>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column has-text-centered">
              <div class="table-container">
                <table class="table is-striped is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th></th>
                      <th>
                        <button class="button is-text">Team</button>
                      </th>
                      <th>
                        <button
                          class="button is-text"
                          onClick={() => changeSort("first")}
                        >
                          First
                        </button>
                      </th>
                      <th>
                        <button
                          class="button is-text"
                          onClick={() => changeSort("second")}
                        >
                          Second
                        </button>
                      </th>
                      <th>
                        <button
                          class="button is-text"
                          onClick={() => changeSort("third")}
                        >
                          Third
                        </button>
                      </th>
                      <th>
                        <button
                          class="button is-text"
                          onClick={() => changeSort("points")}
                        >
                          Points
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result
                      .sort((a, b) => b.value[sortedBy] - a.value[sortedBy])
                      .map((d) => (
                        <tr>
                          <th>
                            <a href={`/player/${d.id}`}>{d.id}</a>
                          </th>
                          <td>
                            <a href={`/team/${d.player.team}`}>
                              {d.player.team}
                            </a>
                          </td>
                          <td>{d.value.first}</td>
                          <td>{d.value.second}</td>
                          <td>{d.value.third}</td>
                          <th>{d.value.points}</th>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="column has-text-centered">
              <Bar
                data={result
                  .map((p) => ({
                    ...p,
                    value: p.value[sortedBy],
                  }))
                  .sort((a, b) => b.value - a.value)}
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
